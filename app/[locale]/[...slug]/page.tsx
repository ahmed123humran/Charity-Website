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

    const page = await prisma.page.findUnique({
        where: { url },
        include: { website: true }
    });

    if (!page || !page.isPublished) {
        notFound();
    }

    let contentToRender = null;
    if (page.content) {
        try {
            // page.content is JsonValue, convert to string if needed
            const contentStr = typeof page.content === 'string' ? page.content : JSON.stringify(page.content);
            const parsed = JSON.parse(contentStr);

            // Check if it's the new localized format { en: [], ar: [] }
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
                // Legacy format: single array
                contentToRender = (
                    <div className="flex flex-col">
                        {parsed.map((item: any) => (
                            <div key={item.id} dangerouslySetInnerHTML={{ __html: item.htmlContent }} />
                        ))}
                    </div>
                );
            } else {
                // Fallback for unexpected JSON
                contentToRender = <div dangerouslySetInnerHTML={{ __html: contentStr }} />;
            }
        } catch (e) {
            // It's a plain HTML string (legacy or manual edit)
            const contentStr = typeof page.content === 'string' ? page.content : String(page.content);
            contentToRender = <div dangerouslySetInnerHTML={{ __html: contentStr }} />;
        }
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* 
                We might want to fetch menus here dynamically too, 
                but Header probably handles it or we pass it.
                For now, reusing the static Header component.
             */}
            <Header />

            <main className="flex-1 pt-20">
                {contentToRender || (
                    <div className="py-20 text-center text-slate-500">
                        <p>This page is empty.</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
