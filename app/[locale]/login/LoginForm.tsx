'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useAppDispatch } from '@/app/store/hooks';
import { fetchCurrentUser } from '@/app/store/slices/userSlice';

export default function LoginForm({ showRegister }: { showRegister: boolean }) {
    const t = useTranslations('Login');
    const ts = useTranslations('Setup');
    const commonT = useTranslations('Common');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const params = useParams();
    const locale = params.locale as string;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                await dispatch(fetchCurrentUser());
                router.push(`/${locale}/admin`);
            } else {
                const data = await res.json();
                // Try to translate the message from API, fallback to generic error
                const messageKey = data.message;
                try {
                    setError(t(messageKey) || commonT(messageKey) || data.message || commonT('error'));
                } catch (e) {
                    setError(data.message || commonT('error'));
                }
            }
        } catch (err) {
            setError(commonT('error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-white mb-2">{t('welcome')}</h1>
                <p className="text-white/70">{t('subtitle')}</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-xl text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">{t('identifierLabel') || t('emailLabel')}</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl !text-white placeholder-white/30 focus:outline-hidden focus:ring-2 focus:ring-primary transition-all"
                        placeholder={t('emailPlaceholder') || "admin@example.com"}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">{t('passwordLabel')}</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl !text-white placeholder-white/30 focus:outline-hidden focus:ring-2 focus:ring-primary transition-all"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-primary-dark hover:bg-white/90"
                >
                    {loading ? t('signingIn') : t('btn')}
                </button>
            </form>

            {showRegister && (
                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <p className="text-white/60 mb-4">{t('noAccountYet') || 'No account yet?'}</p>
                    <Link
                        href={`/${locale}/setup`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary/20 hover:bg-primary/30 text-white rounded-xl border border-white/20 transition-all font-semibold"
                    >
                        {ts('welcome')}
                    </Link>
                </div>
            )}
        </div>
    );
}
