import { NextRequest, NextResponse } from 'next/server';
import { createMenuSchema } from '@/app/utils/validiton';
import prisma from '@/app/utils/db';
import { getServerUser } from '@/app/utils/auth';
import { Role } from '@prisma/client';
import { logActivity } from '@/app/utils/logger';

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
        return NextResponse.json({ message: 'internalServerError' }, { status: 500 });
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
        const user = await getServerUser();
        if (!user || (user.role !== Role.ADMIN && user.role !== Role.EDITOR)) {
            return NextResponse.json({ message: 'Unauthorized: Only Admin and Editor can create menus' }, { status: 403 });
        }

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

        await logActivity({
            action: 'CREATE',
            entityType: 'MENU',
            entityId: newMenu.id,
            details: `Created menu: ${validation.data.name?.en || validation.data.name?.ar}`,
            newData: newMenu,
            userId: user.id
        });

        return NextResponse.json(newMenu, { status: 201 });
    }
    catch (error) {
        return NextResponse.json({ message: 'internalServerError' }, { status: 500 });
    }
}
