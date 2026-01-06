import { configureStore } from '@reduxjs/toolkit';
import websiteReducer from './slices/websiteSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
    reducer: {
        website: websiteReducer,
        user: userReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
});

// Types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
