"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
	FormItem,
	Form,
	FormMessage,
	FormLabel,
	FormControl,
	FormField,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	UserCredential,
	getAdditionalUserInfo,
	getIdTokenResult,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { loginWithCredential } from "@/api/index";
import { useLoadingCallback } from "react-loading-hook";
import { getFirebaseAuth } from "@/components/firebase-auth/firebase";
import { useRedirectAfterLogin } from "@/shared/useRedirectAfterLogin";
import { getGoogleProvider, loginWithProvider } from "./firebase";
import {
	loginFormSchema,
	LoginFormValues,
} from "@/lib/validations/auth-schema";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth/layout";
import { Separator } from "@/components/ui/separator";

import { useRedirectParam } from "@/shared/useRedirectParam";
import { GoogleLogoSvg } from "@/components/icons/google-icon";
import { getOrCreateUserFromAuth } from "@/lib/supabase";

export default function LoginPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [handleLoginWithEmailAndPassword, isEmailLoading, emailPasswordError] =
		useLoadingCallback(async ({ email, password }: LoginFormValues) => {
			const auth = getFirebaseAuth();
			try {
				const credential = await signInWithEmailAndPassword(
					auth,
					email,
					password
				);
				await handleLogin(credential);
			} catch (error: any) {
				toast.error(
					`Failed to log in: ${error.message.split("Firebase: ")[1]}`
				);
				console.error("Error logging in:", error);
			}
		});
	const [handleLoginWithGoogle, isGoogleLoading, googleError] =
		useLoadingCallback(async () => {
			const auth = getFirebaseAuth();
			try {
				const credential = await loginWithProvider(
					auth,
					getGoogleProvider(auth)
				);
				await getOrCreateUserFromAuth({
					id: credential.user.uid,
					email: credential.user.email as string,
					display_name: credential.user.displayName as string,
					photo_url: credential.user.photoURL,
					email_verified: credential.user.emailVerified as boolean,
				});

				await handleLogin(credential);
			} catch (error: any) {
				const errorMessage =
					error.message.split("Firebase: ")[1] || error.message;
				toast.error(`Failed to log in: ${errorMessage}`);
				console.error("Error logging in:", error);
			}
		});

	const redirectAfterLogin = useRedirectAfterLogin();

	async function handleLogin(credential: UserCredential) {
		try {
			// Force refresh to get custom claims, especially for new Google users.
			await getIdTokenResult(credential.user, true);

			const result = await loginWithCredential(credential);
			if (!result) {
				throw new Error("Failed to log in");
			}

			redirectAfterLogin();
		} catch (error) {
			toast.error("Failed to log in");
			console.error("Error logging in:", error);
		}
	}

	const loginForm = useForm<LoginFormValues>({
		resolver: zodResolver(loginFormSchema as any),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: LoginFormValues) => {
		await handleLoginWithEmailAndPassword(data);
	};

	return (
		<AuthLayout
			title="Welcome Back"
			subtitle="Login with Auth providers or Enter your your account credentials"
		>
			<div className="space-y-6">
				<div className="space-y-3">
					<Button
						variant="outline"
						disabled={isGoogleLoading}
						onClick={handleLoginWithGoogle}
						className="w-full bg-transparent"
					>
						{isGoogleLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Logging in...
							</>
						) : (
							<>
								<GoogleLogoSvg className="mr-2 h-4 w-4" />
								Log in with Google
							</>
						)}
					</Button>
				</div>

				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<Separator className="w-full" />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-background px-2 text-muted-foreground">
							Or continue with email
						</span>
					</div>
				</div>
				<Form {...loginForm}>
					<form
						onSubmit={loginForm.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						<FormField
							control={loginForm.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="name@example.com"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={loginForm.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												type={showPassword ? "text" : "password"}
												placeholder="******"
												{...field}
											/>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-muted-foreground"
												onClick={() => setShowPassword(!showPassword)}
												tabIndex={-1}
											>
												{showPassword ? (
													<EyeOff size={16} />
												) : (
													<Eye size={16} />
												)}
											</Button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{emailPasswordError && (
							<div className="text-red-500 text-sm">{emailPasswordError}</div>
						)}

						<Button type="submit" disabled={isEmailLoading} className="w-full">
							{isEmailLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Logging in...
								</>
							) : (
								"Login"
							)}
						</Button>
					</form>
				</Form>
			</div>
		</AuthLayout>
	);
}
