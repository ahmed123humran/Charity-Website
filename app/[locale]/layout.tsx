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

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ragmi - Empowering Charities",
  description: "Modern charity platform for sustainable development.",
};

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

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body
        className="antialiased"
        style={{
          '--primary-color': themeColor,
          '--primary-glow': `color-mix(in srgb, ${themeColor}, transparent 80%)`,
          '--primary-muted': `color-mix(in srgb, ${themeColor}, white 80%)`,
          '--primary-dark': `color-mix(in srgb, ${themeColor}, black 20%)`,
          '--primary-accent': `color-mix(in srgb, ${themeColor}, #a855f7 30%)`,
          '--primary-surface': `color-mix(in srgb, ${themeColor}, transparent 95%)`,
        } as React.CSSProperties}
      >
        <ReduxProvider>
          <NextIntlClientProvider messages={messages}>
            <ToastProvider />
            {children}
          </NextIntlClientProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
