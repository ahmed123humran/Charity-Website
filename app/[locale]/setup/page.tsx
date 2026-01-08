'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'react-hot-toast';
import { User, Globe, Shield, CheckCircle, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

export default function SetupPage() {
    const t = useTranslations('Setup');
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        password: '',
        confirmPassword: '',
        companyName: '',
        domain: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => {
        if (step === 1) {
            if (!formData.name || !formData.phone || !formData.password) {
                toast.error(t('fillAllFields'));
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                toast.error(t('passwordsDontMatch'));
                return;
            }
        }
        setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/setup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success(t('setupComplete'));
                router.push(`/${locale}/admin`);
            } else {
                const data = await res.json();
                toast.error(data.error || t('setupError'));
            }
        } catch (error) {
            toast.error(t('setupError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
                {/* Header */}
                <div className="bg-primary p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold mb-2">{t('welcome')}</h1>
                        <p className="opacity-80">{t('subtitle')}</p>
                    </div>
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                </div>

                {/* Progress Bar */}
                <div className="flex h-1 bg-slate-100">
                    <div
                        className="bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${(step / 2) * 100}%` }}
                    ></div>
                </div>

                <div className="p-8">
                    {/* Stepper Icons */}
                    <div className="flex justify-between mb-10">
                        <div className={`flex flex-col items-center flex-1 ${step >= 1 ? 'text-primary' : 'text-slate-300'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 border-2 ${step >= 1 ? 'border-primary bg-primary/10' : 'border-slate-200'}`}>
                                <User size={20} />
                            </div>
                            <span className="text-sm font-medium">{t('adminDetails')}</span>
                        </div>
                        <div className="flex items-center w-12 mb-6">
                            <div className={`h-0.5 w-full ${step >= 2 ? 'bg-primary' : 'bg-slate-200'}`}></div>
                        </div>
                        <div className={`flex flex-col items-center flex-1 ${step >= 2 ? 'text-primary' : 'text-slate-300'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 border-2 ${step >= 2 ? 'border-primary bg-primary/10' : 'border-slate-200'}`}>
                                <Globe size={20} />
                            </div>
                            <span className="text-sm font-medium">{t('websiteDetails')}</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('fullName')}</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder={t('fullNamePlaceholder')}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('phoneNumber')}</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="05xxxxxxx"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('password')}</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('confirmPassword')}</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('companyName')}</label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        placeholder={t('companyNamePlaceholder')}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('domainName')}</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="domain"
                                            value={formData.domain}
                                            onChange={handleChange}
                                            placeholder="example.com"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Globe size={18} />
                                        </div>
                                    </div>
                                    <p className="mt-2 text-xs text-slate-500">{t('domainHint')}</p>
                                </div>
                            </div>
                        )}

                        <div className="mt-10 flex justify-between gap-4">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium"
                                >
                                    <ArrowLeft size={18} />
                                    {t('back')}
                                </button>
                            )}

                            {step < 2 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="ml-auto flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary-dark transition-all transform hover:scale-[1.02] active:scale-[0.98] font-semibold"
                                >
                                    {t('next')}
                                    <ArrowRight size={18} />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="ml-auto flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary-dark transition-all transform hover:scale-[1.02] active:scale-[0.98] font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                                    {t('completeSetup')}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
