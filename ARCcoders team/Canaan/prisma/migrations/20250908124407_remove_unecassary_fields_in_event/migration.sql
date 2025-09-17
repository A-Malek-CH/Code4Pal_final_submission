/*
  Warnings:

  - You are about to drop the column `coordinates` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `event` table. All the data in the column will be lost.
  - Made the column `description` on table `event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."event" DROP COLUMN "coordinates",
DROP COLUMN "location",
ALTER COLUMN "description" SET NOT NULL;
