import { notFound } from 'next/navigation';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import prisma from '@/app/utils/db';
import { Metadata } from 'next';

import { getLocalizedName } from '@/app/utils/locale';

interface Props {
    params: Promise<{ slug: string[]; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, locale } = await params;
    const url = slug.join('/');
    const page = await prisma.page.findUnique({
        where: { url },
    });

    if (!page) return {};

    return {
        title: getLocalizedName(page.title, locale),
    };
}

export default async function DynamicPage({ params }: Props) {
    const { slug } = await params;
    const url = slug.join('/');
    const isHomePage = slug.length === 0;

    const page = await prisma.page.findUnique({
        where: { url },
        include: { website: true }
    });

    if (!page || !page.isPublished) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Header />
                <main className="flex-1 pt-20">
                    <div className="py-20 text-center text-slate-500">
                        <p>Page not found.</p>
                    </div>
                </main>
                <div />
            </div>
        );
    }

    let contentToRender = null;
    if (page.content) {
        try {
            const contentStr = typeof page.content === 'string' ? page.content : JSON.stringify(page.content);
            const parsed = JSON.parse(contentStr);
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && (parsed.en || parsed.ar)) {
                const { locale } = await params;
                const localizedContent = parsed[locale] || parsed.en || [];
                contentToRender = (
                    <div className="flex flex-col">
                        {localizedContent.map((item: any) => (
                            <div key={item.id} dangerouslySetInnerHTML={{ __html: item.htmlContent }} />
                        ))}
                    </div>
                );
            } else if (Array.isArray(parsed)) {
                contentToRender = (
                    <div className="flex flex-col">
                        {parsed.map((item: any) => (
                            <div key={item.id} dangerouslySetInnerHTML={{ __html: item.htmlContent }} />
                        ))}
                    </div>
                );
            } else {
                contentToRender = <div dangerouslySetInnerHTML={{ __html: contentStr }} />;
            }
        } catch (e) {
            const contentStr = typeof page.content === 'string' ? page.content : String(page.content);
            contentToRender = <div dangerouslySetInnerHTML={{ __html: contentStr }} />;
        }
    }

    let footerToRender = null;
    if (!isHomePage) {
        const footer = await prisma.footer.findFirst({
            where: { websiteId: page.websiteId },
        });
        if (!footer) {
            return (
                <div className="min-h-screen bg-white flex flex-col">
                    <Header />
                    <main className="flex-1">
                        <div className="py-20 text-center text-slate-500">
                            <p>Page not found.</p>
                        </div>
                    </main>
                    <div />
                </div>
            );
        }
        try {
            const contentStr = typeof footer.content === 'string' ? footer.content : JSON.stringify(footer.content);
            const parsed = JSON.parse(contentStr);
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && (parsed.en || parsed.ar)) {
                const { locale } = await params;
                const localizedContent = parsed[locale] || parsed.en || [];
                footerToRender = (
                    <div className="flex flex-col">
                        {localizedContent.map((item: any) => (
                            <div key={item.id} dangerouslySetInnerHTML={{ __html: item.htmlContent }} />
                        ))}
                    </div>
                );
            } else if (Array.isArray(parsed)) {
                footerToRender = (
                    <div className="flex flex-col">
                        {parsed.map((item: any) => (
                            <div key={item.id} dangerouslySetInnerHTML={{ __html: item.htmlContent }} />
                        ))}
                    </div>
                );
            } else {
                footerToRender = <div dangerouslySetInnerHTML={{ __html: contentStr }} />;
            }
        } catch (e) {
            // Optionally handle plain HTML string for footer
        }
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />
            <main className="flex-1">
                {contentToRender || (
                    <div className="py-20 text-center text-slate-500">
                        <p>This page is empty.</p>
                    </div>
                )}
            </main>
            {footerToRender || <div />}
        </div>
    );
}
