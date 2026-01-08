import { NextRequest, NextResponse } from 'next/server';
import { createWebsiteSchema } from '@/app/utils/validiton';
import prisma from '@/app/utils/db';
import { checkRole } from '@/app/utils/auth';
import { logActivity } from '@/app/utils/logger';
import { getServerUser } from '@/app/utils/auth';

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
 * @access Private (Admin/Editor)
 */
export async function POST(request: NextRequest) {
    try {
        const isAuthorized = await checkRole(['ADMIN', 'EDITOR']);
        if (!isAuthorized) {
            return NextResponse.json({ message: 'Unauthorized: Insufficient permissions' }, { status: 403 });
        }
        const body = await request.json();
        const validation = createWebsiteSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ message: validation.error.message }, { status: 400 });
        }

        const newWebsite = await prisma.website.create({
            data: validation.data
        });

        const user = await getServerUser();
        if (user) {
            await logActivity({
                action: 'CREATE',
                entityType: 'WEBSITE',
                entityId: newWebsite.id,
                details: `Created website: ${validation.data.name?.en || validation.data.name?.ar}`,
                newData: newWebsite,
                userId: user.id
            });
        }

        return NextResponse.json(newWebsite, { status: 201 });
    }
    catch (error) {
        console.error("Error creating website:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}