import { NextRequest, NextResponse } from 'next/server';
import { createUserSchema } from '@/app/utils/validiton';
import prisma from '@/app/utils/db';

/**
 * @method GET
 * @route ~/api/users
 * @desc Get all users
 * @access Public
 */
export async function GET(request: NextRequest) {
    try {
        const users = await prisma.user.findMany({
            include: {
                pages: true
            }
        });
        return NextResponse.json(users, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
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
        const body = await request.json();
        const validation = createUserSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ message: validation.error.message }, { status: 400 });
        }

        const exists = await prisma.user.findUnique({
            where: { email: validation.data.email }
        });

        if (exists) {
            return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
        }

        const newUser = await prisma.user.create({
            data: {
                ...validation.data,
                password: validation.data.password || 'admin123'
            }
        });

        return NextResponse.json(newUser, { status: 201 });
    }
    catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
