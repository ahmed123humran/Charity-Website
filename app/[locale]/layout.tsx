import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import prisma from "@/app/utils/db";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/navigation';
import ToastProvider from '@/app/components/ToastProvider';
import ReduxProvider from '@/app/components/ReduxProvider';
import FloatingSocialMenu from '@/app/components/FloatingSocialMenu';
import { getLocalizedName } from '@/app/utils/locale';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { Cairo, Tajawal, Almarai, Inter, Roboto, Open_Sans } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cairo = Cairo({ subsets: ["latin", "arabic"], variable: "--font-cairo" });
const tajawal = Tajawal({ weight: ["400", "500", "700"], subsets: ["latin", "arabic"], variable: "--font-tajawal" });
const almarai = Almarai({ weight: ["300", "400", "700", "800"], subsets: ["arabic"], variable: "--font-almarai" });
const roboto = Roboto({ weight: ["400", "500", "700"], subsets: ["latin"], variable: "--font-roboto" });
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans" });

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const website = await prisma.website.findFirst({
    orderBy: { updatedAt: 'desc' }
  });

  const siteName = getLocalizedName(website?.name, locale) || "Ragmi";
  const siteDescription = getLocalizedName(website?.description, locale) || "Modern charity platform for sustainable development.";
  const siteLogo = website?.logo || "/favicon.ico";

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: siteDescription,
    keywords: ["Charity", "Society", locale === 'ar' ? "جمعية" : "Association", siteName],
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    alternates: {
      canonical: '/',
      languages: {
        'en-US': '/en',
        'ar-SA': '/ar',
      },
    },
    openGraph: {
      title: siteName,
      description: siteDescription,
      url: './',
      siteName: siteName,
      images: [
        {
          url: siteLogo,
          width: 800,
          height: 600,
        },
      ],
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description: siteDescription,
      images: [siteLogo],
    },
    icons: {
      icon: website?.logo ? website.logo : "/favicon.ico",
      apple: website?.logo ? website.logo : "/favicon.ico",
    },
  };
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const website = await prisma.website.findFirst({
    orderBy: { updatedAt: 'desc' }
  });
  const themeColor = website?.themeColor || "#4f46e5";
  const secondaryColor = website?.secondaryColor || "#f59e0b";
  const fontFamilyValue = website?.fontFamily || "Inter";

  // Mapping font names to CSS variables
  const fontMap: Record<string, string> = {
    "Inter": inter.style.fontFamily,
    "Cairo": cairo.style.fontFamily,
    "Tajawal": tajawal.style.fontFamily,
    "Almarai": almarai.style.fontFamily,
    "Roboto": roboto.style.fontFamily,
    "Open Sans": openSans.style.fontFamily,
  };

  const selectedFont = fontMap[fontFamilyValue] || inter.style.fontFamily;

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body
        className={`${inter.variable} ${cairo.variable} ${tajawal.variable} ${almarai.variable} ${roboto.variable} ${openSans.variable} antialiased`}
        style={{
          '--primary-color': themeColor,
          '--primary-glow': `color-mix(in srgb, ${themeColor}, transparent 80%)`,
          '--primary-muted': `color-mix(in srgb, ${themeColor}, white 80%)`,
          '--primary-dark': `color-mix(in srgb, ${themeColor}, black 20%)`,
          '--primary-accent': `color-mix(in srgb, ${themeColor}, #a855f7 30%)`,
          '--primary-surface': `color-mix(in srgb, ${themeColor}, transparent 95%)`,
          '--secondary-color': secondaryColor,
          '--secondary-glow': `color-mix(in srgb, ${secondaryColor}, transparent 80%)`,
          '--secondary-muted': `color-mix(in srgb, ${secondaryColor}, white 80%)`,
          '--secondary-dark': `color-mix(in srgb, ${secondaryColor}, black 20%)`,
          '--secondary-accent': `color-mix(in srgb, ${secondaryColor}, #f59e0b 30%)`,
          '--secondary-surface': `color-mix(in srgb, ${secondaryColor}, transparent 95%)`,
          '--font-family': selectedFont,
        } as React.CSSProperties}
      >
        <ReduxProvider>
          <NextIntlClientProvider messages={messages}>
            <ToastProvider />
            <FloatingSocialMenu />
            {children}
          </NextIntlClientProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
