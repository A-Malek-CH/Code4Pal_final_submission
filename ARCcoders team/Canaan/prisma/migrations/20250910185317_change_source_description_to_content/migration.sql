/*
  Warnings:

  - You are about to drop the column `description` on the `source` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."source" DROP COLUMN "description",
ADD COLUMN     "content" TEXT;
