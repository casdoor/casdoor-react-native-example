# casdoor-react-native-example

This example uses [casdoor-react-native-sdk](https://github.com/casdoor/casdoor-react-native-sdk).
This example describes how to use casdoor in [react-native](https://reactnative.dev/) with [Expo](https://expo.dev/).

## Quick Start

This example is an [Expo](https://expo.dev/) app. `sdk.signin()` opens the Casdoor login page with [expo-web-browser](https://docs.expo.dev/versions/latest/sdk/webbrowser/) and returns the access token after Casdoor redirects back to the app.

- download the code

```bash
git clone git@github.com:casdoor/casdoor-react-native-example.git
```

- install dependencies

```bash
cd casdoor-react-native-example
yarn install
```

- run the app

```bash
yarn start
```

Then scan the QR code with [Expo Go](https://expo.dev/go) on your phone, or press `i` for the iOS simulator, `a` for the Android emulator and `w` for the web.

## After running, you will see the following  interfaces:

|                           **iOS**                           |                         **Android**                          |
| :---------------------------------------------------------: | :----------------------------------------------------------: |
| <img src="./iOS-gif.gif" alt="iOS-gif" style="zoom:30%;" /> | <img src="./Android-gif.gif" alt="Android-gif" style="zoom: 30%;" /> |


## Configure

The SDK is configured in `App.js`:

| Name             | Must | Description                                                                   |
| ---------------- | ---- | ----------------------------------------------------------------------------- |
| serverUrl        | Yes  | Casdoor Server Url, such as `https://door.casdoor.com`                        |
| clientId         | Yes  | Your client id                                                                |
| appName          | Yes  | Application name                                                              |
| organizationName | Yes  | the name of the Casdoor organization connected with your Casdoor application |
| redirectPath     | Yes  | the redirect URL, use `AuthSession.makeRedirectUri()`                         |

```javascript
const sdkConfig = {
  serverUrl: 'https://door.casdoor.com',
  clientId: 'b800a86702dd4d29ec4d',
  appName: 'app-example',
  organizationName: 'casbin',
  redirectPath: AuthSession.makeRedirectUri({path: 'callback'}),
};
```

`makeRedirectUri()` returns a different URL in each environment, add the one you use to the **Redirect URLs** of your application in Casdoor:

| Environment        | Redirect URL                         |
| ------------------ | ------------------------------------ |
| Development build  | `casdoorexample://callback`          |
| Expo Go            | `exp://<your-ip>:8081/--/callback`   |
| Web                | `http://localhost:8081/callback`     |

The `casdoorexample` scheme is set in `app.json`, change it to your own scheme.

## License

This project is licensed under the [Apache 2.0 license](https://github.com/casdoor/casdoor-dotnet-sdk/blob/master/LICENSE).
