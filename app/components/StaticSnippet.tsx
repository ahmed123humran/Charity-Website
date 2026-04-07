'use client';

import React from 'react';
import { useRouter } from '@/navigation';
import { useAppDispatch } from '@/app/store/hooks';
import { openModal, closeModal } from '@/app/store/slices/dynamicModalSlice';
import { sanitizeHtml } from '@/app/utils/sanitize';

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

    return (
        <div
            onClick={handleClick}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(htmlContent) }}
        />
    );
}
