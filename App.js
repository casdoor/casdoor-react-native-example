/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import { WebView } from 'react-native-webview';
import jwtDecode from 'jwt-decode';
import {Image, LogBox, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, useColorScheme, View} from 'react-native';
const App = () => {
  LogBox.ignoreAllLogs();
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? 'black' : 'white',
  };

  const Config = {
    serverUrl: 'https://door.casdoor.com',
    clientId: 'b800a86702dd4d29ec4d',
    clientSecret: '1219843a8db4695155699be3a67f10796f2ec1d5',
    appName: 'app-example',
    redirectPath: 'http://localhost:5000/callback',
  };

  const casdoorLoginURL = 'https://door.casdoor.com/login/oauth/authorize' +
      `?client_id=${Config.clientId}&response_type=code&redirect_uri=${Config.redirectPath}&scope=read&state=${Config.appName}`;

  const [webViewVisible, setWebViewVisible] = useState(false);
  const [scrollViewVisible, setScrollViewVisible] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  const handleCasdoorLogin = () => {
    setScrollViewVisible(false);
    setWebViewVisible(true);
  };

  const handleLogout = () => {
    setUserInfo(null);
    setWebViewVisible(false);
    setScrollViewVisible(true);
  };

  const onNavigationStateChange = async(navState) => {
    if (navState.url.startsWith(Config.redirectPath)) {
      const codeStartIndex = navState.url.indexOf('code=') + 5;
      const codeEndIndex = navState.url.indexOf('&', codeStartIndex);
      const code = navState.url.substring(codeStartIndex, codeEndIndex);
      const stateStartIndex = navState.url.indexOf('state=') + 6;
      const state = navState.url.substring(stateStartIndex);
      try {
        const response = await fetch(`${Config.serverUrl}/api/login/oauth/access_token?client_id=${Config.clientId}&client_secret=${Config.clientSecret}&grant_type=authorization_code&code=${code}`,
            {
          method: 'POST',
          credentials: "include",
        });
        if (response.ok) {
          const responseData = await response.json();
          const token = responseData.access_token;
          const userInfo = jwtDecode(token);
          // console.log('UserInfo:', userInfo);
          // console.log('UserInfo.name', userInfo.name);
          // console.log('UserInfo.avatar', userInfo.avatar);
          // console.log('UserInfo.createdTime', userInfo.createdTime);
          // console.log('UserInfo.owner', userInfo.owner);

          setUserInfo(userInfo);
        }
      } catch (error) {
        console.error('Error during Signin Request:', error);
      }

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
