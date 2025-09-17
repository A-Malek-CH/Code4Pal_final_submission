### 🔥 Prompt for Agent

You are an expert in React, TypeScript, Supabase, shadcn/ui, and react-query.
Generate a **frontend component library** that integrates with the following Prisma schema (already implemented in the database).

The library should provide **hooks + UI components** to display and interact with:

- **User profiles**
- **Game stats** (unique per user per game_type)
- **Achievements** (with earned/unearned states)
- **Challenges** (progress and completion)
- **Rewards & Reward Boxes** (earned, opened, and daily rewards)

---

### 🛠️ Requirements

#### 1. Supabase Integration

- Create a `lib/supabase.ts` client.
- Generate typed queries for all relevant tables (User, UserGameStats, Achievement, UserAchievement, Challenge, UserChallengeProgress, RewardBox, UserRewardBox, DailyReward, UserDailyReward).
- Wrap queries in **react-query hooks**.
- Example hooks:

  - `useUser(userId)` → fetch profile.
  - `useUserGameStats(userId)` → fetch all game stats for a user.
  - `useGameLeaderboard(gameType)` → fetch top users for a game.
  - `useUserAchievements(userId)` → fetch earned achievements.
  - `useAvailableAchievements(userId)` → fetch all achievements with earned status.
  - `useUserChallenges(userId)` → fetch active challenges with progress.
  - `useUserRewardBoxes(userId)` → fetch unopened boxes.
  - `useUserDailyRewards(userId)` → fetch and check claim status.

#### 2. Components (shadcn/ui based)

- **User Profile**

  - `UserProfileCard` → avatar, display_name, xp, created date.

- **Game Stats**

  - `GameStatsTable` → show stats across all games.
  - `GameStatsCard` → stats for one game (score, streaks, hearts, playtime).
  - `Leaderboard` → top users for a given game type.

- **Achievements**

  - `AchievementGrid` → display achievements (earned vs locked).
  - `AchievementBadge` → compact badge for profile view.

- **Challenges**

  - `ChallengeList` → show user’s active challenges, progress bars, completed status.

- **Rewards & Daily Rewards**

  - `RewardBoxCard` → unopened vs opened state (with animation).
  - `DailyRewardTracker` → calendar-like tracker for daily rewards.
  - `RewardCard` → reusable display for a reward (icon, name, description).

#### 3. Data Flow & State

- All data is fetched through hooks.
- Components accept either **props with pre-fetched data** or fetch internally using hooks.
- Hooks must return `{ data, isLoading, error }`.

#### 4. Demo Pages (examples)

- **UserDashboardPage** → shows profile card, game stats table, achievement grid, challenge list, daily rewards tracker.
- **GamePage** → shows leaderboard + user’s game stats card.
- **RewardsPage** → shows unopened boxes + rewards inventory.

#### 5. Code Quality

- Strict TypeScript.
- Supabase-generated types.
- Modular and tree-shakable.
- Use shadcn/ui (Card, Table, Avatar, Progress, Badge, Tooltip).
- Well-structured folder organization:

  ```
  lib/
  hooks/
  components/
  pages/examples/
  ```

---

⚡ With this prompt, the agent should generate a **full-featured UI + hook library** for your schema.

Do you also want me to extend the prompt so **XP gain & reward claiming flows (mutations)** are included, or keep it read-only (just fetching & displaying)?

# Schema

