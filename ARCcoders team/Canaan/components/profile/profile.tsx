"use client";

import { useUserProfile } from "@/hooks/use-user-profile";
import { UserProfileCard } from "@/components/profile/user-profile-card"; // Your presentational component
import { UserProfileSkeleton } from "@/components/profile/user-profile-skeleton"; // The loading skeleton
import { Error, NotFound } from "@/components/error-handlers";
import { useAuth } from "../firebase-auth/AuthContext";

export default function UserProfile() {
	const { user: authUser } = useAuth();

	if (!authUser) {
		return <NotFound />;
	}
	const { data: user, isLoading, isError, error } = useUserProfile(authUser.id);

	if (isLoading) {
		return <UserProfileSkeleton />;
	}

	if (isError) {
		return <Error message={"Error: Could not load user profile."}></Error>;
	}

	// We cast the fetched user data to the type expected by UserProfileCard
	// Note: You should align your types. Here IUser is assumed to be compatible with UserProfile.
	return <UserProfileCard user={user as any} />;
}
