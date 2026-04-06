import { configureStore } from '@reduxjs/toolkit';
import websiteReducer from './slices/websiteSlice';
import userReducer from './slices/userSlice';
import dynamicModalReducer from './slices/dynamicModalSlice';

export const store = configureStore({
    reducer: {
        website: websiteReducer,
        user: userReducer,
        dynamicModal: dynamicModalReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
});

// Types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
