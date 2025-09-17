/*
  Warnings:

  - You are about to drop the `challenge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_challenge_progress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."challenge" DROP CONSTRAINT "challenge_reward_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_challenge_progress" DROP CONSTRAINT "user_challenge_progress_challenge_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_challenge_progress" DROP CONSTRAINT "user_challenge_progress_user_id_fkey";

-- DropTable
DROP TABLE "public"."challenge";

-- DropTable
DROP TABLE "public"."user_challenge_progress";
