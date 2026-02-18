import prisma from './app/utils/db';

async function check() {
    try {
        const website = await prisma.website.findFirst();
        console.log('Website fields:', Object.keys(website || {}));
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await prisma.$disconnect();
    }
}

check();
