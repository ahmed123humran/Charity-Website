import { cookies } from 'next/headers';
import prisma from '@/app/utils/db';
import { verifySession } from '@/app/utils/session';

export async function getServerUser() {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin-session');

    if (!session?.value) return null;

    // Verify JWT token and extract user ID
    const payload = await verifySession(session.value);
    if (!payload) return null;

    const user = await prisma.user.findUnique({
        where: { id: payload.userId }
    });

    return user;
}

export async function checkRole(allowedRoles: string[]) {
    const user = await getServerUser();
    if (!user) return false;
    return allowedRoles.includes((user as any).role);
}
