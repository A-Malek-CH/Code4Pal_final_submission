import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { YStack, Input, Button, Text, XStack, Spinner } from "tamagui";
import { router, Link } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { useAppStore } from "~/store/index";
import { secureUserSchema, secureAuthSchema, sanitizeInput, checkRateLimit } from "~/utils/security";

// ✅ Enhanced Security Validation Schema
const signupSchema = z
  .object({
    name: z.string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters")
      .regex(/^[a-zA-Z\s\u0600-\u06FF]+$/, "Name can only contain letters and spaces")
      .transform(sanitizeInput),
    email: z.string()
      .email("Invalid email address")
      .max(100, "Email must be less than 100 characters")
      .transform(input => input.toLowerCase().trim()),
    password: z.string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be less than 128 characters")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase, and number"),
    confirmPassword: z.string().min(8, "Confirm your password"),
    location: z.string()
      .min(2, "Location is required")
      .max(100, "Location must be less than 100 characters")
      .transform(sanitizeInput),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false); // retained but unused after redirect
  const { login, completeOnboarding } = useAppStore();
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    // Rate limiting protection
    const userIdentifier = `signup_${data.email}`;
    if (!checkRateLimit(userIdentifier, 3, 300000)) { // 3 attempts per 5 minutes
      Alert.alert("Too Many Attempts", "Please wait 5 minutes before trying again.");
      return;
    }

    setIsLoading(true);
    try {
      // Additional security validation
      if (data.name.length < 2 || data.name.length > 50) {
        throw new Error("Invalid name length");
      }
      
      if (data.location.length < 2 || data.location.length > 100) {
        throw new Error("Invalid location");
      }

      // Create user data for database
      const newUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Generate unique ID
        name: data.name, // Already sanitized by schema
        email: data.email, // Already sanitized by schema
        location: data.location, // Already sanitized by schema
        bio: '',
        phone: '',
        avatar: '',
        isVerified: false,
        role: 'doer', // Default role
        isInGaza: data.location.toLowerCase().includes('gaza'),
      };

  // Use the login function to create and authenticate the user
  await login(newUser, 'mock_token');
  // Mark onboarding complete so route guard doesn't redirect away from signup
  completeOnboarding();
      
      console.log("User created successfully:", newUser);
      
  // Navigate to Complete Profile screen
  router.replace('/(profileScreens)/CompleteProfile' as any);
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert(
        "Signup Failed",
        error instanceof Error ? error.message : "There was an error creating your account. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <YStack f={1} bg="white" px={20} py={40} jc="center" gap={20}>
      <Text fontSize={28} fontWeight="700" textAlign="center" mb={20}>
        Create Account
      </Text>

      {/* Name */}
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <YStack gap={6}>
            <Text fontSize={14} fontWeight="600">
              Name
            </Text>
            <Input
              placeholder="Enter your name"
              value={value}
              onChangeText={onChange}
              borderColor={errors.name ? "red" : "#E3E3E3"}
            />
            {errors.name && (
              <Text color="red" fontSize={12}>
                {errors.name.message}
              </Text>
            )}
          </YStack>
        )}
      />

      {/* Email */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <YStack gap={6}>
            <Text fontSize={14} fontWeight="600">
              Email
            </Text>
            <Input
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
              borderColor={errors.email ? "red" : "#E3E3E3"}
            />
            {errors.email && (
              <Text color="red" fontSize={12}>
                {errors.email.message}
              </Text>
            )}
          </YStack>
        )}
      />

      {/* Password */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <YStack gap={6}>
            <Text fontSize={14} fontWeight="600">
              Password
            </Text>
            <Input
              placeholder="Enter your password"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              borderColor={errors.password ? "red" : "#E3E3E3"}
            />
            {errors.password && (
              <Text color="red" fontSize={12}>
                {errors.password.message}
              </Text>
            )}
          </YStack>
        )}
      />

      {/* Confirm Password */}
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, value } }) => (
          <YStack gap={6}>
            <Text fontSize={14} fontWeight="600">
              Confirm Password
            </Text>
            <Input
              placeholder="Confirm your password"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              borderColor={errors.confirmPassword ? "red" : "#E3E3E3"}
            />
            {errors.confirmPassword && (
              <Text color="red" fontSize={12}>
                {errors.confirmPassword.message}
              </Text>
            )}
          </YStack>
        )}
      />

      {/* Location */}
      <Controller
        control={control}
        name="location"
        render={({ field: { onChange, value } }) => (
          <YStack gap={6}>
            <Text fontSize={14} fontWeight="600">
              Location
            </Text>
            <Input
              placeholder="e.g. Gaza City, Palestine"
              value={value}
              onChangeText={onChange}
              borderColor={errors.location ? "red" : "#E3E3E3"}
            />
            {errors.location && (
              <Text color="red" fontSize={12}>
                {errors.location.message}
              </Text>
            )}
          </YStack>
        )}
      />

      {/* Signup Button */}
      <Button
        bg="#4a8a28"
        h={55}
        br={12}
        onPress={handleSubmit(onSubmit)}
        mt={10}
        disabled={isLoading}
      >
        {isLoading ? (
          <XStack ai="center" gap={10}>
            <Spinner size="small" color="white" />
            <Text color="white" fontSize={16} fontWeight="600">
              Creating Account...
            </Text>
          </XStack>
        ) : (
          <Text color="white" fontSize={16} fontWeight="600">
            Sign Up
          </Text>
        )}
      </Button>

      {/* Login Link */}
      <XStack jc="center" gap={6} mt={10}>
        <Text fontSize={14}>Already have an account?</Text>
        <Link href="/login" asChild>
          <Text fontSize={14} color="#4a8a28" fontWeight="600">
            Login
          </Text>
        </Link>
      </XStack>

      {/* Post-signup modal deprecated by dedicated screen */}
    </YStack>
  );
}
