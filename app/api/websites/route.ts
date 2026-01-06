import { NextRequest, NextResponse } from 'next/server';
import { createWebsiteSchema } from '@/app/utils/validiton';
import prisma from '@/app/utils/db';

/**
 * @method GET
 * @route ~/api/websites
 * @desc Get all websites
 * @access Public
 */
export async function GET(request: NextRequest) {
    try {
        const websites = await prisma.website.findMany({
            include: {
                pages: true,
                menus: true
            }
        });
        return NextResponse.json(websites, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

/**
 * @method POST
 * @route ~/api/websites
 * @desc Create a new website
 * @access Public
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = createWebsiteSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ message: validation.error.message }, { status: 400 });
        }

        const newWebsite = await prisma.website.create({
            data: validation.data
        });

        return NextResponse.json(newWebsite, { status: 201 });
    }
    catch (error) {
        console.error("Error creating website:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}