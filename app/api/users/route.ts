import { NextRequest, NextResponse } from 'next/server';
import { createUserSchema } from '@/app/utils/validiton';
import prisma from '@/app/utils/db';
import { getServerUser } from '@/app/utils/auth';
import { Role } from '@prisma/client';
import { logActivity } from '@/app/utils/logger';
import { hashPassword } from '@/app/utils/password';

/**
 * @method GET
 * @route ~/api/users
 * @desc Get all users
 * @access Public
 */
export async function GET(request: NextRequest) {
    try {
        const user = await getServerUser();
        if (!user || (user.role !== Role.ADMIN && user.role !== Role.EDITOR)) {
            return NextResponse.json({ message: 'unauthorized' }, { status: 403 });
        }
        const users = await prisma.user.findMany({
            include: {
                pages: true
            }
        });
        return NextResponse.json(users, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ message: 'internalServerError' }, { status: 500 });
    }
}

/**
 * @method POST
 * @route ~/api/users
 * @desc Create a new user
 * @access Public
 */
export async function POST(request: NextRequest) {
    try {
        const user = await getServerUser();
        if (!user || user.role !== Role.ADMIN) {
            return NextResponse.json({ message: 'adminOnly' }, { status: 403 });
        }
        const body = await request.json();
        const validation = createUserSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(validation.error.issues, { status: 400 });
        }

        const { email, phone } = validation.data;

        // Check if user already exists by email or phone
        if (email || phone) {
            const exists = await prisma.user.findFirst({
                where: {
                    OR: [
                        ...(email ? [{ email }] : []),
                        ...(phone ? [{ phone }] : [])
                    ]
                }
            });

            if (exists) {
                return NextResponse.json({ message: 'userExists' }, { status: 409 });
            }
        }

        const passwordToHash = validation.data.password;
        if (!passwordToHash) {
            return NextResponse.json({ message: 'passwordRequired' }, { status: 400 });
        }
        const hashedPassword = await hashPassword(passwordToHash);

        const newUser = await prisma.user.create({
            data: {
                ...validation.data,
                role: body.role || 'EDITOR',
                password: hashedPassword
            }
        });

        await logActivity({
            action: 'CREATE',
            entityType: 'USER',
            entityId: newUser.id.toString(),
            details: `Created user: ${newUser.name || newUser.email}`,
            newData: newUser,
            userId: user.id
        });

        return NextResponse.json(newUser, { status: 201 });
    }
    catch (error) {
        return NextResponse.json({ message: 'internalServerError' }, { status: 500 });
    }
}
