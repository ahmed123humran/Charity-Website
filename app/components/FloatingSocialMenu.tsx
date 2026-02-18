'use client';

import { useState, useEffect } from 'react';
import { Share2, X } from 'lucide-react';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';

interface SocialMedia {
    id: string;
    name: any;
    url: string;
    image: string | null;
}

export default function FloatingSocialMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [items, setItems] = useState<SocialMedia[]>([]);
    const locale = useLocale();
    const pathname = usePathname();

    const isAdmin = pathname?.includes(`/${locale}/admin`) || pathname?.includes('/admin');

    useEffect(() => {
        if (isAdmin) return;
        fetch('/api/social-media')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setItems(data);
                }
            })
            .catch(err => console.error('Failed to fetch social media:', err));
    }, [isAdmin]);

    const getSocialUrl = (url: string) => {
        // Check if it's a WhatsApp link
        const isWhatsApp = url.includes('wa.me') || url.includes('whatsapp.com') || /^\+?\d+$/.test(url.trim());

        if (isWhatsApp) {
            // Extract phone number digit only
            const phone = url.replace(/[^0-9]/g, '');
            const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

            if (isMobile) {
                return `https://wa.me/${phone}`;
            } else {
                return `https://web.whatsapp.com/send?phone=${phone}`;
            }
        }
        return url;
    };

    if (items.length === 0 || isAdmin) return null;

    return (
        <div className="fixed bottom-10 left-10 z-50 flex flex-col-reverse items-center">
            {/* Main Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-[0_10px_40px_rgba(0,0,0,0.2)] hover:shadow-primary/40 hover:scale-110 active:scale-95 ${isOpen ? 'bg-slate-900 text-white rotate-180' : 'bg-primary text-white'
                    } border-4 border-white dark:border-slate-800 z-10 group`}
            >
                {isOpen ? <X className="w-8 h-8" /> : <Share2 className="w-8 h-8 group-hover:scale-110 transition-transform" />}
            </button>

            {/* Social Icons Container */}
            <div
                className={`flex flex-col-reverse items-center mb-4 transition-all duration-700 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-32 pointer-events-none'
                    }`}
            >
                {items.map((item, index) => (
                    <a
                        key={item.id}
                        href={getSocialUrl(item.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-14 h-14 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/50 dark:border-slate-700/50 group/item mb-4 relative"
                        style={{
                            transitionDelay: isOpen ? `${index * 100}ms` : '0ms',
                            transform: isOpen ? `translateY(${index * -2}px)` : 'translateY(20px)'
                        } as any}
                    >
                        {item.image ? (
                            <img src={item.image} alt="" className="w-7 h-7 object-contain group-hover/item:scale-110 transition-transform" />
                        ) : (
                            <Share2 className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover/item:text-primary transition-colors" />
                        )}

                        {/* Tooltip */}
                        <div className="absolute left-full ml-5 px-4 py-2 bg-slate-900/90 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover/item:opacity-100 translate-x-4 group-hover/item:translate-x-0 transition-all duration-300 pointer-events-none shadow-2xl">
                            {item.name?.[locale] || item.name?.en || item.name?.ar}
                        </div>

                        {/* Pulsing Ring for Hover */}
                        <div className="absolute inset-0 rounded-full bg-primary/20 opacity-0 group-hover/item:animate-ping -z-10"></div>
                    </a>
                ))}
            </div>

            <style jsx>{`
                .bg-primary {
                    background-color: var(--primary-color, #4f46e5);
                }
                .hover\:shadow-primary\/40:hover {
                    box-shadow: 0 10px 40px -5px var(--primary-color, #4f46e5);
                }
                .group-hover\/item\:text-primary:hover svg {
                    color: var(--primary-color, #4f46e5);
                }
            `}</style>
        </div>
    );
}
