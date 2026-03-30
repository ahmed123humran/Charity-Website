import { NextRequest, NextResponse } from 'next/server';
import { updateMenuSchema } from '@/app/utils/validiton';
import prisma from '@/app/utils/db';
import { getServerUser } from '@/app/utils/auth';
import { Role } from '@prisma/client';
import { logActivity } from '@/app/utils/logger';

interface Props {
    params: Promise<{ id: string }>;
}

/**
 * @method GET
 * @route ~/api/menus/[id]
 * @desc Get a single menu by id
 * @access Public
 */
export async function GET(request: NextRequest, { params }: Props) {
    try {
        const { id } = await params;
        const menu = await prisma.menu.findUnique({
            where: { id },
            include: {
                website: true,
                childMenus: true,
                parent: true
            }
        });

        if (!menu) {
            return NextResponse.json({ message: 'Menu not found' }, { status: 404 });
        }

        return NextResponse.json(menu, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'internalServerError' }, { status: 500 });
    }
}

/**
 * @method PUT
 * @route ~/api/menus/[id]
 * @desc Update a menu
 * @access Public
 */
export async function PUT(request: NextRequest, { params }: Props) {
    try {
        const user = await getServerUser();
        if (!user || (user.role !== Role.ADMIN && user.role !== Role.EDITOR)) {
            return NextResponse.json({ message: 'Unauthorized: Only Admin and Editor can update menus' }, { status: 403 });
        }

        const { id } = await params;
        const body = await request.json();
        const validation = updateMenuSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(validation.error.issues, { status: 400 });
        }

        const menu = await prisma.menu.findUnique({ where: { id } });
        if (!menu) {
            return NextResponse.json({ message: 'Menu not found' }, { status: 404 });
        }

        const updatedMenu = await prisma.menu.update({
            where: { id },
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
            action: 'UPDATE',
            entityType: 'MENU',
            entityId: id,
            details: `Updated menu: ${validation.data.name?.en || validation.data.name?.ar}`,
            oldData: menu,
            newData: updatedMenu,
            userId: user.id
        });

        return NextResponse.json(updatedMenu, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'internalServerError' }, { status: 500 });
    }
}

/**
 * @method DELETE
 * @route ~/api/menus/[id]
 * @desc Delete a menu
 * @access Public
 */
export async function DELETE(request: NextRequest, { params }: Props) {
    try {
        const user = await getServerUser();
        if (!user || user.role !== Role.ADMIN) {
            return NextResponse.json({ message: 'Unauthorized: Only Admin can delete menus' }, { status: 403 });
        }

        const { id } = await params;
        const menu = await prisma.menu.findUnique({ where: { id } });
        if (!menu) {
            return NextResponse.json({ message: 'Menu not found' }, { status: 404 });
        }

        await prisma.menu.delete({ where: { id } });

        await logActivity({
            action: 'DELETE',
            entityType: 'MENU',
            entityId: id,
            details: `Deleted menu: ${(menu.name as any)?.en || (menu.name as any)?.ar}`,
            oldData: menu,
            userId: user.id
        });

        return NextResponse.json({ message: 'deleted' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
