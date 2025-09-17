// This file is manually generated based on the Prisma schema.
// In a real project, you would use `supabase gen types typescript`

export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export interface Database {
	public: {
		Tables: {
			user: {
				Row: {
					id: string;
					display_name: string;
					email: string;
					photo_url: string | null;
					xp: number;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id: string;
					display_name: string;
					email: string;
					photo_url?: string | null;
					xp?: number;
				};
				Update: {
					display_name?: string;
					email?: string;
					photo_url?: string | null;
					xp?: number;
				};
			};
			user_game_stats: {
				Row: {
					id: string;
					user_id: string;
					game_type: string;
					total_games_played: number;
					total_wins: number;
					total_losses: number;
					best_score: number;
					total_score: number;
					average_score: number;
					fastest_time: number | null;
					current_win_streak: number;
					longest_win_streak: number;
					current_daily_streak: number;
					longest_daily_streak: number;
					last_played_date: string | null;
					hearts: number;
					heart_regeneration_time: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					game_type: string;
					total_games_played?: number;
					total_wins?: number;
					total_losses?: number;
					best_score?: number;
					total_score?: number;
					average_score?: number;
					fastest_time?: number | null;
					current_win_streak?: number;
					longest_win_streak?: number;
					current_daily_streak?: number;
					longest_daily_streak?: number;
					last_played_date?: string | null;
					hearts?: number;
					heart_regeneration_time?: string | null;
				};
				Update: {
					total_games_played?: number;
					total_wins?: number;
					total_losses?: number;
					best_score?: number;
					total_score?: number;
					average_score?: number;
					fastest_time?: number | null;
					current_win_streak?: number;
					longest_win_streak?: number;
					current_daily_streak?: number;
					longest_daily_streak?: number;
					last_played_date?: string | null;
					hearts?: number;
					heart_regeneration_time?: string | null;
				};
			};
			achievement: {
				Row: {
					id: string;
					name: string;
					description: string;
					icon: string;
					xp_bonus: number;
					criteria: Json;
					category: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					name: string;
					description: string;
					icon: string;
					xp_bonus?: number;
					criteria: Json;
					category?: string;
				};
				Update: {
					name?: string;
					description?: string;
					icon?: string;
					xp_bonus?: number;
					criteria?: Json;
					category?: string;
				};
			};
			reward: {
				Row: {
					id: string;
					name: string;
					description: string;
					icon: string;
					type: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					name: string;
					description: string;
					icon: string;
					type: string;
				};
				Update: {
					name?: string;
					description?: string;
					icon?: string;
					type?: string;
				};
			};
			reward_box: {
				Row: {
					id: string;
					type: string;
					name: string;
					icon: string;
					description: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					type: string;
					name: string;
					icon: string;
					description: string;
				};
				Update: {
					type?: string;
					name?: string;
					icon: string;
					description?: string;
				};
			};
			achievement_reward_box: {
				Row: {
					achievement_id: string;
					box_id: string;
					probability: number;
				};
				Insert: {
					achievement_id: string;
					box_id: string;
					probability?: number;
				};
				Update: {
					probability?: number;
				};
			};
			reward_box_reward: {
				Row: {
					box_id: string;
					reward_id: string;
					probability: number;
					quantity: number;
				};
				Insert: {
					box_id: string;
					reward_id: string;
					probability?: number;
					quantity?: number;
				};
				Update: {
					probability?: number;
					quantity?: number;
				};
			};
			user_achievement: {
				Row: {
					user_id: string;
					achievement_id: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					user_id: string;
					achievement_id: string;
				};
				Update: {};
			};
			game_result: {
				Row: {
					id: string;
					user_id: string;
					game_type: string;
					level: number;
					base_points: number;
					final_points: number;
					time_spent: number;
					correct_answers: number;
					total_questions: number;
					is_win: boolean;
					speed_bonus: number;
					first_attempt_bonus: number;
					played_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					game_type?: string;
					level: number;
					base_points: number;
					final_points: number;
					time_spent: number;
					correct_answers: number;
					total_questions: number;
					is_win: boolean;
					speed_bonus?: number;
					first_attempt_bonus?: number;
					played_at?: string;
				};
				Update: {
					game_type?: string;
					level?: number;
					base_points?: number;
					final_points?: number;
					time_spent?: number;
					correct_answers?: number;
					total_questions?: number;
					is_win?: boolean;
					speed_bonus?: number;
					first_attempt_bonus?: number;
				};
			};
			challenge: {
				Row: {
					id: string;
					name: string;
					description: string;
					type: string;
					target: number;
					reward_id: string;
					variant: string;
					date: string | null;
					start_date: string | null;
					end_date: string | null;
					is_active: boolean;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					name: string;
					description: string;
					type: string;
					target: number;
					reward_id: string;
					variant?: string;
					date?: string | null;
					start_date?: string | null;
					end_date?: string | null;
					is_active?: boolean;
				};
				Update: {
					name?: string;
					description?: string;
					type?: string;
					target?: number;
					reward_id?: string;
					variant?: string;
					date?: string | null;
					start_date?: string | null;
					end_date?: string | null;
					is_active?: boolean;
				};
			};
			user_challenge_progress: {
				Row: {
					user_id: string;
					challenge_id: string;
					progress: number;
					is_completed: boolean;
					completed_at: string | null;
				};
				Insert: {
					user_id: string;
					challenge_id: string;
					progress?: number;
					is_completed?: boolean;
					completed_at?: string | null;
				};
				Update: {
					progress?: number;
					is_completed?: boolean;
					completed_at?: string | null;
				};
			};
			daily_reward: {
				Row: {
					id: string;
					day: number;
					other_rewards: Json | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					day: number;
					other_rewards?: Json | null;
				};
				Update: {
					day?: number;
					other_rewards?: Json | null;
				};
			};
			daily_reward_content_box: {
				Row: {
					daily_reward_id: string;
					box_id: string;
					quantity: number;
				};
				Insert: {
					daily_reward_id: string;
					box_id: string;
					quantity?: number;
				};
				Update: {
					quantity?: number;
				};
			};
			user_daily_reward: {
				Row: {
					user_id: string;
					daily_reward_id: string;
					claimed_at: string;
					date: string;
				};
				Insert: {
					user_id: string;
					daily_reward_id: string;
					claimed_at?: string;
					date: string;
				};
				Update: {};
			};
			user_reward_box: {
				Row: {
					user_id: string;
					box_id: string;
					is_opened: boolean;
					earned_at: string;
					opened_at: string | null;
					id: string;
				};
				Insert: {
					user_id: string;
					box_id: string;
					is_opened?: boolean;
					earned_at?: string;
					opened_at?: string | null;
					id?: string;
				};
				Update: {
					is_opened?: boolean;
					opened_at?: string | null;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}

export type Achievement = Database["public"]["Tables"]["achievement"]["Row"];
export type NewAchievement =
	Database["public"]["Tables"]["achievement"]["Insert"];
export type UserGameStats =
	Database["public"]["Tables"]["user_game_stats"]["Row"];
export type Reward = Database["public"]["Tables"]["reward"]["Row"];
export type NewReward = Database["public"]["Tables"]["reward"]["Insert"];
export type RewardBox = Database["public"]["Tables"]["reward_box"]["Row"];
export type NewRewardBox = Database["public"]["Tables"]["reward_box"]["Insert"];
export type UserRewardBox =
	Database["public"]["Tables"]["user_reward_box"]["Row"];
export type Challenge = Database["public"]["Tables"]["challenge"]["Row"];
export type NewChallenge = Database["public"]["Tables"]["challenge"]["Insert"];
export type UserChallengeProgress =
	Database["public"]["Tables"]["user_challenge_progress"]["Row"];
