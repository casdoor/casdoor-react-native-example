/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import { WebView } from 'react-native-webview';
import {Image, LogBox, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, useColorScheme, View} from 'react-native';
import SDK from 'casdoor-react-native-sdk';

const App = () => {
  LogBox.ignoreAllLogs();
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? 'black' : 'white',
  };

  const sdkConfig = {
    serverUrl: 'https://door.casdoor.com',
    clientId: 'b800a86702dd4d29ec4d',
    appName: 'app-example',
    organizationName: 'casbin',
    redirectPath: 'http://localhost:5000/callback',
    signinPath: '/api/signin',
  };
  const sdk = new SDK(sdkConfig);

  const [webViewVisible, setWebViewVisible] = useState(false);
  const [scrollViewVisible, setScrollViewVisible] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [casdoorLoginURL, setCasdoorLoginURL] = useState('');

  const handleCasdoorLogin = async () => {
    setScrollViewVisible(false);
    setWebViewVisible(true);

    const signinUrl = await sdk.getSigninUrl();
    setCasdoorLoginURL(signinUrl);
  };

  const handleLogout = () => {
    setUserInfo(null);
    setWebViewVisible(false);
    setScrollViewVisible(true);
    sdk.clearState();
  };

  const onNavigationStateChange = async(navState) => {
    if (navState.url.startsWith(sdkConfig.redirectPath)) {
      const token = await sdk.getAccessToken(navState.url);
      const userInfo = sdk.JwtDecode(token);
      setUserInfo(userInfo);

      setWebViewVisible(false);
      setScrollViewVisible(false);
    }
  };

  const renderWebview = webViewVisible && (
      <WebView
          source={{ uri: casdoorLoginURL }}
          onNavigationStateChange={onNavigationStateChange}
          style={{ flex: 1 }}
          mixedContentMode='always'
      />
  );

  return (
      <SafeAreaView style={backgroundStyle}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        {renderWebview}
        {scrollViewVisible && (
            <View style={{ flex: 1 }}>
              <ScrollView contentInsetAdjustmentBehavior='automatic' style={backgroundStyle}>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button} onPress={handleCasdoorLogin}>
                    <Text style={styles.buttonText}>Login with Casdoor</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
        )}
        {userInfo && (
            <View style={{ flex: 1 }}>
              <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
                {userInfo && (
                    <View style={styles.userInfoContainer}>
                      <View style={styles.userInfoCard}>
                        <Text style={styles.userInfoTitle}>User Information</Text>
                        <View style={styles.avatarContainer}>
                          <Image
                              source={{ uri: userInfo.avatar }}
                              style={styles.avatar}
                          />
                        </View>
                        <Text style={styles.userInfoText}>{userInfo.name}</Text>
                        <Text style={styles.userInfoText}>{userInfo.email}</Text>
                        {/* add other userInfo here. */}
                      </View>
                      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.buttonText}>Logout</Text>
                      </TouchableOpacity>
                    </View>
                )}
              </ScrollView>
            </View>
        )}
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 400,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userInfoContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfoCard: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
    marginTop: 200,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userInfoText: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 8,
  },
  logoutButton: {
    backgroundColor: '#FF6347',
    padding: 12,
    borderRadius: 5,
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
export default App;
