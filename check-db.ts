import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    console.log('User count:', await prisma.user.count());
    console.log('Website count:', await prisma.website.count());
    console.log('Page count:', await prisma.page.count());
    console.log('Snippet count:', await prisma.snippet.count());
    console.log('Footer count:', await prisma.footer.count());
}
main().finally(() => prisma.$disconnect());
