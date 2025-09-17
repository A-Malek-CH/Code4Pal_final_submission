/*
  Warnings:

  - You are about to drop the `daily_reward` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `daily_reward_content_box` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_daily_reward` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."daily_reward_content_box" DROP CONSTRAINT "daily_reward_content_box_box_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."daily_reward_content_box" DROP CONSTRAINT "daily_reward_content_box_daily_reward_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_daily_reward" DROP CONSTRAINT "user_daily_reward_daily_reward_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_daily_reward" DROP CONSTRAINT "user_daily_reward_user_id_fkey";

-- DropTable
DROP TABLE "public"."daily_reward";

-- DropTable
DROP TABLE "public"."daily_reward_content_box";

-- DropTable
DROP TABLE "public"."user_daily_reward";
