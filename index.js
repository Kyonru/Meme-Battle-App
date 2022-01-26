/**
 * @format
 */

import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';

import App from './src/navigation/container';
AppRegistry.registerComponent(appName, () => App);
