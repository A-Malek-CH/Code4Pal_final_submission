// OptimizedMissionDetails.tsx - Faster loading with single query and caching
import React, { useState, useEffect, useMemo } from 'react';
import { YStack, XStack, Text, ScrollView, Button, Spinner } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Alert, TouchableOpacity } from 'react-native';
import { database } from "~/database";
import { Q } from '@nozbe/watermelondb';
import { SafeAreaView } from 'react-native-safe-area-context';
import GlobalMission from "~/database/models/GlobalMission";
import MyMission from "~/database/models/MyMission";
import User from "~/database/models/User";

interface MissionData {
    id: string;
    title: string;
    description: string;
    location: string;
    coordinates?: { latitude: number; longitude: number };
    paymentType: string;
    amount?: number;
    urgency: string;
    status: string;
    skills: string[];
    imageUri?: string;
    bgImage?: string;
    createdAt: Date;
    
    // User information
    userId: string;
    userName: string;
    userAvatar?: string;
    userPhone?: string;
    
    // Computed fields
    distance?: string;
    timeAgo: string;
    isGlobalMission: boolean;
}

// In-memory cache for frequently accessed missions
const missionCache = new Map<string, { data: MissionData; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export default function MissionDetails() {
    const params = useLocalSearchParams();
    const [mission, setMission] = useState<MissionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const missionId = params.id as string;
    const isGlobalMission = params.type === 'global';

    // Memoized cache key
    const cacheKey = useMemo(() => `${missionId}_${isGlobalMission ? 'global' : 'my'}`, [missionId, isGlobalMission]);

    useEffect(() => {
        if (missionId) {
            fetchMissionDetails();
        }
    }, [missionId, isGlobalMission]);

    const fetchMissionDetails = async () => {
        try {
            // Check cache first
            const cached = missionCache.get(cacheKey);
            if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
                setMission(cached.data);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            const missionData = await fetchMissionFromDatabase();
            
            if (missionData) {
                // Cache the result
                missionCache.set(cacheKey, {
                    data: missionData,
                    timestamp: Date.now()
                });
                setMission(missionData);
            } else {
                setError('Mission not found');
            }
        } catch (err) {
            console.error('Error fetching mission details:', err);
            setError('Failed to load mission details');
        } finally {
            setLoading(false);
        }
    };

    const fetchMissionFromDatabase = async (): Promise<MissionData | null> => {
        try {
            if (isGlobalMission) {
                const globalMissions = await database.get<GlobalMission>('global_missions')
                    .query(Q.where('id', missionId))
                    .fetch();

                if (globalMissions.length > 0) {
                    const mission = globalMissions[0];
                    return createMissionData(mission, true);
                }
            } else {
                const myMissions = await database.get<MyMission>('my_missions')
                    .query(Q.where('id', missionId))
                    .fetch();

                if (myMissions.length > 0) {
                    const mission = myMissions[0];
                    
                    // Get user information
                    const users = await database.get<User>('users')
                        .query(Q.where('id', mission.userId))
                        .fetch();

                    const user = users.length > 0 ? users[0] : undefined;
                    return createMissionData(mission, false, user);
                }
            }
        } catch (error) {
            console.error('Error in fetchMissionFromDatabase:', error);
            throw error;
        }
        return null;
    };

    const createMissionData = (mission: GlobalMission | MyMission, isGlobal: boolean, user?: User): MissionData => {
        try {
            return {
                id: mission.id,
                title: mission.title,
                description: mission.description,
                location: mission.location || 'Location not specified',
                coordinates: mission.coordinatesObject || undefined,
                paymentType: mission.paymentType,
                amount: mission.amount,
                urgency: mission.urgency,
                status: mission.status,
                skills: mission.skillsArray,
                imageUri: mission.imageUri,
                bgImage: mission.bgImage,
                createdAt: mission.createdAt,
                userId: mission.userId,
                userName: isGlobal ? (mission as GlobalMission).userName || 'Anonymous User' : (user?.name || 'Unknown User'),
                userAvatar: isGlobal ? (mission as GlobalMission).userAvatar : user?.avatar,
                userPhone: isGlobal ? "Contact via app" : user?.phone,
                distance: (mission as any).distanceKm ? `${(mission as any).distanceKm.toFixed(1)}km away` : undefined,
                timeAgo: formatTimeAgo(mission.createdAt),
                isGlobalMission: isGlobal
            };
        } catch (error) {
            console.error('Error creating mission data:', error);
            throw error;
        }
    };

    const formatTimeAgo = (date: Date): string => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    const handleDonatePress = () => {
        if (mission?.paymentType === 'Sponsor') {
            Alert.alert(
                'Donate to Mission',
                `Would you like to donate to "${mission.title}"?\n\nSuggested amount: $${mission.amount || 50}`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                        text: 'Donate', 
                        onPress: () => {
                            // TODO: Integrate with Checkout.com
                            Alert.alert(
                                'Coming Soon',
                                'Donation functionality will be integrated with Checkout.com payment processing.'
                            );
                        }
                    }
                ]
            );
        } else {
            Alert.alert('Info', 'This mission is not seeking donations.');
        }
    };

    const handleJoinMission = () => {
        Alert.alert(
            'Join Mission',
            `Do you want to join "${mission?.title}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Join', 
                    onPress: () => {
                        Alert.alert('Success', 'Your request to join this mission has been sent!');
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
                <YStack f={1} ai="center" jc="center">
                    <Spinner size="large" color="#4a8a28" />
                    <Text mt={16} fontSize={16} color="#666">Loading mission details...</Text>
                </YStack>
            </SafeAreaView>
        );
    }

    if (error || !mission) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
                <YStack f={1} ai="center" jc="center" p={20}>
                    <Ionicons name="alert-circle" size={64} color="#dc3545" />
                    <Text fontSize={18} fontWeight="600" color="#dc3545" mt={16} textAlign="center">
                        {error || 'Mission not found'}
                    </Text>
                    <Text fontSize={14} color="#666" mt={8} textAlign="center">
                        The mission you're looking for might have been removed or doesn't exist.
                    </Text>
                    <Button 
                        mt={20} 
                        bg="#4a8a28" 
                        color="white" 
                        onPress={() => router.back()}
                    >
                        Go Back
                    </Button>
                </YStack>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
            <ScrollView f={1} showsVerticalScrollIndicator={false}>
                
                {/* Header */}
                <XStack 
                    bg="white" 
                    h={60} 
                    ai="center" 
                    jc="space-between" 
                    px={20}
                    borderBottomWidth={1}
                    borderBottomColor="#e5e5e5"
                >
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    
                    <Text fontSize={18} fontWeight="600" color="#333" numberOfLines={1}>
                        {mission.title}
                    </Text>
                    
                    <TouchableOpacity onPress={() => Alert.alert('Share', 'Share functionality coming soon!')}>
                        <Ionicons name="share-outline" size={24} color="#333" />
                    </TouchableOpacity>
                </XStack>

                {/* Mission Image */}
                {mission.bgImage && (
                    <YStack h={200} bg="#f0f0f0">
                        {/* Image would go here */}
                    </YStack>
                )}

                {/* Profile Section */}
                <YStack bg="white" p={20} borderBottomWidth={1} borderBottomColor="#f0f0f0">
                    <XStack ai="center" gap={12}>
                        <YStack 
                            w={50} 
                            h={50} 
                            borderRadius={25} 
                            bg="#4a8a28" 
                            ai="center" 
                            jc="center"
                        >
                            <Text color="white" fontSize={18} fontWeight="600">
                                {mission.userName.charAt(0).toUpperCase()}
                            </Text>
                        </YStack>
                        
                        <YStack f={1}>
                            <Text fontSize={16} fontWeight="600" color="#333">
                                {mission.userName}
                            </Text>
                            <XStack ai="center" gap={16}>
                                <Text fontSize={14} color="#666">
                                    {mission.timeAgo}
                                </Text>
                                {mission.distance && (
                                    <Text fontSize={14} color="#666">
                                        {mission.distance}
                                    </Text>
                                )}
                            </XStack>
                        </YStack>
                    </XStack>
                </YStack>

                {/* Location */}
                <YStack bg="white" p={20} borderBottomWidth={1} borderBottomColor="#f0f0f0">
                    <XStack ai="center" gap={12}>
                        <Ionicons name="location" size={20} color="#4a8a28" />
                        <Text fontSize={16} color="#333" f={1}>
                            {mission.location}
                        </Text>
                    </XStack>
                </YStack>

                {/* Payment Info */}
                <YStack bg="white" p={20} borderBottomWidth={1} borderBottomColor="#f0f0f0">
                    <XStack ai="center" jc="space-between" mb={12}>
                        <Text fontSize={16} fontWeight="600" color="#333">
                            Payment Details
                        </Text>
                        <Text 
                            fontSize={12} 
                            color={mission.urgency === 'Urgent' ? '#dc3545' : mission.urgency === 'Soon' ? '#ffc107' : '#28a745'}
                            bg={mission.urgency === 'Urgent' ? '#fff5f5' : mission.urgency === 'Soon' ? '#fffbf0' : '#f8fff9'}
                            px={8} 
                            py={4} 
                            br={12}
                        >
                            {mission.urgency}
                        </Text>
                    </XStack>
                    
                    <XStack ai="center" gap={8}>
                        <Text fontSize={14} color="#666">Type:</Text>
                        <Text fontSize={14} fontWeight="500" color="#333">{mission.paymentType}</Text>
                        {mission.amount && (
                            <>
                                <Text fontSize={14} color="#666">•</Text>
                                <Text fontSize={14} fontWeight="600" color="#4a8a28">
                                    ${mission.amount}
                                </Text>
                            </>
                        )}
                    </XStack>
                </YStack>

                {/* Description */}
                <YStack bg="white" p={20} borderBottomWidth={1} borderBottomColor="#f0f0f0">
                    <Text fontSize={16} fontWeight="600" color="#333" mb={12}>
                        About this Mission
                    </Text>
                    <Text fontSize={15} color="#666" lineHeight={22}>
                        {mission.description}
                    </Text>
                </YStack>

                {/* Skills */}
                {mission.skills.length > 0 && (
                    <YStack bg="white" p={20} borderBottomWidth={1} borderBottomColor="#f0f0f0">
                        <Text fontSize={16} fontWeight="600" color="#333" mb={12}>
                            Required Skills
                        </Text>
                        <XStack gap={8} flexWrap="wrap">
                            {mission.skills.map((skill, index) => (
                                <Text
                                    key={index}
                                    bg="#f0f8ff"
                                    color="#4a8a28"
                                    px={12}
                                    py={6}
                                    br={16}
                                    fontSize={13}
                                    fontWeight="500"
                                >
                                    {skill}
                                </Text>
                            ))}
                        </XStack>
                    </YStack>
                )}

                {/* Action Buttons */}
                <YStack p={20} gap={12}>
                    {mission.paymentType === 'Sponsor' && (
                        <Button
                            bg="#dc3545"
                            color="white"
                            h={50}
                            br={12}
                            fontSize={16}
                            fontWeight="600"
                            onPress={handleDonatePress}
                        >
                            <XStack ai="center" gap={8}>
                                <Ionicons name="heart" size={20} color="white" />
                                <Text color="white" fontSize={16} fontWeight="600">
                                    Donate ${mission.amount || 50}
                                </Text>
                            </XStack>
                        </Button>
                    )}
                    
                    <Button
                        bg="#4a8a28"
                        color="white"
                        h={50}
                        br={12}
                        fontSize={16}
                        fontWeight="600"
                        onPress={handleJoinMission}
                    >
                        Join Mission
                    </Button>
                </YStack>
            </ScrollView>
        </SafeAreaView>
    );
}