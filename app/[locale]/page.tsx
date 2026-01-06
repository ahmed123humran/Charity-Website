import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { Heart, Users, Target, ArrowRight } from "lucide-react";
import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';

export default async function Home() {
  const t = await getTranslations('HomePage');

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-15 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: 'var(--primary-color)' }} />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse delay-700" style={{ backgroundColor: 'var(--primary-accent)' }} />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {t('heroTitle')} <br />
              <span className="bg-linear-to-r from-[var(--primary-color)] to-[var(--primary-accent)] bg-clip-text text-transparent">
                {t('heroTitleAccent')}
              </span>
            </h1>
            <p className="mt-8 text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {t('heroDesc')}
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 text-white rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-xl flex items-center justify-center gap-2 group"
                style={{ backgroundColor: 'var(--primary-color)', boxShadow: '0 20px 25px -5px var(--primary-glow)' }}
              >
                {t('joinMission')}
                <ArrowRight className="w-5 h-5 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#"
                className="w-full sm:w-auto px-8 py-4 bg-slate-50 text-slate-900 rounded-2xl font-bold text-lg hover:bg-slate-100 border border-slate-200 transition-all"
              >
                {t('exploreProjects')}
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-slate-50 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-extrabold" style={{ color: 'var(--primary-color)' }}>150+</div>
                <div className="mt-2 text-slate-500 font-medium">Active Projects</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-extrabold" style={{ color: 'var(--primary-color)' }}>12k+</div>
                <div className="mt-2 text-slate-500 font-medium">Families Supported</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-extrabold" style={{ color: 'var(--primary-color)' }}>$2.5M+</div>
                <div className="mt-2 text-slate-500 font-medium">Donations Raised</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-extrabold" style={{ color: 'var(--primary-color)' }}>45</div>
                <div className="mt-2 text-slate-500 font-medium">Charity Partners</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl lg:text-5xl font-bold text-slate-900">{t('whyPartner')}</h2>
              <p className="mt-6 text-lg text-slate-600">
                {t('bridgeGap')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="p-10 bg-white rounded-3xl border border-slate-100 shadow-xs hover:shadow-xl transition-all hover:-translate-y-2">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8" style={{ backgroundColor: 'var(--primary-glow)', color: 'var(--primary-color)' }}>
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{t('directImpact')}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {t('directImpactDesc')}
                </p>
              </div>

              <div className="p-10 bg-white rounded-3xl border border-slate-100 shadow-xs hover:shadow-xl transition-all hover:-translate-y-2">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8" style={{ backgroundColor: 'var(--primary-glow)', color: 'var(--primary-color)' }}>
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{t('communityDriven')}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {t('communityDrivenDesc')}
                </p>
              </div>

              <div className="p-10 bg-white rounded-3xl border border-slate-100 shadow-xs hover:shadow-xl transition-all hover:-translate-y-2">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8" style={{ backgroundColor: 'var(--primary-glow)', color: 'var(--primary-color)' }}>
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{t('strategicGrowth')}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {t('strategicGrowthDesc')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-[3rem] p-12 lg:p-24 text-center text-white relative overflow-hidden shadow-2xl" style={{ backgroundColor: 'var(--primary-dark)' }}>
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-4xl lg:text-6xl font-bold mb-8 leading-tight">{t('ctaTitle')}</h2>
                <p className="text-xl opacity-90 mb-12">
                  {t('ctaDesc')}
                </p>
                <Link
                  href="/login"
                  className="inline-block px-10 py-5 bg-white rounded-2xl font-bold text-xl hover:bg-slate-50 transition-all hover:scale-105"
                  style={{ color: 'var(--primary-color)' }}
                >
                  {t('ctaBtn')}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
