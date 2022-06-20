import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {PersistGate} from 'redux-persist/lib/integration/react';
import {Provider} from 'react-redux';

import store, {persistor} from '../stores';
import App from '../screens/room';
import LogIn from '../screens/log-in';
import Ending from '../screens/ending';

import {SCREEN_NAME} from './constants';
import {cardStyleInterpolatorHelper} from './helpers';

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
              <Stack.Screen
                name={SCREEN_NAME.ENDING}
                component={Ending}
                options={
                  {
                    //...OTHER OPTIONS
                    // headerStyleInterpolator: headerStyleInterpolatorHelper,
                    cardStyleInterpolator: cardStyleInterpolatorHelper,
                  } as any
                }
              />
            </Stack.Navigator>
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
