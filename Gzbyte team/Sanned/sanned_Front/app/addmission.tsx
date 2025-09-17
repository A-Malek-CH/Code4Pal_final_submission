import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  YStack,
  XStack,
  Input,
  Button,
  Text,
  TextArea,
  Select,
  Image,
  ScrollView,
  Card,
  Circle,
  Progress,
} from "tamagui";
import { HeaderC } from "~/assets/ui/components/headerC";
import { router } from "expo-router";
import { useAppStore } from "~/store/index";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { selectAndUploadImage, ImageUploadResult } from "~/utils/imageUpload";
import { Alert } from "react-native";
import { secureMissionSchema, sanitizeInput, validateFileUpload, checkRateLimit } from "~/utils/security";

// Enhanced Security Schema for Mission Creation
const missionSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters")
    .transform(sanitizeInput),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters")
    .transform(sanitizeInput),
  paymentType: z.enum(["Volunteer", "Paid", "Sponsor"]),
  urgency: z.enum(["Urgent", "Soon", "Flexible"]),
  amount: z.number()
    .min(0, "Amount cannot be negative")
    .max(10000, "Amount cannot exceed $10,000")
    .optional(),
});

type MissionFormData = z.infer<typeof missionSchema>;

export default function AddMission() {
  const { createMission, selectedLocation, clearLocation } = useAppStore();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageId, setImageId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Clear location when component unmounts or when user leaves
  useEffect(() => {
    return () => {
      // Don't clear location on unmount to preserve it for the user
    };
  }, []);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<MissionFormData>({
    resolver: zodResolver(missionSchema),
    defaultValues: {
      paymentType: "Volunteer",
      urgency: "Urgent",
    },
  });

  const [currentStep, setCurrentStep] = useState(1);

  // Watch form values to calculate progress
  const watchedValues = watch();
  const completedFields = Object.values(watchedValues).filter(value => 
    value && value.toString().trim() !== ""
  ).length;
  // Include location and image in progress calculation
  const totalFields = 6; // title, description, paymentType, urgency, location, image
  let actualCompleted = completedFields;
  if (selectedLocation) actualCompleted++;
  if (imageUri) actualCompleted++;
  const progressPercentage = Math.round((actualCompleted / totalFields) * 100);

  const paymentTypeIcons: { [key: string]: any } = {
    Volunteer: "heart",
    Paid: "cash",
    Sponsor: "trophy",
  };

  const urgencyColors: { [key: string]: string } = {
    Urgent: "#ff4757",
    Soon: "#ffa726",
    Flexible: "#4a8a28",
  };

  const pickImage = async () => {
    setUploadingImage(true);
    try {
      const result = await selectAndUploadImage('gallery', { 
        quality: 0.8,
        maxWidth: 1920,
        maxHeight: 1080
      });

      if (result.success && result.url && result.id) {
        setImageUri(result.url);
        setImageId(result.id);
        Alert.alert('Success', 'Image uploaded successfully!');
      } else {
        Alert.alert('Upload Failed', result.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      Alert.alert('Error', 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setImageUri(null);
    setImageId(null);
  };

  const navigateToLocationPicker = () => {
    router.push('/location-picker');
  };

  const onSubmit = async (data: MissionFormData) => {
    // Validate required fields that aren't in the form schema
    if (!selectedLocation) {
      Alert.alert('Missing Location', 'Please select a location on the map');
      return;
    }

    try {
      await createMission({
        userId: '', // Will be set by the store from current user
        type: 'service', // Default type, could make this a form field
        title: data.title,
        description: data.description,
        location: selectedLocation.address || 'Location not specified', // Use selected location string
        coordinates: { latitude: selectedLocation.latitude, longitude: selectedLocation.longitude }, // Use selected coordinates
        paymentType: data.paymentType,
        urgency: data.urgency,
        image: imageUri || undefined, // Use uploaded image URL
        amount: data.amount || 0,
        skills: [], // Could add skills selection later
        // Optional fields that are set by the createMission function
        creatorId: '',
        isBookmarked: false
      });
      console.log("Mission created successfully");
      Alert.alert('Success', 'Mission created successfully!', [
        { text: 'OK', onPress: () => router.push("/(tabs)") }
      ]);
    } catch (error) {
      console.error("Failed to create mission:", error);
      Alert.alert('Error', 'Failed to create mission. Please try again.');
    }
  };

  return (
    <YStack f={1} p={20} bg="#ffffffff">
      <HeaderC
        icon="arrow-back"
        presshandler={() => router.back()}
        name="Create Mission"
      />

      {/* Progress Header */}
      <Card bg="white"  mb={20} mx={20} mt={10} br={16} shadowColor="#000" shadowOpacity={0.05} shadowRadius={10}>
        <YStack gap={15}>
          <XStack jc="space-between" ai="center">
            <Text fontSize={18} fontWeight="800" color="#333">Mission Progress</Text>
            <Text fontSize={14} fontWeight="600" color="#4a8a28">{progressPercentage}% Complete</Text>
          </XStack>
          <Progress value={progressPercentage} bg="#f0f0f0" br={10}>
            <Progress.Indicator bg="#4a8a28" br={10} />
          </Progress>
          <Text fontSize={12} color="#666">Fill out all fields to create your mission</Text>
        </YStack>
      </Card>

      <ScrollView f={1}  showsVerticalScrollIndicator={false}>
        <YStack gap={20} pb={30}>
          {/* Image Upload Section */}
          <Card bg="white" p={20} br={16} shadowColor="#000" shadowOpacity={0.05} shadowRadius={10}>
            <YStack gap={15}>
              <XStack ai="center" gap={10}>
                <Circle size={35} bg="rgba(74, 138, 40, 0.1)" ai="center" jc="center">
                  <Ionicons name="image" size={18} color="#4a8a28" />
                </Circle>
                <Text fontSize={18} fontWeight="700" color="#333">Mission Image</Text>
              </XStack>
              
              {imageUri ? (
                <YStack gap={15}>
                  <Image
                    source={{ uri: imageUri }}
                    width="100%"
                    height={200}
                    borderRadius={12}
                    resizeMode="cover"
                  />
                  <XStack gap={12}>
                    <Button
                      flex={1}
                      bg="white"
                      borderColor="#4a8a28"
                      borderWidth={2}
                      onPress={pickImage}
                      br={12}
                      h={45}
                    >
                      <XStack ai="center" gap={8}>
                        <Ionicons name="refresh" size={18} color="#4a8a28" />
                        <Text color="#4a8a28" fontWeight="600">Change</Text>
                      </XStack>
                    </Button>
                    <Button
                      flex={1}
                      bg="#fff5f5"
                      borderColor="#ff4757"
                      borderWidth={2}
                      onPress={removeImage}
                      br={12}
                      h={45}
                    >
                      <XStack ai="center" gap={8}>
                        <Ionicons name="trash" size={18} color="#ff4757" />
                        <Text color="#ff4757" fontWeight="600">Remove</Text>
                      </XStack>
                    </Button>
                  </XStack>
                </YStack>
              ) : (
                <Button
                  bg="rgba(74, 138, 40, 0.05)"
                  borderColor="#4a8a28"
                  borderWidth={2}
                  borderStyle="dashed"
                  h={180}
                  br={12}
                  jc="center"
                  ai="center"
                  onPress={pickImage}
                >
                  <YStack ai="center" gap={10}>
                    <Circle size={60} bg="rgba(74, 138, 40, 0.1)" ai="center" jc="center">
                      <Ionicons name="cloud-upload" size={28} color="#4a8a28" />
                    </Circle>
                    <Text fontSize={16} fontWeight="600" color="#4a8a28">Upload Image</Text>
                    <Text fontSize={12} color="#666">Tap to select from gallery</Text>
                  </YStack>
                </Button>
              )}
            </YStack>
          </Card>

          {/* Basic Information */}
          <Card bg="white" p={20} br={16} shadowColor="#000" shadowOpacity={0.05} shadowRadius={10}>
            <YStack gap={20}>
              <XStack ai="center" gap={10}>
                <Circle size={35} bg="rgba(74, 138, 40, 0.1)" ai="center" jc="center">
                  <Ionicons name="information-circle" size={18} color="#4a8a28" />
                </Circle>
                <Text fontSize={18} fontWeight="700" color="#333">Basic Information</Text>
              </XStack>

              {/* Title */}
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, value } }) => (
                  <YStack gap={8}>
                    <Text fontSize={14} fontWeight="600" color="#555">Mission Title *</Text>
                    <Input
                      placeholder="e.g., Help elderly with grocery shopping"
                      value={value}
                      onChangeText={onChange}
                      borderColor={errors.title ? "#ff4757" : "#e5e5e5"}
                      focusStyle={{ borderColor: "#4a8a28" }}
                      h={50}
                      px={15}
                      br={12}
                      fontSize={16}
                    />
                    {errors.title && (
                      <XStack ai="center" gap={5}>
                        <Ionicons name="warning" size={16} color="#ff4757" />
                        <Text color="#ff4757" fontSize={12}>{errors.title.message}</Text>
                      </XStack>
                    )}
                  </YStack>
                )}
              />

              {/* Description */}
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value } }) => (
                  <YStack gap={8}>
                    <Text fontSize={14} fontWeight="600" color="#555">Description *</Text>
                    <TextArea
                      placeholder="Provide detailed information about the mission, what help is needed, and any special requirements..."
                      numberOfLines={4}
                      value={value}
                      onChangeText={onChange}
                      borderColor={errors.description ? "#ff4757" : "#e5e5e5"}
                      focusStyle={{ borderColor: "#4a8a28" }}
                      p={15}
                      br={12}
                      fontSize={16}
                      minHeight={120}
                    />
                    {errors.description && (
                      <XStack ai="center" gap={5}>
                        <Ionicons name="warning" size={16} color="#ff4757" />
                        <Text color="#ff4757" fontSize={12}>{errors.description.message}</Text>
                      </XStack>
                    )}
                  </YStack>
                )}
              />

              {/* Location */}
              <YStack gap={8}>
                <Text fontSize={14} fontWeight="600" color="#555">Location *</Text>
                <XStack gap={10} ai="center">
                  <Input
                    placeholder="Select location from map"
                    value={selectedLocation?.address || ''}
                    editable={false}
                    borderColor={!selectedLocation ? "#ff4757" : "#e5e5e5"}
                    h={50}
                    px={15}
                    br={12}
                    fontSize={16}
                    f={1}
                    bg="#f8f9fa"
                  />
                  <Button
                    size="$4"
                    bg="$blue10"
                    br={12}
                    onPress={navigateToLocationPicker}
                  >
                    <Ionicons name="map" size={20} color="white" />
                  </Button>
                </XStack>
                {selectedLocation && (
                  <Text fontSize={12} color="$gray8">
                    📍 Coordinates: {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
                  </Text>
                )}
                {!selectedLocation && (
                  <XStack ai="center" gap={5}>
                    <Ionicons name="warning" size={16} color="#ff4757" />
                    <Text color="#ff4757" fontSize={12}>Please select a location</Text>
                  </XStack>
                )}
              </YStack>
            </YStack>
          </Card>

          {/* Mission Details */}
          <Card bg="white" p={20} br={16} shadowColor="#000" shadowOpacity={0.05} shadowRadius={10}>
            <YStack gap={20}>
              <XStack ai="center" gap={10}>
                <Circle size={35} bg="rgba(74, 138, 40, 0.1)" ai="center" jc="center">
                  <Ionicons name="settings" size={18} color="#4a8a28" />
                </Circle>
                <Text fontSize={18} fontWeight="700" color="#333">Mission Details</Text>
              </XStack>

              {/* Payment Type */}
              <Controller
                control={control}
                name="paymentType"
                render={({ field: { onChange, value } }) => (
                  <YStack gap={12}>
                    <Text fontSize={14} fontWeight="600" color="#555">Payment Type</Text>
                    <XStack gap={12}>
                      {["Volunteer", "Paid", "Sponsor"].map((type) => (
                        <Button
                          key={type}
                          flex={1}
                          bg={value === type ? "#4a8a28" : "white"}
                          borderColor={value === type ? "#4a8a28" : "#e5e5e5"}
                          borderWidth={2}
                          onPress={() => onChange(type)}
                          br={12}
                          h={60}
                        >
                          <YStack ai="center" gap={5}>
                            <Ionicons 
                              name={paymentTypeIcons[type]} 
                              size={20} 
                              color={value === type ? "white" : "#666"} 
                            />
                            <Text 
                              fontSize={12} 
                              fontWeight="600"
                              color={value === type ? "white" : "#666"}
                            >
                              {type}
                            </Text>
                          </YStack>
                        </Button>
                      ))}
                    </XStack>
                  </YStack>
                )}
              />

              {/* Urgency */}
              <Controller
                control={control}
                name="urgency"
                render={({ field: { onChange, value } }) => (
                  <YStack gap={12}>
                    <Text fontSize={14} fontWeight="600" color="#555">Urgency Level</Text>
                    <XStack gap={12}>
                      {["Urgent", "Soon", "Flexible"].map((level) => (
                        <Button
                          key={level}
                          flex={1}
                          bg={value === level ? urgencyColors[level] : "white"}
                          borderColor={value === level ? urgencyColors[level] : "#e5e5e5"}
                          borderWidth={2}
                          onPress={() => onChange(level)}
                          br={12}
                          h={50}
                        >
                          <Text 
                            fontSize={14} 
                            fontWeight="600"
                            color={value === level ? "white" : urgencyColors[level]}
                          >
                            {level}
                          </Text>
                        </Button>
                      ))}
                    </XStack>
                  </YStack>
                )}
              />
            </YStack>
          </Card>

          {/* Submit Button */}
          <LinearGradient
            colors={['#4a8a28', '#6ba83a']}
            style={{ borderRadius: 16 }}
          >
            <Button
              bg="transparent"
              h={60}
              br={16}
              onPress={handleSubmit(onSubmit)}
              pressStyle={{ opacity: 0.8 }}
            >
              <XStack ai="center" gap={12}>
                <Ionicons name="rocket" size={22} color="white" />
                <Text color="white" fontSize={18} fontWeight="700">
                  Create Mission
                </Text>
              </XStack>
            </Button>
          </LinearGradient>

          {/* Helper Text */}
          <Card bg="#f8f9fa" p={15} br={12}>
            <XStack ai="center" gap={10}>
              <Circle size={30} bg="rgba(74, 138, 40, 0.1)" ai="center" jc="center">
                <Ionicons name="bulb" size={16} color="#4a8a28" />
              </Circle>
              <Text fontSize={12} color="#666" flex={1}>
                💡 <Text fontWeight="600">Tip:</Text> Detailed descriptions and clear images help attract more volunteers to your mission.
              </Text>
            </XStack>
          </Card>
        </YStack>
      </ScrollView>
    </YStack>
  );
}