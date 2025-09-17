/*
  Warnings:

  - Added the required column `first_attempt` to the `game_result` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."game_result" ADD COLUMN     "first_attempt" BOOLEAN NOT NULL;
