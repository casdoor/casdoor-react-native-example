// must be imported before the SDK: the PKCE code is generated with crypto.getRandomValues(), which Hermes does not provide
import 'react-native-get-random-values';
import {registerRootComponent} from 'expo';
import App from './App';

registerRootComponent(App);
