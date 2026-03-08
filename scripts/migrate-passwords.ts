/**
 * One-time migration script to hash existing plain-text passwords in the database.
 * Run with: npx tsx scripts/migrate-passwords.ts
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;
const prisma = new PrismaClient();

async function main() {
    console.log('🔐 Starting password migration...\n');

    const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, phone: true, password: true }
    });

    if (users.length === 0) {
        console.log('✅ No users found. Nothing to migrate.');
        return;
    }

    console.log(`Found ${users.length} user(s) to process.\n`);

    let migrated = 0;
    let skipped = 0;

    for (const user of users) {
        const identifier = user.name || user.email || user.phone || `ID:${user.id}`;

        // Check if password is already hashed (bcrypt hashes start with $2a$ or $2b$)
        if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
            console.log(`⏭️  [${identifier}] — Already hashed, skipping.`);
            skipped++;
            continue;
        }

        const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });

        console.log(`✅ [${identifier}] — Password hashed successfully.`);
        migrated++;
    }

    console.log(`\n🎉 Migration complete! Migrated: ${migrated}, Skipped: ${skipped}`);
}

main()
    .catch((e) => {
        console.error('❌ Migration failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
