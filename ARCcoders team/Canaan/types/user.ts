import { User, Prisma } from "@prisma/client";
import { Claims } from "next-firebase-auth-edge/lib/auth/claims";

// Your existing interfaces and enums
export enum UserRole {
	USER = "USER",
	ADMIN = "ADMIN",
	AUTHOR = "AUTHOR",
}
export interface IAuthIdentity {
	id: string; // Firebase UID
	email: string;
	display_name: string;
	photo_url: string | null;
	email_verified: boolean;
	provider_id: string;
	id_token: string;
	custom_token?: string;
}
export type IUser = IAuthIdentity & {
	email_verified: boolean;
	provider_id: string;
	custom_claims: Claims;
};

// =================================================================
// The Solution
// =================================================================

// 1. Define the reusable query arguments object.
//    The object itself has the 'include' key.
//    The type is Pick<...> to represent an object that *only* has an 'include' property
//    from the full FindUnique arguments.
export const userWithDetailsArgs = {
	include: {
		achievements: true,
		game_results: true,
		challenge_progress: true,
		daily_rewards: true,
		game_stats: true,
		reward_boxes: true,
	},
} satisfies Pick<Prisma.UserFindUniqueArgs, "include">;

// 2. Generate a type from this correctly shaped arguments object.
//    This now works because `userWithDetailsArgs` has the exact shape
//    that GetPayload expects.
type UserWithDetails = Prisma.UserGetPayload<typeof userWithDetailsArgs>;

// 3. Create your final, extended type using an intersection. (This remains the same)
export type IUserWithDetails = IUser & UserWithDetails;
