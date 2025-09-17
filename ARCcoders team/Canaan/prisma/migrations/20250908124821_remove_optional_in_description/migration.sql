/*
  Warnings:

  - Made the column `description` on table `actor` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."actor" ALTER COLUMN "description" SET NOT NULL;