```prisma

model User {
  id                 String        @id
  display_name       String
  email              String
  photo_url          String?
  xp                 Int                     @default(0)
  created_at   DateTime     @default(now()) @db.Timestamptz(6)
  updated_at   DateTime     @default(now()) @updatedAt @db.Timestamptz(6)
  game_results       GameResult[]
  achievements       UserAchievement[]
  challenge_progress UserChallengeProgress[]
  daily_rewards      UserDailyReward[]
  game_stats         UserGameStats[]
  reward_boxes       UserRewardBox[]

  @@map("user")
}

model UserGameStats {
  id                      String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  user_id                 String
  game_type               String
  total_games_played      Int       @default(0)
  total_wins              Int       @default(0)
  total_losses            Int       @default(0)
  best_score              Int       @default(0)
  total_score             Int       @default(0)
  average_score           Float     @default(0)
  fastest_time            Int
  total_perfect_games     Int       @default(0)
  current_win_streak      Int       @default(0)
  longest_win_streak      Int       @default(0)
  current_daily_streak    Int       @default(0)
  longest_daily_streak    Int       @default(0)
  last_played_date        DateTime? @db.Date
  hearts                  Int       @default(3)
  heart_regeneration_time DateTime?
  created_at   DateTime     @default(now()) @db.Timestamptz(6)
  updated_at   DateTime     @default(now()) @updatedAt @db.Timestamptz(6)
  user                    User      @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@unique([user_id, game_type])
  @@index([user_id])
  @@index([game_type])
  @@map("user_game_stats")
}

model Achievement {
  id                String                 @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name              String                 @unique
  description       String
  icon              String
  xp_bonus          Int                    @default(0)
  criteria          Json
  category          String                 @default("general")
  created_at   DateTime     @default(now()) @db.Timestamptz(6)
  updated_at   DateTime     @default(now()) @updatedAt @db.Timestamptz(6)
  reward_boxes      AchievementRewardBox[]
  challenge_rewards Challenge[]            @relation("ChallengeReward")
  users             UserAchievement[]

  @@map("achievement")
}

model Reward {
  id           String            @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name         String
  description  String
  icon         String
  type         String
  created_at   DateTime     @default(now()) @db.Timestamptz(6)
  updated_at   DateTime     @default(now()) @updatedAt @db.Timestamptz(6)
  reward_boxes RewardBoxReward[]

  @@map("reward")
}

model RewardBox {
  id                       String                  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  type                     String
  name                     String
  description              String
  created_at   DateTime     @default(now()) @db.Timestamptz(6)
  updated_at   DateTime     @default(now()) @updatedAt @db.Timestamptz(6)
  achievements             AchievementRewardBox[]
  daily_reward_content_box DailyRewardContentBox[]
  rewards                  RewardBoxReward[]
  user_boxes               UserRewardBox[]

  @@map("reward_box")
}

model AchievementRewardBox {
  achievement_id String @db.Uuid
  box_id         String @db.Uuid
  probability    Float       @default(1.0)
  achievement    Achievement @relation(fields: [achievement_id], references: [id], onDelete: Cascade)
  box            RewardBox   @relation(fields: [box_id], references: [id], onDelete: Cascade)

  @@id([achievement_id, box_id])
  @@index([achievement_id])
  @@index([box_id])
  @@map("achievement_reward_box")
}

model RewardBoxReward {
  box_id      String  @db.Uuid
  reward_id   String @db.Uuid
  probability Float     @default(1.0)
  quantity    Int       @default(1)
  box         RewardBox @relation(fields: [box_id], references: [id], onDelete: Cascade)
  reward      Reward    @relation(fields: [reward_id], references: [id], onDelete: Cascade)

  @@id([box_id, reward_id])
  @@index([box_id])
  @@index([reward_id])
  @@map("reward_box_reward")
}

model UserAchievement {
  user_id        String
  achievement_id String @db.Uuid
  created_at   DateTime     @default(now()) @db.Timestamptz(6)
  updated_at   DateTime     @default(now()) @updatedAt @db.Timestamptz(6)
  achievement    Achievement @relation(fields: [achievement_id], references: [id], onDelete: Cascade)
  user           User        @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@id([user_id, achievement_id])
  @@map("user_achievement")
}

model GameResult {
  id                  String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  user_id             String
  game_type           String   @default("Bingo")
  level               Int
  base_points         Int
  final_points        Int
  time_spent          Int
  correct_answers     Int
  total_questions     Int
  is_win              Boolean
  speed_bonus         Int      @default(0)
  first_attempt_bonus Int      @default(0)
  played_at           DateTime @default(now())
  user                User     @relation(fields: [user_id], references: [id], onDelete: Cascade)
  extra               Json?
  @@index([user_id])
  @@index([game_type])
  @@index([played_at])
  @@map("game_result")
}

model Challenge {
  id            String                  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name          String
  description   String
  type          String
  target        Int
  reward_id     String @db.Uuid
  variant       String                  @default("static")
  date          DateTime?               @db.Date
  start_date    DateTime?               @db.Date
  end_date      DateTime?               @db.Date
  is_active     Boolean                 @default(true)
  created_at   DateTime     @default(now()) @db.Timestamptz(6)
  updated_at   DateTime     @default(now()) @updatedAt @db.Timestamptz(6)
  reward        Achievement             @relation("ChallengeReward", fields: [reward_id], references: [id], onDelete: Cascade)
  user_progress UserChallengeProgress[]

  @@index([date])
  @@index([variant])
  @@index([start_date, end_date])
  @@index([is_active])
  @@map("challenge")
}

model UserChallengeProgress {
  user_id      String
  challenge_id String @db.Uuid
  progress     Int       @default(0)
  is_completed Boolean   @default(false)
  completed_at DateTime?
  challenge    Challenge @relation(fields: [challenge_id], references: [id], onDelete: Cascade)
  user         User      @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@id([user_id, challenge_id])
  @@index([challenge_id])
  @@map("user_challenge_progress")
}

model DailyReward {
  id            String                  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  day           Int                     @unique
  other_rewards Json?
  created_at   DateTime     @default(now()) @db.Timestamptz(6)
  updated_at   DateTime     @default(now()) @updatedAt @db.Timestamptz(6)
  reward_boxes  DailyRewardContentBox[]
  user_rewards  UserDailyReward[]

  @@map("daily_reward")
}

model DailyRewardContentBox {
  daily_reward_id String @db.Uuid
  box_id          String @db.Uuid
  quantity        Int         @default(1)
  reward_box      RewardBox   @relation(fields: [box_id], references: [id], onDelete: Cascade)
  daily_reward    DailyReward @relation(fields: [daily_reward_id], references: [id], onDelete: Cascade)

  @@id([daily_reward_id, box_id])
  @@map("daily_reward_content_box")
}

model UserDailyReward {
  user_id         String
  daily_reward_id String @db.Uuid
  claimed_at      DateTime    @default(now())
  date            DateTime    @db.Date
  reward          DailyReward @relation(fields: [daily_reward_id], references: [id], onDelete: Cascade)
  user            User        @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@id([user_id, daily_reward_id, date])
  @@map("user_daily_reward")
}

model UserRewardBox {
  user_id   String
  box_id    String @db.Uuid
  is_opened Boolean   @default(false)
  earned_at DateTime  @default(now())
  opened_at DateTime?
  id        String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  box       RewardBox @relation(fields: [box_id], references: [id], onDelete: Cascade)
  user      User      @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@index([user_id])
  @@index([box_id])
  @@index([is_opened])
  @@map("user_reward_box")
}

```
