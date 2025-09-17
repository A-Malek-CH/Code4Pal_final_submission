// Dynamic Mission Status with Database Integration
import React, { useState, useEffect } from 'react';
import { YStack, Text, Spinner } from 'tamagui';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Alert } from 'react-native';

// Database imports
import database from '~/database';
import { MyMission } from '~/database/models';
import { User } from '~/database/models';

// Import UI components
import MissionStatusHeader from '~/assets/ui/components/missionstatus/MissionStatusHeader';
import MissionActionButtons from '~/assets/ui/components/missionstatus/MissionActionButtons';
import MissionCompletionToast from '~/assets/ui/components/missionstatus/MissionCompletionToast';
import { CustomCard } from '~/assets/ui/components/CardBig';

interface MissionStatusData {
  id: string;
  title: string;
  description: string;
  bgimage: any;
  profile: any;
  name: string;
  status: string;
}

export default function DynamicMissionStatus() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [mission, setMission] = useState<MissionStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  // Animation values
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    loadMissionStatusData();
  }, [id]);

  const loadMissionStatusData = async () => {
    try {
      if (!id) {
        setError('Mission ID not provided');
        setLoading(false);
        return;
      }

      // Fetch mission from database
      const missionRecord = await database.get<MyMission>('my_missions').find(id);
      
      if (!missionRecord) {
        setError('Mission not found');
        setLoading(false);
        return;
      }

      // Fetch user data for the mission
      const user = await database.get<User>('users').find(missionRecord.userId);

      // Get background image based on bgImage field
      const getBgImage = (bgImage: string) => {
        switch (bgImage) {
          case 'tent':
            return require('~/assets/images/tent.jpeg');
          case 'scarf':
            return require('~/assets/images/scarf.png');
          default:
            return require('~/assets/images/tent.jpeg');
        }
      };

      // Format mission data for UI
      const formattedMission: MissionStatusData = {
        id: missionRecord.id,
        title: missionRecord.title,
        description: missionRecord.description,
        bgimage: getBgImage(missionRecord.bgImage || 'tent'),
        profile: require('~/assets/images/pfp.jpeg'), // Default profile image
        name: user?.email?.split('@')[0] || 'user',
        status: missionRecord.status
      };

      setMission(formattedMission);
      setCompleted(missionRecord.status === 'completed');
      setLoading(false);
    } catch (err) {
      console.error('Error loading mission status data:', err);
      setError('Failed to load mission status data');
      setLoading(false);
    }
  };

  // Open image picker
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      console.log('Selected Image:', result.assets[0].uri);
    }
  };

  // Handle mission complete
  const handleMissionComplete = async () => {
    try {
      if (!selectedImage) {
        Alert.alert('Upload Required', 'Please upload a completion image first.');
        return;
      }
      if (!mission) return;

      // Update mission status in database
      await database.write(async () => {
        const missionRecord = await database.get<MyMission>('my_missions').find(mission.id);
        if (missionRecord) {
          await missionRecord.update(missionToUpdate => {
            missionToUpdate.status = 'completed';
            missionToUpdate.updatedAt = new Date();
          });
        }
      });
      
      setCompleted(true);
      opacity.value = 0;
      scale.value = 0.8;

      // animate in
      opacity.value = withTiming(1, { duration: 400 });
      scale.value = withTiming(1, { duration: 400 });
      
      console.log('Mission completed successfully');
      
      Alert.alert('Mission Completed!', 'Great work! The mission has been marked as completed.')
    } catch (error) {
      console.error('Failed to complete mission:', error);
      Alert.alert('Error', 'Failed to complete mission. Please try again.');
    }
  };

  if (loading) {
    return (
      <YStack f={1} ai="center" jc="center" bg="white">
        <Spinner size="large" color="$blue10" />
        <Text mt={16} fontSize={16} color="$gray10">Loading mission status...</Text>
      </YStack>
    );
  }

  if (error || !mission) {
    return (
      <YStack f={1} ai="center" jc="center" bg="white" px={24}>
        <Text mt={16} fontSize={18} fontWeight="600" color="$red10" textAlign="center">
          {error || 'Mission not found'}
        </Text>
      </YStack>
    );
  }

  return (
    <YStack f={1} bg="white" pl={20} pr={20} pb={20} ai="center">
      <MissionStatusHeader onBackPress={() => router.back()} />

      {/* Mission Card */}
      <YStack h="58%" w="100%" mt={30} ai="center">
        <CustomCard
          description={mission.description}
          bgimage={mission.bgimage}
          profile={mission.profile}
          name={mission.name}
          top={0}
          id={mission.id}
        />
      </YStack>

      {/* Action Buttons or Completion Toast */}
      {!completed ? (
        <MissionActionButtons
          onUploadImage={pickImage}
          onMissionComplete={handleMissionComplete}
          completed={completed}
        />
      ) : (
        <YStack mt={20} ai="center" w="100%" gap={30}>
          <MissionActionButtons
            onUploadImage={pickImage}
            onMissionComplete={handleMissionComplete}
            completed={completed}
          />
          <MissionCompletionToast />
        </YStack>
      )}
    </YStack>
  );
}