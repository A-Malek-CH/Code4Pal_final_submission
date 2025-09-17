// EditProfile.tsx
import React, { useState, useEffect } from 'react';
import { Alert, Platform, Image } from 'react-native';
import { YStack, XStack, Text, Button, ScrollView, Input } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useAppStore } from '~/store/index';
import { debugUserProfile, testUserUpdate } from '~/utils/debugProfile';

// Validation Schema
const editProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username is too long').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  bio: z.string().max(160, 'Bio must be 160 characters or less').optional(),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'),
  location: z.string().min(2, 'Location must be at least 2 characters').max(100, 'Location is too long'),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

interface EditProfileProps {}

export default function EditProfile({}: EditProfileProps) {
  const { user, updateUser, loadUserFromDatabase } = useAppStore();
  const [profileImage, setProfileImage] = useState<string | null>(user?.avatar || null);
  const [isLoading, setIsLoading] = useState(false);

  // Load user data on component mount
  useEffect(() => {
    const initializeUserData = async () => {
      if (!user) {
        console.log('No user in store, attempting to load from database...');
        try {
          const loadedUser = await loadUserFromDatabase();
          if (!loadedUser) {
            console.warn('No user could be loaded from database');
            Alert.alert(
              'No User Found',
              'No user profile found. Please log in again.',
              [{ text: 'OK', onPress: () => router.back() }]
            );
            return;
          }
        } catch (error) {
          console.error('Failed to load user from database:', error);
          Alert.alert(
            'Error Loading Profile',
            'Could not load user profile. Please try again.',
            [{ text: 'OK', onPress: () => router.back() }]
          );
          return;
        }
      }
      
      if (user) {
        // Debug user profile
        debugUserProfile(user.id);
      }
    };
    
    initializeUserData();
  }, [user]);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user?.name || "Ayoub Salhi",
      username: "ayoub_dev",
      bio: user?.bio || "Helping missions and spreading kindness 🌿",
      email: user?.email || "ayoub@example.com",
      phone: user?.phone || "+213 555 123 456",
      location: user?.location || "Algiers, Algeria"
    },
  });

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert("Permission Required", "Permission to access camera roll is required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert("Permission Required", "Permission to access camera is required!");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      "Select Photo",
      "Choose how you'd like to update your profile photo",
      [
        { text: "Camera", onPress: takePhoto },
        { text: "Gallery", onPress: pickImage },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const onSubmit = async (data: EditProfileFormData) => {
    setIsLoading(true);
    try {
      console.log('Submitting profile update with data:', data);
      console.log('Profile image:', profileImage);
      console.log('Current user:', user);
      
      if (!user) {
        throw new Error('No user found in store');
      }
      
      // Test the update first
      await testUserUpdate(user.id, {
        name: data.name,
        email: data.email,
        bio: data.bio,
        location: data.location,
        phone: data.phone,
        avatar: profileImage || user.avatar
      });
      
      // Update user data in store and database
      const updateData = {
        ...data,
        avatar: profileImage || user?.avatar,
      };
      
      console.log('Update data being sent:', updateData);
      
      await updateUser(updateData);
      
      console.log('Profile update successful');
      
      Alert.alert(
        "Success",
        "Your profile has been updated successfully!",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert(
        "Error", 
        `Failed to update profile. Please try again.\n\nError details: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      Alert.alert(
        "Discard Changes",
        "Are you sure you want to discard your changes?",
        [
          { text: "Keep Editing", style: "cancel" },
          { text: "Discard", style: "destructive", onPress: () => router.back() }
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <ScrollView f={1} bg="#f8f9fa" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <YStack pt={50} pb={20} px={20} bg="white">
        <XStack ai="center" jc="space-between" mb={20}>
          <Button
            unstyled
            onPress={handleCancel}
            p={8}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </Button>
          <Text fontSize={18} fontWeight="700" color="#333">
            Edit Profile
          </Text>
          <Button
            unstyled
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            opacity={isLoading ? 0.6 : 1}
          >
            <Text fontSize={16} fontWeight="600" color="#4a8a28">
              {isLoading ? "Saving..." : "Save"}
            </Text>
          </Button>
        </XStack>

        {/* Profile Image Section */}
        <YStack ai="center" mb={20}>
          <YStack pos="relative">
            <YStack
              w={120}
              h={120}
              br={60}
              bg="#e9ecef"
              ai="center"
              jc="center"
              overflow="hidden"
            >
              {profileImage ? (
                <Image 
                  source={{ uri: profileImage }} 
                  style={{ width: 120, height: 120, borderRadius: 60 }}
                />
              ) : (
                <Ionicons name="person" size={60} color="#6c757d" />
              )}
            </YStack>
            <Button
              unstyled
              pos="absolute"
              bottom={0}
              right={0}
              w={36}
              h={36}
              br={18}
              bg="#4a8a28"
              ai="center"
              jc="center"
              onPress={showImageOptions}
              shadowColor="#4a8a28"
              shadowOpacity={0.3}
              shadowRadius={4}
              shadowOffset={{ width: 0, height: 2 }}
            >
              <Ionicons name="camera" size={18} color="white" />
            </Button>
          </YStack>
        </YStack>
      </YStack>

      {/* Form Fields */}
      <YStack px={20} py={20} gap={20}>
        {/* Name Field */}
        <YStack gap={8}>
          <Text fontSize={14} fontWeight="600" color="#333">Name</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                h={50}
                br={12}
                bg="white"
                borderColor={errors.name ? "#dc3545" : "#e9ecef"}
                borderWidth={1}
                px={16}
                fontSize={16}
                placeholder="Enter your name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {errors.name && (
            <Text fontSize={12} color="#dc3545">{errors.name.message}</Text>
          )}
        </YStack>

        {/* Username Field */}
        <YStack gap={8}>
          <Text fontSize={14} fontWeight="600" color="#333">Username</Text>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                h={50}
                br={12}
                bg="white"
                borderColor={errors.username ? "#dc3545" : "#e9ecef"}
                borderWidth={1}
                px={16}
                fontSize={16}
                placeholder="Enter username"
                value={value}
                onChangeText={(text) => onChange(text.toLowerCase())}
                onBlur={onBlur}
                autoCapitalize="none"
              />
            )}
          />
          {errors.username && (
            <Text fontSize={12} color="#dc3545">{errors.username.message}</Text>
          )}
        </YStack>

        {/* Bio Field */}
        <YStack gap={8}>
          <XStack jc="space-between" ai="center">
            <Text fontSize={14} fontWeight="600" color="#333">Bio</Text>
            <Text fontSize={12} color="#6c757d">
              {watch('bio')?.length || 0}/160
            </Text>
          </XStack>
          <Controller
            control={control}
            name="bio"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                h={80}
                br={12}
                bg="white"
                borderColor={errors.bio ? "#dc3545" : "#e9ecef"}
                borderWidth={1}
                px={16}
                py={12}
                fontSize={16}
                placeholder="Tell us about yourself..."
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
                textAlignVertical="top"
              />
            )}
          />
          {errors.bio && (
            <Text fontSize={12} color="#dc3545">{errors.bio.message}</Text>
          )}
        </YStack>

        {/* Email Field */}
        <YStack gap={8}>
          <Text fontSize={14} fontWeight="600" color="#333">Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                h={50}
                br={12}
                bg="white"
                borderColor={errors.email ? "#dc3545" : "#e9ecef"}
                borderWidth={1}
                px={16}
                fontSize={16}
                placeholder="Enter your email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            )}
          />
          {errors.email && (
            <Text fontSize={12} color="#dc3545">{errors.email.message}</Text>
          )}
        </YStack>

        {/* Phone Field */}
        <YStack gap={8}>
          <Text fontSize={14} fontWeight="600" color="#333">Phone</Text>
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                h={50}
                br={12}
                bg="white"
                borderColor={errors.phone ? "#dc3545" : "#e9ecef"}
                borderWidth={1}
                px={16}
                fontSize={16}
                placeholder="Enter your phone number"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="phone-pad"
              />
            )}
          />
          {errors.phone && (
            <Text fontSize={12} color="#dc3545">{errors.phone.message}</Text>
          )}
        </YStack>

        {/* Location Field */}
        <YStack gap={8}>
          <Text fontSize={14} fontWeight="600" color="#333">Location</Text>
          <Controller
            control={control}
            name="location"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                h={50}
                br={12}
                bg="white"
                borderColor={errors.location ? "#dc3545" : "#e9ecef"}
                borderWidth={1}
                px={16}
                fontSize={16}
                placeholder="Enter your location"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {errors.location && (
            <Text fontSize={12} color="#dc3545">{errors.location.message}</Text>
          )}
        </YStack>



        {/* Save Button */}
        <Button
          bg="#4a8a28"
          h={55}
          br={16}
          mt={20}
          mb={30}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          opacity={isLoading ? 0.6 : 1}
          shadowColor="#4a8a28"
          shadowOpacity={0.3}
          shadowRadius={8}
          shadowOffset={{ width: 0, height: 4 }}
        >
          <XStack ai="center" gap={12}>
            {isLoading ? (
              <Text fontSize={16} fontWeight="700" color="white">Saving...</Text>
            ) : (
              <>
                <Ionicons name="checkmark" size={22} color="white" />
                <Text fontSize={16} fontWeight="700" color="white">Save Changes</Text>
              </>
            )}
          </XStack>
        </Button>
      </YStack>
    </ScrollView>
  );
}