import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react-native';
import * as WebBrowser from 'expo-web-browser';
import App from '../App';

// the SDK is compiled to CommonJS and reads the default export
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
}));
jest.mock('expo-auth-session', () => ({
  makeRedirectUri: () => 'casdoorexample://callback',
}));
jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
  openAuthSessionAsync: jest.fn(),
}));

it('renders the login button', async () => {
  await render(<App />);

  expect(screen.getByText('Login with Casdoor')).toBeTruthy();
});

it('opens the Casdoor login page with PKCE', async () => {
  WebBrowser.openAuthSessionAsync.mockResolvedValue({type: 'cancel'});
  await render(<App />);

  await fireEvent.press(screen.getByText('Login with Casdoor'));

  await waitFor(() => expect(WebBrowser.openAuthSessionAsync).toHaveBeenCalled());
  const [signinUrl, redirectUri] = WebBrowser.openAuthSessionAsync.mock.calls[0];
  expect(redirectUri).toEqual('casdoorexample://callback');
  expect(signinUrl).toContain('https://door.casdoor.com/login/oauth/authorize?client_id=b800a86702dd4d29ec4d');
  expect(signinUrl).toContain(`redirect_uri=${encodeURIComponent(redirectUri)}`);
  expect(signinUrl).toContain('code_challenge_method=S256');
});
