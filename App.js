import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, useColorScheme, View} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import SDK from 'casdoor-react-native-sdk';

// closes the login popup on the web after Casdoor redirects back to the app
WebBrowser.maybeCompleteAuthSession();

const sdkConfig = {
  serverUrl: 'https://door.casdoor.com',
  clientId: 'b800a86702dd4d29ec4d',
  appName: 'app-example',
  organizationName: 'casbin',
  // casdoorexample://callback in a development build, exp://<your-ip>:8081/--/callback in Expo Go,
  // http://localhost:8081/callback on the web; add the one you use to the Redirect URLs of your Casdoor application
  redirectPath: AuthSession.makeRedirectUri({path: 'callback'}),
};
const sdk = new SDK(sdkConfig);

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState('');

  const handleCasdoorLogin = async () => {
    setError('');
    try {
      const token = await sdk.signin(WebBrowser.openAuthSessionAsync);
      if (token) {
        setUserInfo(sdk.JwtDecode(token));
      }
    } catch (e) {
      setError(String(e));
    }
  };

  const handleLogout = () => {
    setUserInfo(null);
    sdk.clearState();
  };

  return (
    <View style={[styles.container, {backgroundColor: isDarkMode ? 'black' : 'white'}]}>
      <StatusBar style="auto" />
      {userInfo ? (
        <View style={styles.userInfoContainer}>
          <View style={styles.userInfoCard}>
            <Text style={styles.userInfoTitle}>User Information</Text>
            <View style={styles.avatarContainer}>
              <Image source={{uri: userInfo.avatar}} style={styles.avatar} />
            </View>
            <Text style={styles.userInfoText}>{userInfo.name}</Text>
            <Text style={styles.userInfoText}>{userInfo.email}</Text>
            {/* add other userInfo here. */}
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleCasdoorLogin}>
            <Text style={styles.buttonText}>Login with Casdoor</Text>
          </TouchableOpacity>
          {error !== '' && <Text style={styles.errorText}>{error}</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    padding: 20,
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
  errorText: {
    color: '#FF6347',
    marginTop: 12,
    textAlign: 'center',
  },
  userInfoContainer: {
    padding: 20,
    alignItems: 'center',
  },
  userInfoCard: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
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
