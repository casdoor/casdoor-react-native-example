# casdoor-react-native-example

This example describes how to use casdoor in [react-native](https://reactnative.dev/).

## Quick Start

- download the code

```bash
 git clone git@github.com:casdoor/casdoor-react-native-example.git
```

- install dependencies
```bash 
 cd casdoor-react-native-example
 yarn install
 cd ios/
 pod install
```
- run on ios
```bash
cd casdoor-react-native-example
react-native start
react-native run-ios
```
- run on android
```bash
cd casdoor-react-native-example
react-native start
react-native run-android
```
>Make sure to turn on the emulator or real device before running.

## After running, you will see the following  interfaces:

|                           **iOS**                           |                         **Android**                          |
| :---------------------------------------------------------: | :----------------------------------------------------------: |
| <img src="./iOS-gif.gif" alt="iOS-gif" style="zoom:30%;" /> | <img src="./Android-gif.gif" alt="Android-gif" style="zoom: 30%;" /> |


## Configure

Initialization requires 6 parameters, which are all str type:
| Name         | Must | Description                                            |
| ------------ | ---- | ------------------------------------------------------ |
| serverUrl    | Yes  | Casdoor Server Url, such as `https://door.casdoor.com` |
| redirectPath | Yes  | redirectPath                                           |
| appName      | Yes  | Application name                                       |
| clientId     | Yes  | Your client id                                         |
| clientSecret | Yes  | Your client secret                                     |
|              |      |                                                        |

```javascript
  const Config = {
    serverUrl: 'https://door.casdoor.com',
    clientId: <your clientId>,
    clientSecret: <your clientSecret>,
    appName: 'app-example',
    redirectPath: 'http://localhost:5000/callback',
  };
```

## License

This project is licensed under the [Apache 2.0 license](https://github.com/casdoor/casdoor-dotnet-sdk/blob/master/LICENSE).
