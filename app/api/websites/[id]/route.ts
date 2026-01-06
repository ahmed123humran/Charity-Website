import { NextRequest, NextResponse } from 'next/server';
import { updateWebsiteSchema } from '@/app/utils/validiton';
import prisma from '@/app/utils/db';

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
            return NextResponse.json({ message: 'Website not found' }, { status: 404 });
        }

        return NextResponse.json(website, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
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
        const { id } = await params;
        const body = await request.json();
        const validation = updateWebsiteSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ message: validation.error.message }, { status: 400 });
        }

        const website = await prisma.website.findUnique({ where: { id } });
        if (!website) {
            return NextResponse.json({ message: 'Website not found' }, { status: 404 });
        }

        const updatedWebsite = await prisma.website.update({
            where: { id },
            data: validation.data
        });

        return NextResponse.json(updatedWebsite, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
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
        const { id } = await params;
        const website = await prisma.website.findUnique({ where: { id } });
        if (!website) {
            return NextResponse.json({ message: 'Website not found' }, { status: 404 });
        }

        await prisma.website.delete({ where: { id } });

        return NextResponse.json({ message: 'Website deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
