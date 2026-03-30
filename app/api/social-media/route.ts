import { NextRequest, NextResponse } from 'next/server';
import { createSocialMediaSchema } from '@/app/utils/validiton';
import prisma from '@/app/utils/db';
import { checkRole } from '@/app/utils/auth';
import { logActivity } from '@/app/utils/logger';
import { getServerUser } from '@/app/utils/auth';

/**
 * @method GET
 * @route ~/api/social-media
 * @desc Get all social media links
 * @access Public
 */
export async function GET(request: NextRequest) {
    try {
        const socialMedias = await prisma.socialMedia.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(socialMedias, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ message: 'internalServerError' }, { status: 500 });
    }
}

/**
 * @method POST
 * @route ~/api/social-media
 * @desc Create a new social media link
 * @access Private (Admin/Editor)
 */
export async function POST(request: NextRequest) {
    try {
        const isAuthorized = await checkRole(['ADMIN', 'EDITOR']);
        if (!isAuthorized) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }
        const body = await request.json();
        const validation = createSocialMediaSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(validation.error.issues, { status: 400 });
        }

        const newSocialMedia = await prisma.socialMedia.create({
            data: {
                name: validation.data.name as any,
                url: validation.data.url,
                image: validation.data.image
            }
        });

        const user = await getServerUser();
        if (user) {
            await logActivity({
                action: 'CREATE',
                entityType: 'SOCIAL_MEDIA' as any,
                entityId: newSocialMedia.id,
                details: `Created social media: ${validation.data.name?.en || validation.data.name?.ar}`,
                newData: newSocialMedia,
                userId: user.id
            });
        }

        return NextResponse.json(newSocialMedia, { status: 201 });
    }
    catch (error) {
        console.error("Error creating social media:", error);
        return NextResponse.json({ message: 'internalServerError' }, { status: 500 });
    }
}
