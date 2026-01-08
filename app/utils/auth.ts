import { cookies } from 'next/headers';
import prisma from '@/app/utils/db';

export async function getServerUser() {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin-session');

    if (!session?.value) return null;

    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { email: session.value },
                { phone: session.value }
            ]
        }
    });

    return user;
}

export async function checkRole(allowedRoles: string[]) {
    const user = await getServerUser();
    if (!user) return false;
    return allowedRoles.includes((user as any).role);
}
