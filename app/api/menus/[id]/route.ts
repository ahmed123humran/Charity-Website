import { NextRequest, NextResponse } from 'next/server';
import { updateMenuSchema } from '@/app/utils/validiton';
import prisma from '@/app/utils/db';

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
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
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
        const { id } = await params;
        const body = await request.json();
        const validation = updateMenuSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ message: validation.error.message }, { status: 400 });
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

        return NextResponse.json(updatedMenu, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
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
        const { id } = await params;
        const menu = await prisma.menu.findUnique({ where: { id } });
        if (!menu) {
            return NextResponse.json({ message: 'Menu not found' }, { status: 404 });
        }

        await prisma.menu.delete({ where: { id } });

        return NextResponse.json({ message: 'Menu deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
