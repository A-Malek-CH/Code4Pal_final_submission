/*
  Warnings:

  - You are about to drop the column `base_points` on the `game_result` table. All the data in the column will be lost.
  - You are about to drop the column `final_points` on the `game_result` table. All the data in the column will be lost.
  - You are about to drop the column `first_attempt_bonus` on the `game_result` table. All the data in the column will be lost.
  - You are about to drop the column `is_win` on the `game_result` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `game_result` table. All the data in the column will be lost.
  - You are about to drop the column `speed_bonus` on the `game_result` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."game_result" DROP COLUMN "base_points",
DROP COLUMN "final_points",
DROP COLUMN "first_attempt_bonus",
DROP COLUMN "is_win",
DROP COLUMN "level",
DROP COLUMN "speed_bonus";
