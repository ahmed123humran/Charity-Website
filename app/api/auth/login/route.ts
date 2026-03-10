import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/utils/db';
import { logActivity } from '@/app/utils/logger';
import { verifyPassword } from '@/app/utils/password';
import { createSession } from '@/app/utils/session';

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

        // Secure password verification using bcrypt
        const isValid = user ? await verifyPassword(password, user.password) : false;
        if (user && isValid) {
            const response = NextResponse.json({
                message: 'loggedInSuccess',
                user: { id: user.id, email: user.email, name: user.name, role: user.role }
            }, { status: 200 });

            // Create signed JWT token instead of storing raw email/phone
            const token = await createSession(user.id, user.role);
            response.cookies.set('admin-session', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7 // 7 days (matches JWT expiration)
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

        return NextResponse.json({ message: 'invalidCredentials' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ message: 'internalServerError' }, { status: 500 });
    }
}
