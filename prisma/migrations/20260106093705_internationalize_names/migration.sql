/*
  Warnings:

  - Changed the type of `name` on the `Menu` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `title` on the `Page` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `title` on the `Footer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `name` on the `Website` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Menu" DROP COLUMN "name",
ADD COLUMN     "name" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Page" DROP COLUMN "title",
ADD COLUMN     "title" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Footer" DROP COLUMN "title",
ADD COLUMN     "title" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Website" DROP COLUMN "name",
ADD COLUMN     "name" JSONB NOT NULL;
