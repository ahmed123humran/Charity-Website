import { NextRequest, NextResponse } from 'next/server';
import { updateSocialMediaSchema } from '@/app/utils/validiton';
import prisma from '@/app/utils/db';
import { getServerUser } from '@/app/utils/auth';
import { Role } from '@prisma/client';
import { logActivity } from '@/app/utils/logger';

interface Props {
    params: Promise<{ id: string }>;
}

/**
 * @method PUT
 * @route ~/api/social-media/[id]
 * @desc Update a social media link
 * @access Private (Admin/Editor)
 */
export async function PUT(request: NextRequest, { params }: Props) {
    try {
        const user = await getServerUser();
        if (!user || (user.role !== Role.ADMIN && user.role !== Role.EDITOR)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const { id } = await params;
        const body = await request.json();
        const validation = updateSocialMediaSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ message: validation.error.message }, { status: 400 });
        }

        const socialMedia = await prisma.socialMedia.findUnique({ where: { id } });
        if (!socialMedia) {
            return NextResponse.json({ message: 'Social media not found' }, { status: 404 });
        }

        const updatedSocialMedia = await prisma.socialMedia.update({
            where: { id },
            data: {
                name: validation.data.name as any,
                url: validation.data.url,
                image: validation.data.image
            }
        });

        await logActivity({
            action: 'UPDATE',
            entityType: 'SOCIAL_MEDIA' as any,
            entityId: id,
            details: `Updated social media: ${validation.data.name?.en || validation.data.name?.ar}`,
            oldData: socialMedia,
            newData: updatedSocialMedia,
            userId: user.id
        });

        return NextResponse.json(updatedSocialMedia, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

/**
 * @method DELETE
 * @route ~/api/social-media/[id]
 * @desc Delete a social media link
 * @access Private (Admin)
 */
export async function DELETE(request: NextRequest, { params }: Props) {
    try {
        const user = await getServerUser();
        if (!user || user.role !== Role.ADMIN) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const { id } = await params;
        const socialMedia = await prisma.socialMedia.findUnique({ where: { id } });
        if (!socialMedia) {
            return NextResponse.json({ message: 'Social media not found' }, { status: 404 });
        }

        await prisma.socialMedia.delete({ where: { id } });

        await logActivity({
            action: 'DELETE',
            entityType: 'SOCIAL_MEDIA' as any,
            entityId: id,
            details: `Deleted social media: ${(socialMedia.name as any)?.en || (socialMedia.name as any)?.ar}`,
            oldData: socialMedia,
            userId: user.id
        });

        return NextResponse.json({ message: 'Social media deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
