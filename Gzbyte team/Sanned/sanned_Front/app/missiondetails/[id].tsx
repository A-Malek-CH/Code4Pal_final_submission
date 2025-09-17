// Dynamic Mission Details with Database Integration
import React, { useState, useEffect } from 'react';
import { YStack, XStack, Text, ScrollView, Stack, Button, Spinner } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Alert } from "react-native";

// Database imports
import database from '~/database';
import { MyMission } from '~/database/models';
import { User } from '~/database/models';

// Import UI components
import MissionHeader from '~/assets/ui/components/missiondetails/MissionHeader';
import MissionProfileSection from '~/assets/ui/components/missiondetails/MissionProfileSection';
import LocationInfoSection from '~/assets/ui/components/missiondetails/LocationInfoSection';
import PaymentInfoSection from '~/assets/ui/components/missiondetails/PaymentInfoSection';
import AboutSection from '~/assets/ui/components/missiondetails/AboutSection';
import SkillsSection from '~/assets/ui/components/missiondetails/SkillsSection';
import MiniMapSection from '~/assets/ui/components/missiondetails/MiniMapSection';
import { createMiniMapHTML } from '~/assets/ui/components/missiondetails/missionDetailsMapUtils';

interface MissionData {
  id: string;
  bgimage: any;
  profile: any;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  location: string;
  name: string;
  username: string;
  description: string;
  paymentType: string;
  amount?: number;
  urgency: string;
  distance: string;
  phone: string;
  skills: string[];
  date: string;
  time: string;
}

