import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    try {
        const users = await prisma.user.findMany();
        console.log('Users in DB:', users);
        console.log('Fields in first user:', users[0] ? Object.keys(users[0]) : 'No users');
    } catch (e) {
        console.error('Error fetching users:', e);
    }
}
main().finally(() => prisma.$disconnect());
