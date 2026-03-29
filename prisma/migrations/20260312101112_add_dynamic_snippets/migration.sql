-- CreateEnum
CREATE TYPE "SnippetType" AS ENUM ('STATIC', 'DYNAMIC_SWIPER');

-- AlterTable
ALTER TABLE "Snippet" ADD COLUMN     "apiEndpoint" TEXT,
ADD COLUMN     "fieldMapping" JSONB,
ADD COLUMN     "swiperConfig" JSONB,
ADD COLUMN     "type" "SnippetType" NOT NULL DEFAULT 'STATIC';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP DEFAULT;
