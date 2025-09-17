/*
  Warnings:

  - Added the required column `icon` to the `reward_box` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."reward_box" ADD COLUMN     "icon" TEXT NOT NULL;
