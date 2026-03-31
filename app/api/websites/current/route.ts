import { NextResponse } from 'next/server';
import prisma from '@/app/utils/db';

export async function GET() {
    try {
        const website = await prisma.website.findFirst({
            orderBy: { updatedAt: 'desc' },
            select: {
                id: true,
                name: true,
                themeColor: true,
                secondaryColor: true,
                fontFamily: true,
                logo: true,
            }
        });

        if (!website) {
            return NextResponse.json({ error: 'No website found' }, { status: 404 });
        }

        return NextResponse.json(website);
    } catch (error) {
        console.error('Error fetching current website:', error);
        return NextResponse.json({ error: 'Failed to fetch website' }, { status: 500 });
    }
}
