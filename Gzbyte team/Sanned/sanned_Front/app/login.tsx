import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { YStack, XStack, Input, Button, Text } from "tamagui";
import { router, Link } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useAppStore } from "~/store";
import { database } from "~/database";
import { User as DBUser } from "~/database/models";
import { Q } from "@nozbe/watermelondb";
import { secureAuthSchema, sanitizeInput, checkRateLimit } from "~/utils/security";

// ✅ Enhanced Security Validation Schema
const loginSchema = z.object({
  email: z.string()
    .email("Invalid email address")
    .max(100, "Email must be less than 100 characters")
    .transform(input => input.toLowerCase().trim()),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const { login, isAuthenticated } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated]);

  const onSubmit = async (data: LoginFormData) => {
    // Rate limiting protection
    const userIdentifier = `login_${data.email}`;
    if (!checkRateLimit(userIdentifier, 5, 300000)) { // 5 attempts per 5 minutes
      Alert.alert("Too Many Attempts", "Please wait 5 minutes before trying again.");
      return;
    }

    setIsLoading(true);
    
    try {
      // Input validation
      if (!data.email || !data.password) {
        throw new Error("Email and password are required");
      }

      // Check if user exists in database
      const users = await database.get<DBUser>('users')
        .query(Q.where('email', data.email))
        .fetch();
      
      if (users.length === 0) {
        Alert.alert(
          "Login Failed", 
          "No account found with this email address. Please check your email or create a new account."
        );
        setIsLoading(false);
        return;
      }
      
      const dbUser = users[0] as any;
      
      // In a real app, you would verify password hash here
      // For now, we'll just simulate this check
      // TODO: Implement proper password hashing and verification
      
      // Create user object for store
      const user = {
        id: dbUser.id,
        email: dbUser.email,
        name: sanitizeInput(dbUser.name || ''),
        avatar: dbUser.avatar,
        isVerified: dbUser.isVerified,
        role: dbUser.role,
        location: sanitizeInput(dbUser.location || ''),
        bio: sanitizeInput(dbUser.bio || ''),
        phone: sanitizeInput(dbUser.phone || ''),
        isInGaza: dbUser.isInGaza,
      };
      
      const mockToken = "mock-jwt-token";
      
      // Update store with login data (this will load notifications and skills)
      await login(user, mockToken);
      
      console.log("User logged in successfully:", user);
      
      // Navigation will be handled by the protected route hook in _layout
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Login Failed", "An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <YStack f={1} bg="white" px={20} py={40} jc="center" gap={20}>
      <YStack ai="center" mb={40}>
        <Text fontSize={28} fontWeight="700" textAlign="center" mb={8}>
          Welcome Back
        </Text>
        <Text fontSize={16} color="#666" textAlign="center">
          Sign in to your account to continue
        </Text>
      </YStack>

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
              h={50}
              br={12}
              px={16}
              fontSize={16}
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
              h={50}
              br={12}
              px={16}
              fontSize={16}
            />
            {errors.password && (
              <Text color="red" fontSize={12}>
                {errors.password.message}
              </Text>
            )}
          </YStack>
        )}
      />

      {/* Login Button */}
      <Button
        bg="#4a8a28"
        h={55}
        br={12}
        onPress={handleSubmit(onSubmit)}
        mt={10}
        disabled={isLoading}
        opacity={isLoading ? 0.7 : 1}
      >
        <Text color="white" fontSize={16} fontWeight="600">
          {isLoading ? "Signing In..." : "Sign In"}
        </Text>
      </Button>

      {/* Forgot Password */}
      <Button
        unstyled
        onPress={() => Alert.alert("Forgot Password", "Password reset feature coming soon!")}
      >
        <Text fontSize={14} color="#4a8a28" textAlign="center">
          Forgot your password?
        </Text>
      </Button>

      {/* Sign Up Link */}
      <YStack ai="center" mt={20}>
        <XStack ai="center" gap={4}>
          <Text fontSize={14} color="#666">
            Don't have an account?
          </Text>
          <Link href="/signup" asChild>
            <Button unstyled>
              <Text fontSize={14} color="#4a8a28" fontWeight="600">
                Sign Up
              </Text>
            </Button>
          </Link>
        </XStack>
      </YStack>
    </YStack>
  );
}