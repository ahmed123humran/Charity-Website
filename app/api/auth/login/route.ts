import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/utils/db';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        // Basic password check (plain text for demo/v1 per previous pattern)
        if (user && user.password === password) {
            const response = NextResponse.json({
                message: 'Logged in successfully',
                user: { id: user.id, email: user.email, name: user.name }
            }, { status: 200 });

            response.cookies.set('admin-session', user.email, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 // 1 day
            });
            return response;
        }

        return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
