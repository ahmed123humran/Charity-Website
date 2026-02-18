'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'react-hot-toast';
import { User, Globe, Shield, CheckCircle, ArrowRight, ArrowLeft, Loader2, Sparkles, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GuidedTour, { TourStep } from '@/app/components/GuidedTour';

export default function SetupPage() {
    const t = useTranslations('Setup');
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        password: '',
        confirmPassword: '',
        companyName: '',
        companyDescription: '',
        domain: '',
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    const tourSteps: TourStep[] = [
        {
            target: '#step-header',
            title: 'مرحباً بك في منصة رجمي',
            content: 'سنقوم معاً بإعداد حسابك وموقعك الجديد في دقائق معدودة.',
        },
        {
            target: '#admin-form',
            title: 'بيانات المدير',
            content: 'ابدأ بإدخال بياناتك الشخصية لتتمكن من إدارة النظام لاحقاً.',
        },
        {
            target: '#next-btn',
            title: 'الخطوة التالية',
            content: 'بعد إكمال البيانات، انقر هنا للانتقال لإعدادات الموقع.',
        }
    ];

    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-primary/20">
            <GuidedTour steps={tourSteps} tourKey="setup_tour" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100 flex flex-col md:flex-row min-h-[600px]"
            >
                {/* Sidebar Decor */}
                <div className="md:w-1/3 bg-primary p-8 text-white relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
                            <Sparkles className="text-white" size={24} />
                        </div>
                        <h1 id="step-header" className="text-3xl font-bold mb-4 leading-tight">{t('welcome')}</h1>
                        <p className="text-white/70 text-sm leading-relaxed">{t('subtitle')}</p>
                    </div>

                    <div className="relative z-10 space-y-6 mt-12">
                        <div className={`flex items-center gap-4 transition-all duration-500 ${step === 1 ? 'opacity-100 translate-x-0' : 'opacity-40 -translate-x-2'}`}>
                            <div className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center font-bold text-sm">1</div>
                            <span className="font-medium text-sm">{t('adminDetails')}</span>
                        </div>
                        <div className={`flex items-center gap-4 transition-all duration-500 ${step === 2 ? 'opacity-100 translate-x-0' : 'opacity-40 -translate-x-2'}`}>
                            <div className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center font-bold text-sm">2</div>
                            <span className="font-medium text-sm">{t('websiteDetails')}</span>
                        </div>
                    </div>

                    {/* Abstract Decorations */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-primary-accent/20 rounded-full blur-2xl"></div>
                </div>

                {/* Main Content */}
                <div className="md:w-2/3 p-10 flex flex-col justify-between">
                    <form onSubmit={handleSubmit} id="admin-form" className="flex-1">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                            <Shield size={20} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-800">بيانات المدير</h2>
                                            <p className="text-xs text-slate-500">من سيقوم بإدارة النظام</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="relative group">
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">الاسم الكامل</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="أحمد محمد"
                                                className="input-premium"
                                                required
                                            />
                                            <div className="absolute right-3 top-9 text-slate-300 group-focus-within:text-primary transition-colors">
                                                <User size={18} />
                                            </div>
                                        </div>

                                        <div className="relative group">
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">رقم الجوال</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="05xxxxxxx"
                                                className="input-premium"
                                                required
                                            />
                                            <div className="absolute right-3 top-[3.25rem] group-focus-within:block hidden bg-slate-800 text-white text-[10px] px-2 py-1 rounded-md -translate-y-full mb-1">
                                                يجب أن يبدأ بـ 05
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="relative group">
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">كلمة المرور</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    placeholder="••••••••"
                                                    className="input-premium"
                                                    required
                                                />
                                            </div>
                                            <div className="relative group">
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">تأكيد كلمة المرور</label>
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    placeholder="••••••••"
                                                    className="input-premium"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                            <Globe size={20} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-800">بيانات الموقع</h2>
                                            <p className="text-xs text-slate-500">هوية موقعك الإلكتروني</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="relative group">
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">اسم الجمعية / الجهة</label>
                                            <input
                                                type="text"
                                                name="companyName"
                                                value={formData.companyName}
                                                onChange={handleChange}
                                                placeholder="جمعية البر"
                                                className="input-premium"
                                                required
                                            />
                                            <span title="الاسم الذي سيظهر في أعلى الموقع">
                                                <HelpCircle size={14} className="absolute left-3 top-10 text-slate-300 cursor-help group-hover:text-primary transition-colors" />
                                            </span>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">وصف موجز</label>
                                            <textarea
                                                name="companyDescription"
                                                value={formData.companyDescription}
                                                onChange={handleChange}
                                                placeholder="تحدث قليلاً عن أهداف الجمعية..."
                                                className="input-premium min-h-[100px] resize-none"
                                                required
                                            />
                                        </div>

                                        <div id="domain-input">
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">النطاق المطلوب (Domain)</label>
                                            <div className="relative group">
                                                <input
                                                    type="text"
                                                    name="domain"
                                                    value={formData.domain}
                                                    onChange={handleChange}
                                                    placeholder="my-charity"
                                                    className="input-premium"
                                                />
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400 font-medium">
                                                    <span className="text-xs">.cerp.sa</span>
                                                </div>
                                            </div>
                                            <p className="mt-2 text-[10px] text-slate-400 italic">سيتم استخدام هذا الرابط للوصول لموقعك</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="mt-12 flex items-center justify-between gap-4">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold transition-all px-4 py-2"
                                >
                                    <ArrowRight size={18} className="rotate-180" />
                                    <span>{t('back')}</span>
                                </button>
                            )}

                            {step < 2 ? (
                                <button
                                    type="button"
                                    id="next-btn"
                                    onClick={nextStep}
                                    className="btn-premium ml-auto group min-w-[140px]"
                                >
                                    <span>{t('next')}</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-premium shadow-xl shadow-primary/30 ml-auto min-w-[180px]"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                                    <span>{t('completeSetup')}</span>
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}

