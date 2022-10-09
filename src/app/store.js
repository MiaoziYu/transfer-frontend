import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../features/transfers/slices/apiSlice'
import transferStatusReducer from '../features/transfers/slices/transferStatusSlice';

export const store = configureStore({
  reducer: {
    transferStatus: transferStatusReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware)
});
