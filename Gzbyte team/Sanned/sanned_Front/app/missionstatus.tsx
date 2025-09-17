
import React, { useState, useEffect, useMemo } from 'react';
import { YStack, Text, Spinner, Button } from 'tamagui';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Ionicons } from "@expo/vector-icons";
import { Alert } from 'react-native';
import { database } from "~/database";
import { Q } from '@nozbe/watermelondb';
import GlobalMission from "~/database/models/GlobalMission";
import MyMission from "~/database/models/MyMission";
import User from "~/database/models/User";

// Import broken-down components
import MissionStatusHeader from '~/assets/ui/components/missionstatus/MissionStatusHeader';
import MissionActionButtons from '~/assets/ui/components/missionstatus/MissionActionButtons';
import MissionCompletionToast from '~/assets/ui/components/missionstatus/MissionCompletionToast';
import { CustomCard } from '~/assets/ui/components/CardBig';
import { useAppStore } from '~/store/index';

interface MissionData {
    id: string;
    title: string;
    description: string;
    location: string;
    status: string;
    urgency: string;
    paymentType: string;
    amount?: number;
    imageUri?: string;
    bgImage?: string;
    createdAt: Date;
    
    // User information
    userId: string;
    userName: string;
    userAvatar?: string;
    
    // Mission type
    isGlobalMission: boolean;
}

// In-memory cache for mission status
interface CacheEntry {
    data: MissionData;
    timestamp: number;
}

const missionStatusCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export default function MissionStatus() {
    const params = useLocalSearchParams();
    const { updateMissionStatus } = useAppStore();
    const [mission, setMission] = useState<MissionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [completed, setCompleted] = useState(false);

    const missionId = params.id as string;
    const isGlobalMission = params.type === 'global';

    // Memoized cache key
    const cacheKey = useMemo(() => 
        `${missionId}_${isGlobalMission ? 'global' : 'my'}_status`, 
        [missionId, isGlobalMission]
    );

    // Animation values
    const opacity = useSharedValue(1);
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
    }));

    useEffect(() => {
        if (missionId) {
            fetchMissionData();
        }
    }, [missionId, cacheKey]);

    const fetchMissionData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Check cache first
            const cachedEntry = missionStatusCache.get(cacheKey);
            const now = Date.now();
            
            if (cachedEntry && (now - cachedEntry.timestamp) < CACHE_TTL) {
                console.log('Mission status cache hit for:', cacheKey);
                setMission(cachedEntry.data);
                setLoading(false);
                return;
            }

            console.log('Mission status cache miss for:', cacheKey);

            // Single optimized database query
            const missionData = await fetchMissionFromDatabase();

            if (missionData) {
                // Cache the result
                missionStatusCache.set(cacheKey, {
                    data: missionData,
                    timestamp: now
                });
                setMission(missionData);
            } else {
                setError('Mission not found');
            }
        } catch (err) {
            console.error('Error fetching mission status data:', err);
            setError('Failed to load mission data');
        } finally {
            setLoading(false);
        }
    };

    const fetchMissionFromDatabase = async (): Promise<MissionData | null> => {
        if (isGlobalMission) {
            // Single query for global mission
            const globalMissionsCollection = database.get('global_missions');
            const results = await globalMissionsCollection
                .query(Q.where('id', missionId))
                .fetch();
            
            if (results.length > 0) {
                const missionRecord = results[0] as GlobalMission;
                return {
                    id: missionRecord.id,
                    title: missionRecord.title,
                    description: missionRecord.description,
                    location: missionRecord.location || 'Location not specified',
                    status: missionRecord.status,
                    urgency: missionRecord.urgency,
                    paymentType: missionRecord.paymentType,
                    amount: missionRecord.amount,
                    imageUri: missionRecord.imageUri,
                    bgImage: missionRecord.bgImage,
                    createdAt: missionRecord.createdAt,
                    userId: missionRecord.userId,
                    userName: missionRecord.userName,
                    userAvatar: missionRecord.userAvatar,
                    isGlobalMission: true
                };
            }
        } else {
            // Optimized queries for my missions
            const myMissionsCollection = database.get('my_missions');
            const usersCollection = database.get('users');

            // Use Promise.all for concurrent queries
            const [missionResults, userResults] = await Promise.all([
                myMissionsCollection.query(Q.where('id', missionId)).fetch(),
                usersCollection.query().fetch() // Get all users for quick lookup
            ]);

            if (missionResults.length > 0) {
                const missionRecord = missionResults[0] as MyMission;
                
                // Quick user lookup from preloaded users
                const userRecord = userResults.find(u => u.id === missionRecord.userId) as User | undefined;

                return {
                    id: missionRecord.id,
                    title: missionRecord.title,
                    description: missionRecord.description,
                    location: missionRecord.location || 'Location not specified',
                    status: missionRecord.status,
                    urgency: missionRecord.urgency,
                    paymentType: missionRecord.paymentType,
                    amount: missionRecord.amount,
                    imageUri: missionRecord.imageUri,
                    bgImage: missionRecord.bgImage,
                    createdAt: missionRecord.createdAt,
                    userId: missionRecord.userId,
                    userName: userRecord?.name || 'Unknown User',
                    userAvatar: userRecord?.avatar,
                    isGlobalMission: false
                };
            }
        }

        return null;
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
        if (!mission) return;
        if (!selectedImage) {
            Alert.alert('Upload Required', 'Please upload a completion image first.');
            return;
        }
        
        try {
            // Update mission status in database
            await updateMissionStatus(mission.id, 'completed');
            
            setCompleted(true);
            opacity.value = 0;
            scale.value = 0.8;

            // animate in
            opacity.value = withTiming(1, { duration: 400 });
            scale.value = withTiming(1, { duration: 400 });
            
            // Update local mission status
            const updatedMission = { ...mission, status: 'completed' };
            setMission(updatedMission);
            
            // Update cache with new status
            const now = Date.now();
            missionStatusCache.set(cacheKey, {
                data: updatedMission,
                timestamp: now
            });
            
            console.log('Mission completed successfully');
        } catch (error) {
            console.error('Failed to complete mission:', error);
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
            <YStack f={1} ai="center" jc="center" bg="white" px={32}>
                <Ionicons name="alert-circle-outline" size={48} color="#ff6b6b" />
                <Text mt={16} fontSize={18} fontWeight="600" ta="center">
                    {error || 'Mission not found'}
                </Text>
                <Text mt={8} fontSize={14} color="$gray10" ta="center">
                    This mission might have been removed or you don't have access to it.
                </Text>
                <Button 
                    mt={24} 
                    onPress={() => router.back()}
                    bg="$blue10"
                    color="white"
                >
                    Go Back
                </Button>
            </YStack>
        );
    }

    // Default fallback images
    const defaultBgImage = require('~/assets/images/tent.jpeg');
    const defaultProfileImage = require('~/assets/images/pfp.jpeg');

    return (
        <YStack f={1} bg="white" pl={20} pr={20} pb={20} ai="center">
            <MissionStatusHeader onBackPress={() => router.back()} />

            {/* Mission Card */}
            <YStack h="58%" w="100%" mt={30} ai="center">
                <CustomCard
                    description={mission.description}
                    bgimage={mission.bgImage || mission.imageUri || defaultBgImage}
                    profile={mission.userAvatar || defaultProfileImage}
                    name={mission.userName}
                    top={0}
                    id={mission.id}
                    urgency={mission.urgency}
                    distance={1.2} // You can calculate actual distance here
                    paymentType={mission.paymentType}
                />
            </YStack>

            {/* Mission Status Info */}
            <YStack ai="center" gap={8} mt={16}>
                <Text fontSize={18} fontWeight="600" color="$gray12">
                    {mission.title}
                </Text>
                <Text fontSize={14} color="$gray10" ta="center">
                    Status: {mission.status.toUpperCase()}
                </Text>
                <Text fontSize={14} color="$gray10" ta="center">
                    {mission.urgency} • {mission.paymentType}
                    {mission.amount && ` • $${mission.amount}`}
                </Text>
            </YStack>

            {/* Action Buttons or Completion Toast */}
            <YStack mt={20} ai="center" w="100%" gap={30}>
                {!completed && mission.status !== 'completed' ? (
                    <MissionActionButtons
                        onUploadImage={pickImage}
                        onMissionComplete={handleMissionComplete}
                        completed={completed}
                    />
                ) : (
                    <MissionCompletionToast />
                )}
            </YStack>
        </YStack>
    );
}