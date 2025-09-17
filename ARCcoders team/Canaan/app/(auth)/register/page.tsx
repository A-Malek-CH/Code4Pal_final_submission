"use client";

import type React from "react";
import { useState } from "react";
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
	createUserWithEmailAndPassword,
	updateProfile,
} from "firebase/auth";
import { loginWithCredential } from "@/api/index";
import { useLoadingCallback } from "react-loading-hook";
import { getFirebaseAuth } from "@/components/firebase-auth/firebase";
import { useRedirectAfterLogin } from "@/shared/useRedirectAfterLogin";

import {
	registerFormSchema,
	RegisterFormValues,
} from "@/lib/validations/auth-schema";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth/layout";
import { setCustomUserClaims } from "@/lib/server/auth";
import { getOrCreateUserFromAuth } from "@/lib/supabase";

export default function RegisterPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [handleRegister, isRegistering, registerError] = useLoadingCallback(
		async ({ email, passwordData, displayName }: RegisterFormValues) => {
			const auth = getFirebaseAuth();
			try {
				const credential = await createUserWithEmailAndPassword(
					auth,
					email,
					passwordData.password
				);
				await updateProfile(credential.user, { displayName });
				await getOrCreateUserFromAuth({
					id: credential.user.uid,
					email: credential.user.email as string,
					display_name: credential.user.displayName as string,
					photo_url: credential.user.photoURL,
					email_verified: credential.user.emailVerified as boolean,
				});
				await handleLogin(credential);
			} catch (error: any) {
				toast.error(
					`Failed to register: ${error.message.split("Firebase: ")[1]}`
				);
				console.error("Error registering:", error);
			}
		}
	);

	const redirectAfterLogin = useRedirectAfterLogin();

	async function handleLogin(credential: UserCredential) {
		try {
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

	const registerForm = useForm<RegisterFormValues>({
		resolver: zodResolver(registerFormSchema as any),
		defaultValues: {
			email: "",
			passwordData: {
				password: "",
				confirmPassword: "",
			},
			displayName: "",
		},
	});
	const onSubmit = async (data: RegisterFormValues) => {
		await handleRegister(data);
	};

	return (
		<AuthLayout
			title="Create Account"
			subtitle="Enter your information to create an account"
		>
			{/* <div className="flex items-center justify-center min-h-screen bg-background">
				<Card className="w-full max-w-md">
					<CardHeader className="space-y-1 text-center">
						<CardTitle className="text-2xl font-bold">
							Create an account
						</CardTitle>
						<CardDescription>
							Enter your information to create an account
						</CardDescription>
					</CardHeader>

					<CardContent> */}
			<Form {...registerForm}>
				<form
					onSubmit={registerForm.handleSubmit(onSubmit)}
					className="space-y-6"
				>
					<FormField
						control={registerForm.control}
						name="displayName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Display Name</FormLabel>
								<FormControl>
									<Input placeholder="Your Name" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={registerForm.control}
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
						control={registerForm.control}
						name="passwordData.password"
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
											{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
										</Button>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={registerForm.control}
						name="passwordData.confirmPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Confirm Password</FormLabel>
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
											{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
										</Button>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{registerForm.formState.errors.passwordData?.root?.message && (
						<div className="bg-red-500/10 border border-red-500/50 rounded-md p-3">
							<FormMessage className="text-red-400 font-mono text-sm">
								{registerForm.formState.errors.passwordData?.root?.message}
							</FormMessage>
						</div>
					)}
					{registerError && (
						<div className="text-red-500 text-sm">{registerError}</div>
					)}

					<Button type="submit" disabled={isRegistering} className="w-full">
						{isRegistering ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Creating account...
							</>
						) : (
							"Create account"
						)}
					</Button>
				</form>
			</Form>
			{/* </CardContent>
				</Card>
			</div> */}
		</AuthLayout>
	);
}
