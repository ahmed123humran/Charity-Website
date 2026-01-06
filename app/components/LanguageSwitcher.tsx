'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/navigation';
import { Languages } from 'lucide-react';

export default function LanguageSwitcher({ className }: { className?: string }) {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const toggleLanguage = () => {
        const nextLocale = locale === 'en' ? 'ar' : 'en';
        router.replace(pathname, { locale: nextLocale });
    };

    return (
        <button
            onClick={toggleLanguage}
            className={className || "flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-600 font-bold"}
            title={locale === 'en' ? 'Switch to Arabic' : 'تغيير للإنجليزية'}
        >
            <Languages className="w-5 h-5 text-[var(--primary-color)]" />
            <span className="text-sm uppercase">{locale === 'en' ? 'AR' : 'EN'}</span>
        </button>
    );
}
