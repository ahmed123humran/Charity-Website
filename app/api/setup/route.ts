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
        const { name, phone, password, companyName, domain } = body;

        if (!name || !phone || !password || !companyName) {
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
                domain: domain || null,
                themeColor: '#714B67',
                language: 'ar_SA'
            }
        });

        // 4. Create or Update a default Homepage
        // Try to find some default snippets to populate the page if they exist
        const dbSnippets = await prisma.snippet.findMany({
            where: {
                name: {
                    in: ['Modern Hero', 'Stats Row', 'Features Grid']
                }
            }
        });

        const contentItems = dbSnippets.map(s => ({
            id: typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).substring(7),
            snippetId: s.id,
            htmlContent: s.htmlContent,
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
