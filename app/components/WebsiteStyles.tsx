'use client';

import { useAppSelector } from '@/app/store/hooks';
import { useEffect } from 'react';

export default function WebsiteStyles() {
    const { themeColor, secondaryColor, fontFamily } = useAppSelector((state) => state.website);

    useEffect(() => {
        if (themeColor) {
            document.documentElement.style.setProperty('--primary-color', themeColor);

            // Generate some variant colors based on themeColor (simplified)
            // In a real app, you might use a color library to generate these
            document.documentElement.style.setProperty('--primary-dark', themeColor);
            document.documentElement.style.setProperty('--primary-glow', `${themeColor}40`);
            document.documentElement.style.setProperty('--primary-muted', `${themeColor}20`);
        }

        if (secondaryColor) {
            document.documentElement.style.setProperty('--secondary-color', secondaryColor);
            document.documentElement.style.setProperty('--secondary-dark', secondaryColor);
            document.documentElement.style.setProperty('--secondary-glow', `${secondaryColor}40`);
            document.documentElement.style.setProperty('--secondary-muted', `${secondaryColor}20`);
        }

        if (fontFamily) {
            document.documentElement.style.setProperty('--font-family', `"${fontFamily}", system-ui, sans-serif`);
        } else {
            // Default font if not set
            document.documentElement.style.setProperty('--font-family', '"Inter", system-ui, sans-serif');
        }
    }, [themeColor, secondaryColor, fontFamily]);

    return null;
}
