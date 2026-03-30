import { NextRequest, NextResponse } from 'next/server';
import { updateWebsiteSchema } from '@/app/utils/validiton';
import prisma from '@/app/utils/db';
import { getServerUser } from '@/app/utils/auth';
import { Role } from '@prisma/client';
import { logActivity } from '@/app/utils/logger';

interface Props {
    params: Promise<{ id: string }>;
}

/**
 * @method GET
 * @route ~/api/websites/[id]
 * @desc Get a single website by id
 * @access Public
 */
export async function GET(request: NextRequest, { params }: Props) {
    try {
        const { id } = await params;
        const website = await prisma.website.findUnique({
            where: { id },
            include: {
                pages: true,
                menus: true
            }
        });

        if (!website) {
            return NextResponse.json({ message: 'notFound' }, { status: 404 });
        }

        return NextResponse.json(website, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'internalServerError' }, { status: 500 });
    }
}

/**
 * @method PUT
 * @route ~/api/websites/[id]
 * @desc Update a website
 * @access Public
 */
export async function PUT(request: NextRequest, { params }: Props) {
    try {
        const user = await getServerUser();
        if (!user || (user.role !== Role.ADMIN && user.role !== Role.EDITOR)) {
            return NextResponse.json({ message: 'unauthorized' }, { status: 403 });
        }

        const { id } = await params;
        const body = await request.json();
        const validation = updateWebsiteSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(validation.error.issues, { status: 400 });
        }

        const website = await prisma.website.findUnique({ where: { id } });
        if (!website) {
            return NextResponse.json({ message: 'notFound' }, { status: 404 });
        }

        const websiteData = validation.data;

        const updatedWebsite = await prisma.website.update({
            where: { id },
            data: {
                ...websiteData as any
            }
        });

        await logActivity({
            action: 'UPDATE',
            entityType: 'WEBSITE',
            entityId: id,
            details: `Updated website: ${validation.data.name?.en || validation.data.name?.ar}`,
            oldData: website,
            newData: updatedWebsite,
            userId: user.id
        });

        return NextResponse.json(updatedWebsite, { status: 200 });
    } catch (error) {
        console.error('Error updating website:', error);
        return NextResponse.json({ message: 'internalServerError' }, { status: 500 });
    }
}

/**
 * @method DELETE
 * @route ~/api/websites/[id]
 * @desc Delete a website
 * @access Public
 */
export async function DELETE(request: NextRequest, { params }: Props) {
    try {
        const user = await getServerUser();
        if (!user || user.role !== Role.ADMIN) {
            return NextResponse.json({ message: 'unauthorized' }, { status: 403 });
        }

        const { id } = await params;
        const website = await prisma.website.findUnique({ where: { id } });
        if (!website) {
            return NextResponse.json({ message: 'notFound' }, { status: 404 });
        }

        await prisma.website.delete({ where: { id } });

        await logActivity({
            action: 'DELETE',
            entityType: 'WEBSITE',
            entityId: id,
            details: `Deleted website: ${(website.name as any)?.en || (website.name as any)?.ar}`,
            oldData: website,
            userId: user.id
        });

        return NextResponse.json({ message: 'deleted' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'internalServerError' }, { status: 500 });
    }
}
