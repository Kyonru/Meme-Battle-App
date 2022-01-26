import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {PersistGate} from 'redux-persist/lib/integration/react';

import App from '../screens/room';
import LogIn from '../screens/log-in';
import {SCREEN_NAME} from './constants';
import {Provider} from 'react-redux';
import store, {persistor} from '../stores';

const Stack = createNativeStackNavigator();

export default function AppNavigationContainer() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }}
              initialRouteName={SCREEN_NAME.LOG_IN}>
              <Stack.Screen name={SCREEN_NAME.LOG_IN} component={LogIn} />
              <Stack.Screen name={SCREEN_NAME.ROOM} component={App} />
            </Stack.Navigator>
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
