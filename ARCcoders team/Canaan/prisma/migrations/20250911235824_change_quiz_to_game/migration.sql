/*
  Warnings:

  - You are about to drop the `quiz` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."quiz" DROP CONSTRAINT "quiz_event_id_fkey";

-- DropTable
DROP TABLE "public"."quiz";

-- CreateTable
CREATE TABLE "public"."game" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "event_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "game" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."game" ADD CONSTRAINT "game_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
