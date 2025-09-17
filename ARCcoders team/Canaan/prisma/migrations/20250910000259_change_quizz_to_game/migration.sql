/*
  Warnings:

  - You are about to drop the column `quiz_graph` on the `quiz` table. All the data in the column will be lost.
  - Added the required column `game` to the `quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."quiz" DROP COLUMN "quiz_graph",
ADD COLUMN     "game" JSONB NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
