/*
  Warnings:

  - You are about to drop the column `ogImage` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `seoDescription` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `seoKeywords` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `seoTitle` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `ogImage` on the `Website` table. All the data in the column will be lost.
  - You are about to drop the column `seoDescription` on the `Website` table. All the data in the column will be lost.
  - You are about to drop the column `seoKeywords` on the `Website` table. All the data in the column will be lost.
  - You are about to drop the column `seoTitle` on the `Website` table. All the data in the column will be lost.
  - You are about to drop the column `twitterHandle` on the `Website` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Page" DROP COLUMN "ogImage",
DROP COLUMN "seoDescription",
DROP COLUMN "seoKeywords",
DROP COLUMN "seoTitle";

-- AlterTable
ALTER TABLE "Snippet" ADD COLUMN     "nameAr" TEXT;

-- AlterTable
ALTER TABLE "Website" DROP COLUMN "ogImage",
DROP COLUMN "seoDescription",
DROP COLUMN "seoKeywords",
DROP COLUMN "seoTitle",
DROP COLUMN "twitterHandle";
