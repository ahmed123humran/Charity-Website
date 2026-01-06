'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
    const t = useTranslations('Footer');
    const commonT = useTranslations('Common');

    return (
        <footer className="bg-slate-950 text-slate-300 py-20 border-t border-white/5 rtl:text-right">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                <div className="w-4 h-4 rounded-xs rotate-45" style={{ backgroundColor: 'var(--primary-color)' }} />
                            </div>
                            <span className="text-xl font-bold text-white tracking-widest lowercase">
                                {commonT('title')}
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {t('desc')}
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                                <Facebook className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                                <Twitter className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                                <Instagram className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-6">{t('quickLinks')}</h3>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/" className="hover:text-white transition-colors">{commonT('home')}</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">{t('activeCharities')}</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">{t('latestProjects')}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-6">{t('support')}</h3>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="#" className="hover:text-white transition-colors">{t('helpCenter')}</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">{t('contactUs')}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-6">{t('contactDetails')}</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex gap-3">
                                <MapPin className="w-5 h-5 shrink-0" style={{ color: 'var(--primary-color)' }} />
                                <span>{t('address')}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 shrink-0" style={{ color: 'var(--primary-color)' }} />
                                <span dir="ltr">+967 783881666</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 shrink-0" style={{ color: 'var(--primary-color)' }} />
                                <span>info@rafde.org</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-20 pt-8 border-t border-white/5 text-center text-xs text-slate-500">
                    <p>© 2026 {t('rights')}</p>
                </div>
            </div>
        </footer>
    );
}
