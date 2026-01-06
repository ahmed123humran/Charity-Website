import { NextRequest, NextResponse } from 'next/server';
import { createMenuSchema } from '@/app/utils/validiton';
import prisma from '@/app/utils/db';

/**
 * @method GET
 * @route ~/api/menus
 * @desc Get all menus
 * @access Public
 */
export async function GET(request: NextRequest) {
    try {
        const menus = await prisma.menu.findMany({
            include: {
                website: true,
                childMenus: true,
                parent: true
            }
        });
        return NextResponse.json(menus, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

/**
 * @method POST
 * @route ~/api/menus
 * @desc Create a new menu
 * @access Public
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = createMenuSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ message: validation.error.message }, { status: 400 });
        }

        const newMenu = await prisma.menu.create({
            data: {
                name: validation.data.name as any,
                url: validation.data.url,
                pageId: validation.data.pageId,
                sequence: validation.data.sequence,
                websiteId: validation.data.websiteId,
                parentId: validation.data.parentId
            }
        });

        return NextResponse.json(newMenu, { status: 201 });
    }
    catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
