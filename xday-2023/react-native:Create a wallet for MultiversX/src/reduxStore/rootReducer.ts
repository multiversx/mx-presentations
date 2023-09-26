import { combineReducers } from '@reduxjs/toolkit';

import wallets from './slices/walletsSlice';
import { RootApi } from './apis/root.api';

const apisCollection = [RootApi];

const apiReducers = apisCollection.reduce((acc, next) => {
  if (next == null) {
    return acc;
  }
  acc[next?.reducerPath] = next.reducer;
  return acc;
}, {});

const rootReducer = combineReducers({
  wallets,
  ...apiReducers
});

export default rootReducer;
