import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/utils/db';

export async function POST(request: NextRequest) {
    try {
        // 1. Security check: Only allow setup if no users exist
        const userCount = await prisma.user.count();
        if (userCount > 0) {
            return NextResponse.json({ error: 'Setup already completed' }, { status: 403 });
        }

        const body = await request.json();
        const { name, phone, password, companyName, companyDescription, domain } = body;

        if (!name || !phone || !password || !companyName || !companyDescription) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 2. Create the Admin User
        const user = await prisma.user.create({
            data: {
                name,
                phone,
                password, // Note: In production you should hash this
                role: 'ADMIN'
            }
        });

        // 3. Create the Website
        const website = await prisma.website.create({
            data: {
                name: {
                    en: companyName,
                    ar: companyName
                },
                description: {
                    en: companyDescription,
                    ar: companyDescription
                },
                domain: domain || null,
                themeColor: '#714B67',
                language: 'ar_SA'
            }
        });

        // 4. Create or Update a default Homepage
        const dbSnippets = await prisma.snippet.findMany({
            where: {
                name: {
                    in: [
                        'Modern Hero', 
                        'Stats Row', 
                        'Features Grid', 
                        'Hero Section', 
                        'Hero - Figma Style', 
                        'Title',
                        'Hero With Button',
                        'Image with next Text',
                        'Features Cards'
                    ]
                }
            }
        });

        const replacePlaceholders = (html: string) => {
            let processedHtml = html;
            
            // 1. Replace Company Name (Headlines)
            const namePatterns = [
                /امنح الأمل، أنقذ الأرواح/g,
                /متحدون من أجل الخير، أقوياء من أجل الأعمال الخيرية/g,
                /معًا، نستطيع تغيير حياة الناس نحو الأفضل/g,
                /تحويل النوايا الحسنة إلى أفعال حسنة/g,
                /Transform Your <span[^>]*>Digital Presence<\/span>/g,
                /Help us <br>\s*<span[^>]*>save lives<\/span> today\./g
            ];

            namePatterns.forEach(pattern => {
                if (pattern.source.includes('<span')) {
                    // Special handling for spanned text to preserve styles if possible, but simplest is to replace with company name inside a styled span
                    processedHtml = processedHtml.replace(pattern, (match) => {
                        const spanMatch = match.match(/<span[^>]*>(.*?)<\/span>/);
                        if (spanMatch) {
                            return match.replace(spanMatch[1], companyName);
                        }
                        return companyName;
                    });
                } else {
                    processedHtml = processedHtml.replace(pattern, companyName);
                }
            });

            // 2. Replace Descriptions (Paragraphs)
            const descPatterns = [
                /هناك حقيقة مثبتة منذ زمن طويل وهي أن المحتوى المقروء لصفحة ما سيلهي القارئ عن التركيز على الشكل الخارجي للنص أو شكل توضع الفقرات في الصفحة التي يقرأها\.[^<]*/g,
                /هناك حقيقة مثبتة منذ زمن طويل وهي أن المحتوى المقروء لصفحة ما[^<]*/g,
                /Create stunning websites with our intuitive builder\. Powerful, flexible, and designed for modern needs\./g,
                /Your contribution provides immediate aid to those in crisis\. Join our community of changemakers and make a tangible impact\./g,
                /Create stunning websites with our intuitive builder[^<]*/g
            ];

            descPatterns.forEach(pattern => {
                processedHtml = processedHtml.replace(pattern, companyDescription);
            });

            return processedHtml;
        };

        const contentItems = dbSnippets.map(s => ({
            id: typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).substring(7),
            snippetId: s.id,
            htmlContent: replacePlaceholders(s.htmlContent),
            name: s.name
        }));

        await prisma.page.upsert({
            where: { url: '/' },
            update: {
                content: {
                    en: contentItems,
                    ar: contentItems
                }
            },
            create: {
                title: {
                    en: 'Home',
                    ar: 'الرئيسية'
                },
                url: '/',
                isPublished: true,
                websiteId: website.id,
                userId: user.id,
                content: {
                    en: contentItems,
                    ar: contentItems
                }
            }
        });

        // 5. Success response with session cookie
        const response = NextResponse.json({
            message: 'Setup complete',
            redirect: '/admin'
        }, { status: 200 });

        // Set session cookie using phone as identifier if no email
        response.cookies.set('admin-session', phone, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        return response;
    } catch (error: any) {
        console.error('Setup Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
