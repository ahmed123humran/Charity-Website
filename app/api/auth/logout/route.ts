import { NextResponse } from 'next/server';
import { getServerUser } from '@/app/utils/auth';
import { logActivity } from '@/app/utils/logger';

export async function POST() {
    const user = await getServerUser();
    if (user) {
        await logActivity({
            action: 'DELETE',
            entityType: 'USER',
            entityId: user.id.toString(),
            details: `User logged out: ${user.name || user.email}`,
            userId: user.id
        });
    }

    const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });

    // Clear the session cookie
    response.cookies.set('admin-session', '', {
        httpOnly: true,
        expires: new Date(0), // Expire immediately
        path: '/',
    });

    return response;
}
