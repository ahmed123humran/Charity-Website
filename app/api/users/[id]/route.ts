import { NextRequest, NextResponse } from 'next/server';
import { updateUserSchema } from '@/app/utils/validiton';
import prisma from '@/app/utils/db';
import { getServerUser } from '@/app/utils/auth';
import { Role } from '@prisma/client';
import { logActivity } from '@/app/utils/logger';

interface Props {
    params: Promise<{ id: string }>;
}

/**
 * @method GET
 * @route ~/api/users/[id]
 * @desc Get a single user by id
 * @access Public
 */
export async function GET(request: NextRequest, { params }: Props) {
    try {
        const currentUser = await getServerUser();
        if (!currentUser || (currentUser.role !== Role.ADMIN && currentUser.role !== Role.EDITOR)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }
        const { id } = await params;
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            include: {
                pages: true
            }
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

/**
 * @method PUT
 * @route ~/api/users/[id]
 * @desc Update a user
 * @access Public
 */
export async function PUT(request: NextRequest, { params }: Props) {
    try {
        const currentUser = await getServerUser();
        if (!currentUser || currentUser.role !== Role.ADMIN) {
            return NextResponse.json({ message: 'Unauthorized: Only Admin can update users' }, { status: 403 });
        }
        const { id } = await params;
        const body = await request.json();
        const validation = updateUserSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ message: validation.error.message }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: validation.data
        });

        await logActivity({
            action: 'UPDATE',
            entityType: 'USER',
            entityId: id,
            details: `Updated user: ${updatedUser.name || updatedUser.email}`,
            oldData: user,
            newData: updatedUser,
            userId: currentUser.id
        });

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error('Update User Error:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: (error as any).message }, { status: 500 });
    }
}

/**
 * @method DELETE
 * @route ~/api/users/[id]
 * @desc Delete a user
 * @access Public
 */
export async function DELETE(request: NextRequest, { params }: Props) {
    try {
        const currentUser = await getServerUser();
        if (!currentUser || currentUser.role !== Role.ADMIN) {
            return NextResponse.json({ message: 'Unauthorized: Only Admin can delete users' }, { status: 403 });
        }
        const { id } = await params;
        const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        await prisma.user.delete({ where: { id: parseInt(id) } });

        await logActivity({
            action: 'DELETE',
            entityType: 'USER',
            entityId: id,
            details: `Deleted user: ${user.name || user.email}`,
            oldData: user,
            userId: currentUser.id
        });

        return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}