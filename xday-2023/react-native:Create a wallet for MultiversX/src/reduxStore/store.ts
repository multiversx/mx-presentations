import { configureStore, Middleware } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import rootReducer from './rootReducer';
import { persistReducer, persistStore } from 'redux-persist';
import { RootApi } from './apis/root.api';

const persistConfig = {
  key: 'wallet-app-store',
  version: 1,
  timeout: 0,
  storage: AsyncStorage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const apiMiddlewares: Middleware[] = [RootApi?.middleware];

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
      autoBatch: true
    }).concat(...apiMiddlewares)
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export default store;