export default function DynamicMissionDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [mission, setMission] = useState<MissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMissionData();
  }, [id]);

  const loadMissionData = async () => {
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

      // Parse coordinates and skills
      const coordinates = missionRecord.coordinatesObject || { latitude: 31.3547, longitude: 34.3088 };
      const skills = missionRecord.skillsArray || [];

      // Get background image based on bgImage field
      const getBgImage = (bgImage?: string) => {
        if (!bgImage) return require('~/assets/images/tent.jpeg');
        const key = bgImage.toLowerCase();
        if (key === 'tent') return require('~/assets/images/tent.jpeg');
        if (key === 'scarf') return require('~/assets/images/scarf.png');
        if (key === 'stamp') return require('~/assets/images/stamp.png');
        // Fallback
        return require('~/assets/images/tent.jpeg');
      };

      // Format mission data for UI
      const formattedMission: MissionData = {
        id: missionRecord.id,
  bgimage: getBgImage(missionRecord.bgImage),
        profile: require('~/assets/images/pfp.jpeg'), // Default profile image
        coordinates,
        location: missionRecord.location || 'Location not specified',
        name: user?.name || 'Anonymous User',
        username: user?.email?.split('@')[0] || 'user',
        description: missionRecord.description,
        paymentType: missionRecord.paymentType,
        amount: missionRecord.amount,
        urgency: missionRecord.urgency,
        distance: '6.1', // TODO: Calculate actual distance
        phone: '+970 59 123 4567', // TODO: Get from user profile
        skills,
        date: missionRecord.createdAt.toLocaleDateString() === new Date().toLocaleDateString() ? 'Today' : missionRecord.createdAt.toLocaleDateString(),
        time: missionRecord.createdAt.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        })
      };

      setMission(formattedMission);
      setLoading(false);
    } catch (err) {
      console.error('Error loading mission data:', err);
      setError('Failed to load mission data');
      setLoading(false);
    }
  };

  const handleMapMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'openFullMap' && mission) {
        router.push({
          pathname: "/map",
          params: {
            latitude: mission.coordinates.latitude,
            longitude: mission.coordinates.longitude,
            location: mission.location
          }
        });
      }
    } catch (error) {
      console.log('Error parsing map message:', error);
    }
  };

  const handleViewFullMap = () => {
    if (mission) {
      router.push({
        pathname: "/map",
        params: {
          latitude: mission.coordinates.latitude,
          longitude: mission.coordinates.longitude,
          location: mission.location
        }
      });
    }
  };

  const handleStartMission = async () => {
    try {
      if (!mission) return;

      // Update mission status to 'matched'
      await database.write(async () => {
        const missionRecord = await database.get<MyMission>('my_missions').find(mission.id);
        if (missionRecord) {
          await missionRecord.update(mission => {
            mission.status = 'matched';
            mission.updatedAt = new Date();
          });
        }
      });

      Alert.alert(
        'Mission Started!',
        'You have successfully accepted this mission. The requester will be notified.',
        [
          {
            text: 'View Status',
            onPress: () => router.push(`/missionstatus/${mission.id}` as any)
          },
          {
            text: 'OK',
            style: 'default'
          }
        ]
      );
    } catch (error) {
      console.error('Error starting mission:', error);
      Alert.alert('Error', 'Failed to start mission. Please try again.');
    }
  };

  if (loading) {
    return (
      <YStack f={1} ai="center" jc="center" bg="$background">
        <Spinner size="large" color="$blue10" />
        <Text mt={16} fontSize={16} color="$gray10">Loading mission details...</Text>
      </YStack>
    );
  }

  if (error || !mission) {
    return (
      <YStack f={1} ai="center" jc="center" bg="$background" px={24}>
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text mt={16} fontSize={18} fontWeight="600" color="$red10" textAlign="center">
          {error || 'Mission not found'}
        </Text>
        <Button 
          mt={20}
          size="$4"
          bg="$blue10"
          br={20}
          onPress={() => router.back()}
        >
          <Text fontSize={14} fontWeight="600" color="white">
            Go Back
          </Text>
        </Button>
      </YStack>
    );
  }

  return (
    <ScrollView f={1} bg="$background">
      <MissionHeader 
        bgimage={mission.bgimage} 
        onBackPress={() => router.back()}
      />

      <YStack 
        px={24} 
        py={16} 
        gap={30} 
        borderTopLeftRadius={30} 
        borderTopRightRadius={30} 
        mt={-20} 
        bg="white" 
        shadowColor="$shadowColor" 
        shadowOffset={{ width: 0, height: -2 }} 
        shadowOpacity={0.1} 
        shadowRadius={4}
      >
        <MissionProfileSection 
          profile={mission.profile}
          name={mission.name}
          username={mission.username}
        />

        <LocationInfoSection 
          location={mission.location}
          distance={mission.distance}
        />

        <PaymentInfoSection 
          paymentType={mission.paymentType}
          amount={mission.amount}
        />

        <AboutSection 
          description={mission.description}
          urgency={mission.urgency}
        />

        {/* Time info */}
        <XStack ai="center" jc={'space-between'} gap={16}>
          <XStack ai="center" gap={4}>
            <Ionicons name="calendar-outline" size={14} color="$gray10" />
            <Text fontSize={12} color="$gray10">{mission.date}</Text>
          </XStack>
          <XStack ai="center" gap={4}>
            <Ionicons name="time-outline" size={14} color="$gray10" />
            <Text fontSize={12} color="$gray10">{mission.time}</Text>
          </XStack>
        </XStack>

        {/* Contact */}
        <XStack ai="center" gap={8}>
          <Ionicons name="call-outline" size={24} color="$blue10" />
          <Text fontSize={16} fontWeight="700">Contact</Text>
          <Text fontSize={14} fontWeight="700" color="$gray10" ml="auto">{mission.phone}</Text>
        </XStack>

        <SkillsSection skills={mission.skills} />

        <MiniMapSection 
          coordinates={mission.coordinates}
          location={mission.location}
          createMiniMapHTML={() => createMiniMapHTML(mission.coordinates, mission.location)}
          onMapMessage={handleMapMessage}
          onViewFullMap={handleViewFullMap}
        />

        <Stack pos={"sticky"}>
          <Button 
            mt={12}
            size="$5"
            bg="#528241" 
            br={25}
            pressStyle={{ opacity: 0.9 }}
            onPress={handleStartMission}
          >
            <Text fontSize={14} fontWeight="600" color="white">
              Start Mission
            </Text>
          </Button>
        </Stack>
      </YStack>
    </ScrollView>
  );
}