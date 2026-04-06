import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const pages = await prisma.page.findMany({ select: { url: true, isPublished: true } });
    console.log(JSON.stringify(pages, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
