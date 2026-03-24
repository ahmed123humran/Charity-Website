-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Website" ADD COLUMN     "fontFamily" TEXT NOT NULL DEFAULT 'Inter';
