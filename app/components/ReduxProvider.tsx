'use client';

import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { useEffect } from 'react';
import { fetchCurrentWebsite } from '@/app/store/slices/websiteSlice';
import { fetchCurrentUser } from '@/app/store/slices/userSlice';
import WebsiteStyles from './WebsiteStyles';

function StoreInitializer() {
    useEffect(() => {
        // Fetch initial data when app loads
        store.dispatch(fetchCurrentWebsite());
        store.dispatch(fetchCurrentUser());

        // Set up polling for real-time updates (every 10 seconds)
        const intervalId = setInterval(() => {
            store.dispatch(fetchCurrentWebsite());
        }, 10000);

        return () => clearInterval(intervalId);
    }, []);

    return null;
}

export default function ReduxProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Provider store={store}>
            <WebsiteStyles />
            <StoreInitializer />
            {children}
        </Provider>
    );
}
