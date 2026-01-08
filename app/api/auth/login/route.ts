import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/utils/db';
import { logActivity } from '@/app/utils/logger';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, phone, password } = body;
        const identifier = email || phone;

        // Find user by email or phone
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { phone: identifier }
                ]
            }
        });

        // Basic password check (plain text for demo/v1 per previous pattern)
        if (user && user.password === password) {
            const response = NextResponse.json({
                message: 'Logged in successfully',
                user: { id: user.id, email: user.email, name: user.name, role: user.role }
            }, { status: 200 });

            response.cookies.set('admin-session', (user.email || user.phone) as string, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 // 1 day
            });

            await logActivity({
                action: 'CREATE', // Using CREATE for Session creation or just a generic action
                entityType: 'USER',
                entityId: user.id.toString(),
                details: `User logged in: ${user.name || user.email}`,
                userId: user.id
            });

            return response;
        }

        return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
