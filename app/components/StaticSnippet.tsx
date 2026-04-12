'use client';

import React from 'react';
import { useRouter } from '@/navigation';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { openModal, closeModal } from '@/app/store/slices/dynamicModalSlice';
import { sanitizeHtml } from '@/app/utils/sanitize';
import { useLocale } from 'next-intl';

interface StaticSnippetProps {
    htmlContent: string;
    snippet?: any;
}

/**
 * StaticSnippet handles the rendering of raw HTML content (static snippets)
 * and intercepts click events on <a> tags to provide smooth SPA navigation
 * instead of full page reloads.
 */
export default function StaticSnippet({ htmlContent, snippet }: StaticSnippetProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { name, logo } = useAppSelector((state) => state.website);
    const locale = useLocale();

    const handleClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        const link = target.closest('a');

        if (link && link.href && link.href.startsWith(window.location.origin)) {
            const pathWithHash = link.href.replace(window.location.origin, '');
            const [path, hash] = pathWithHash.split('#');

            // 1. Check for Modal Trigger (starts with #modal-)
            if (hash && hash.startsWith('modal-') && snippet) {
                e.preventDefault();
                const id = hash.replace('modal-', '');
                if (id) {
                    dispatch(openModal({ dynamicId: id, snippet: snippet }));
                    return;
                }
            }

            // 2. Standard SPA Navigation
            // next-intl automatically handles the current locale in router.push
            e.preventDefault();

            let cleanPath = path;
            const localesList = ['ar', 'en'];
            for (const loc of localesList) {
                if (cleanPath.startsWith(`/${loc}/`)) {
                    cleanPath = cleanPath.replace(`/${loc}`, '');
                    break;
                } else if (cleanPath === `/${loc}`) {
                    cleanPath = '/';
                    break;
                }
            }

            dispatch(closeModal());
            router.push(cleanPath as any);
        }
    };

    // Replace dynamic variables in the static HTML
    const websiteName = name ? (typeof name === 'string' ? name : (name as any)[locale] || (name as any)['ar'] || '') : '';
    const FALLBACK_LOGO = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";
    const processedHtml = htmlContent
        .replace(/{{logo}}/g, logo || FALLBACK_LOGO)
        .replace(/{{name}}/g, websiteName);

    return (
        <div
            onClick={handleClick}
            className={`max-w-none ${locale === 'ar' ? 'rtl-content' : ''}`}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(processedHtml) }}
        />
    );
}
