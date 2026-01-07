'use client';

import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function ContentStatus({ isEmpty }: { isEmpty: boolean }) {
    useEffect(() => {
        if (isEmpty) {
            toast('This page has no content yet.', {
                icon: 'ℹ️',
                duration: 5000,
            });
        }
    }, [isEmpty]);

    return null;
}
