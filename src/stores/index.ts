import {configureStore} from '@reduxjs/toolkit';
import storage from '@react-native-async-storage/async-storage';
import {combineReducers} from 'redux';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';

import roomSlice from './room/slice';

const persistConfig = {
  key: 'root',
  storage,
};

export const reducers = combineReducers({
  room: roomSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

const middlewares: any[] = [
  /* other middlewares */
];

if (__DEV__) {
  const createDebugger = require('redux-flipper').default;
  middlewares.push(createDebugger());
}

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(middlewares),
});

export const persistor = persistStore(store, {}, () => {
  // const state = store.getState() as StoreState;
  // if (state.session.user?.phone) {
  //   setUserPhone(state.session.user.phone);
  // }
  // const token = getToken(state);
  // if (token && token.accessToken) {
  //   setApiToken(token.accessToken);
  // }
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
