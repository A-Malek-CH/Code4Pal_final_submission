
CREATE EXTENSION IF NOT EXISTS "vector";
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ASSISTANT');

-- CreateTable
CREATE TABLE "public"."event" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "location" TEXT,
    "coordinates" TEXT,
    "tags" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."event_relationship" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "source_event_id" UUID NOT NULL,
    "target_event_id" UUID NOT NULL,
    "relationship_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_relationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."media_asset" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "event_id" UUID NOT NULL,
    "asset_type" TEXT NOT NULL,
    "storage_url" TEXT NOT NULL,
    "title" TEXT,
    "source_text" TEXT,
    "embedding" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quiz" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "event_id" UUID NOT NULL,
    "quiz_graph" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."actor" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "actor_type" TEXT NOT NULL,
    "description" TEXT,
    "birth_date" TIMESTAMP(3),
    "death_date" TIMESTAMP(3),
    "founded_date" TIMESTAMP(3),
    "dissolved_date" TIMESTAMP(3),
    "nationality" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "actor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."actor_link" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "actor_id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "role" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "actor_link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."location" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "coordinates" TEXT,
    "country" TEXT,
    "region" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."location_link" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "location_id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "role" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "location_link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."source" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publish_date" TIMESTAMPTZ(6),
    "is_embedded" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."source_link" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "source_id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "relevance" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "source_link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."document" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "source_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "embedding" vector(768),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user" (
    "display_name" TEXT NOT NULL,
    "photo_url" TEXT,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "id" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."conversation" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."message" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "content" JSONB NOT NULL,
    "role" "public"."Role" NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "conversation_id" TEXT NOT NULL,
    "attachments" JSONB,
    "reasoning" JSONB,
    "sources" JSONB,
    "suggestions" JSONB,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_game_stats" (
    "game_type" TEXT NOT NULL,
    "total_games_played" INTEGER NOT NULL DEFAULT 0,
    "total_wins" INTEGER NOT NULL DEFAULT 0,
    "total_losses" INTEGER NOT NULL DEFAULT 0,
    "best_score" INTEGER NOT NULL DEFAULT 0,
    "total_score" INTEGER NOT NULL DEFAULT 0,
    "average_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fastest_time" INTEGER NOT NULL,
    "current_win_streak" INTEGER NOT NULL DEFAULT 0,
    "longest_win_streak" INTEGER NOT NULL DEFAULT 0,
    "current_daily_streak" INTEGER NOT NULL DEFAULT 0,
    "longest_daily_streak" INTEGER NOT NULL DEFAULT 0,
    "last_played_date" DATE,
    "hearts" INTEGER NOT NULL DEFAULT 3,
    "heart_regeneration_time" TIMESTAMP(3),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "total_perfect_games" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_game_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."achievement" (
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "xp_bonus" INTEGER NOT NULL DEFAULT 0,
    "criteria" JSONB NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reward" (
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reward_box" (
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reward_box_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."achievement_reward_box" (
    "probability" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "achievement_id" UUID NOT NULL,
    "box_id" UUID NOT NULL,

    CONSTRAINT "achievement_reward_box_pkey" PRIMARY KEY ("achievement_id","box_id")
);

-- CreateTable
CREATE TABLE "public"."reward_box_reward" (
    "probability" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "box_id" UUID NOT NULL,
    "reward_id" UUID NOT NULL,

    CONSTRAINT "reward_box_reward_pkey" PRIMARY KEY ("box_id","reward_id")
);

-- CreateTable
CREATE TABLE "public"."user_achievement" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "achievement_id" UUID NOT NULL,

    CONSTRAINT "user_achievement_pkey" PRIMARY KEY ("user_id","achievement_id")
);

-- CreateTable
CREATE TABLE "public"."game_result" (
    "game_type" TEXT NOT NULL DEFAULT 'Bingo',
    "level" INTEGER NOT NULL,
    "base_points" INTEGER NOT NULL,
    "final_points" INTEGER NOT NULL,
    "time_spent" INTEGER NOT NULL,
    "correct_answers" INTEGER NOT NULL,
    "total_questions" INTEGER NOT NULL,
    "is_win" BOOLEAN NOT NULL,
    "speed_bonus" INTEGER NOT NULL DEFAULT 0,
    "first_attempt_bonus" INTEGER NOT NULL DEFAULT 0,
    "played_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "extra" JSONB,

    CONSTRAINT "game_result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."challenge" (
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "target" INTEGER NOT NULL,
    "variant" TEXT NOT NULL DEFAULT 'static',
    "date" DATE,
    "start_date" DATE,
    "end_date" DATE,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "reward_id" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_challenge_progress" (
    "progress" INTEGER NOT NULL DEFAULT 0,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMP(3),
    "user_id" TEXT NOT NULL,
    "challenge_id" UUID NOT NULL,

    CONSTRAINT "user_challenge_progress_pkey" PRIMARY KEY ("user_id","challenge_id")
);

-- CreateTable
CREATE TABLE "public"."daily_reward" (
    "day" INTEGER NOT NULL,
    "other_rewards" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."daily_reward_content_box" (
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "daily_reward_id" UUID NOT NULL,
    "box_id" UUID NOT NULL,

    CONSTRAINT "daily_reward_content_box_pkey" PRIMARY KEY ("daily_reward_id","box_id")
);

-- CreateTable
CREATE TABLE "public"."user_daily_reward" (
    "claimed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" DATE NOT NULL,
    "user_id" TEXT NOT NULL,
    "daily_reward_id" UUID NOT NULL,

    CONSTRAINT "user_daily_reward_pkey" PRIMARY KEY ("user_id","daily_reward_id","date")
);

-- CreateTable
CREATE TABLE "public"."user_reward_box" (
    "is_opened" BOOLEAN NOT NULL DEFAULT false,
    "earned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "opened_at" TIMESTAMP(3),
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "box_id" UUID NOT NULL,

    CONSTRAINT "user_reward_box_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_relationship_source_event_id_target_event_id_relation_key" ON "public"."event_relationship"("source_event_id", "target_event_id", "relationship_type");

-- CreateIndex
CREATE UNIQUE INDEX "actor_link_actor_id_event_id_key" ON "public"."actor_link"("actor_id", "event_id");

-- CreateIndex
CREATE UNIQUE INDEX "location_link_location_id_event_id_key" ON "public"."location_link"("location_id", "event_id");

-- CreateIndex
CREATE UNIQUE INDEX "source_link_source_id_event_id_key" ON "public"."source_link"("source_id", "event_id");

-- CreateIndex
CREATE INDEX "user_game_stats_user_id_idx" ON "public"."user_game_stats"("user_id");

-- CreateIndex
CREATE INDEX "user_game_stats_game_type_idx" ON "public"."user_game_stats"("game_type");

-- CreateIndex
CREATE UNIQUE INDEX "user_game_stats_user_id_game_type_key" ON "public"."user_game_stats"("user_id", "game_type");

-- CreateIndex
CREATE UNIQUE INDEX "achievement_name_key" ON "public"."achievement"("name");

-- CreateIndex
CREATE INDEX "achievement_reward_box_achievement_id_idx" ON "public"."achievement_reward_box"("achievement_id");

-- CreateIndex
CREATE INDEX "achievement_reward_box_box_id_idx" ON "public"."achievement_reward_box"("box_id");

-- CreateIndex
CREATE INDEX "reward_box_reward_box_id_idx" ON "public"."reward_box_reward"("box_id");

-- CreateIndex
CREATE INDEX "reward_box_reward_reward_id_idx" ON "public"."reward_box_reward"("reward_id");

-- CreateIndex
CREATE INDEX "game_result_user_id_idx" ON "public"."game_result"("user_id");

-- CreateIndex
CREATE INDEX "game_result_game_type_idx" ON "public"."game_result"("game_type");

-- CreateIndex
CREATE INDEX "game_result_played_at_idx" ON "public"."game_result"("played_at");

-- CreateIndex
CREATE INDEX "challenge_date_idx" ON "public"."challenge"("date");

-- CreateIndex
CREATE INDEX "challenge_variant_idx" ON "public"."challenge"("variant");

-- CreateIndex
CREATE INDEX "challenge_start_date_end_date_idx" ON "public"."challenge"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "challenge_is_active_idx" ON "public"."challenge"("is_active");

-- CreateIndex
CREATE INDEX "user_challenge_progress_challenge_id_idx" ON "public"."user_challenge_progress"("challenge_id");

-- CreateIndex
CREATE UNIQUE INDEX "daily_reward_day_key" ON "public"."daily_reward"("day");

-- CreateIndex
CREATE INDEX "user_reward_box_user_id_idx" ON "public"."user_reward_box"("user_id");

-- CreateIndex
CREATE INDEX "user_reward_box_box_id_idx" ON "public"."user_reward_box"("box_id");

-- CreateIndex
CREATE INDEX "user_reward_box_is_opened_idx" ON "public"."user_reward_box"("is_opened");

-- AddForeignKey
ALTER TABLE "public"."event_relationship" ADD CONSTRAINT "event_relationship_source_event_id_fkey" FOREIGN KEY ("source_event_id") REFERENCES "public"."event"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."event_relationship" ADD CONSTRAINT "event_relationship_target_event_id_fkey" FOREIGN KEY ("target_event_id") REFERENCES "public"."event"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."media_asset" ADD CONSTRAINT "media_asset_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."quiz" ADD CONSTRAINT "quiz_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."actor_link" ADD CONSTRAINT "actor_link_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "public"."actor"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."actor_link" ADD CONSTRAINT "actor_link_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."location_link" ADD CONSTRAINT "location_link_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."location_link" ADD CONSTRAINT "location_link_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "public"."location"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."source_link" ADD CONSTRAINT "source_link_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."source_link" ADD CONSTRAINT "source_link_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "public"."source"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."document" ADD CONSTRAINT "document_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "public"."source"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."conversation" ADD CONSTRAINT "conversation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."message" ADD CONSTRAINT "message_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_game_stats" ADD CONSTRAINT "user_game_stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."achievement_reward_box" ADD CONSTRAINT "achievement_reward_box_achievement_id_fkey" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."achievement_reward_box" ADD CONSTRAINT "achievement_reward_box_box_id_fkey" FOREIGN KEY ("box_id") REFERENCES "public"."reward_box"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reward_box_reward" ADD CONSTRAINT "reward_box_reward_box_id_fkey" FOREIGN KEY ("box_id") REFERENCES "public"."reward_box"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reward_box_reward" ADD CONSTRAINT "reward_box_reward_reward_id_fkey" FOREIGN KEY ("reward_id") REFERENCES "public"."reward"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_achievement" ADD CONSTRAINT "user_achievement_achievement_id_fkey" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_achievement" ADD CONSTRAINT "user_achievement_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."game_result" ADD CONSTRAINT "game_result_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."challenge" ADD CONSTRAINT "challenge_reward_id_fkey" FOREIGN KEY ("reward_id") REFERENCES "public"."achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_challenge_progress" ADD CONSTRAINT "user_challenge_progress_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_challenge_progress" ADD CONSTRAINT "user_challenge_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."daily_reward_content_box" ADD CONSTRAINT "daily_reward_content_box_box_id_fkey" FOREIGN KEY ("box_id") REFERENCES "public"."reward_box"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."daily_reward_content_box" ADD CONSTRAINT "daily_reward_content_box_daily_reward_id_fkey" FOREIGN KEY ("daily_reward_id") REFERENCES "public"."daily_reward"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_daily_reward" ADD CONSTRAINT "user_daily_reward_daily_reward_id_fkey" FOREIGN KEY ("daily_reward_id") REFERENCES "public"."daily_reward"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_daily_reward" ADD CONSTRAINT "user_daily_reward_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_reward_box" ADD CONSTRAINT "user_reward_box_box_id_fkey" FOREIGN KEY ("box_id") REFERENCES "public"."reward_box"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_reward_box" ADD CONSTRAINT "user_reward_box_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
