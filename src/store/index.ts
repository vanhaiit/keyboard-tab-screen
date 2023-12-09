import { authReducer } from '@/features/auth/slice/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import { setupListeners } from '@reduxjs/toolkit/query';

import { baseQueryApi } from './baseQueryApi';
import { postReducer } from '@/features/post/slice';
import { searchReducer } from '@/features/search/slice';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['auth', 'search'],
};
const rootReducer = combineReducers({
  [baseQueryApi.reducerPath]: baseQueryApi.reducer,
  auth: authReducer,
  search: searchReducer,
  post: postReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseQueryApi.middleware),
});

// // configure listeners using the provided defaults
setupListeners(store.dispatch);

const persistor = persistStore(store);

export { store, persistor };
