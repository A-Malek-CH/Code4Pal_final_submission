// OptimizedMissionDetails.tsx - Faster loading with single query and caching
import React, { useState, useEffect, useMemo } from 'react';
import { YStack, XStack, Text, ScrollView, Button, Spinner } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Alert } from 'react-native';
import { database } from "~/database";
import { Q } from '@nozbe/watermelondb';

// Import components
import MissionHeader from '~/assets/ui/components/missiondetails/MissionHeader';
import MissionProfileSection from '~/assets/ui/components/missiondetails/MissionProfileSection';
import LocationInfoSection from '~/assets/ui/components/missiondetails/LocationInfoSection';
import PaymentInfoSection from '~/assets/ui/components/missiondetails/PaymentInfoSection';
import AboutSection from '~/assets/ui/components/missiondetails/AboutSection';
import SkillsSection from '~/assets/ui/components/missiondetails/SkillsSection';
import MiniMapSection from '~/assets/ui/components/missiondetails/MiniMapSection';

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

export default function OptimizedMissionDetails() {
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
        if (isGlobalMission) {
            // Optimized single query for global missions
            const globalMission = await database.get('global_missions')
                .query(Q.where('id', missionId))
                .fetch();

            if (globalMission.length > 0) {
                const mission = globalMission[0] as any;
                return {
                    id: mission.id,
                    title: mission.title,
                    description: mission.description,
                    location: mission.location,
                    coordinates: mission.coordinates ? JSON.parse(mission.coordinates) : undefined,
                    paymentType: mission.paymentType || mission.payment_type,
                    amount: mission.amount,
                    urgency: mission.urgency,
                    status: mission.status,
                    skills: mission.skills ? JSON.parse(mission.skills) : [],
                    imageUri: mission.imageUri || mission.image_uri,
                    bgImage: mission.bgImage || mission.bg_image,
                    createdAt: new Date(mission.createdAt || mission.created_at),
                    userId: mission.userId || mission.user_id,
                    userName: mission.userName || mission.user_name || 'Anonymous User',
                    userAvatar: mission.userAvatar || mission.user_avatar,
                    userPhone: "Contact via app",
                    distance: mission.distanceKm ? `${mission.distanceKm.toFixed(1)}km away` : undefined,
                    timeAgo: formatTimeAgo(new Date(mission.createdAt || mission.created_at)),
                    isGlobalMission: true
                };
            }
        } else {
            // Optimized query for user's own missions using joins/relations
            const myMission = await database.get('my_missions')
                .query(Q.where('id', missionId))
                .fetch();

            if (myMission.length > 0) {
                const mission = myMission[0] as any;
                
                // Get user data with a separate optimized query
                const userQuery = database.get('users')
                    .query(Q.where('id', mission.userId || mission.user_id))
                    .fetch();

                const [user] = await userQuery;
                
                return {
                    id: mission.id,
                    title: mission.title,
                    description: mission.description,
                    location: mission.location,
                    coordinates: mission.coordinates ? JSON.parse(mission.coordinates) : undefined,
                    paymentType: mission.paymentType || mission.payment_type,
                    amount: mission.amount,
                    urgency: mission.urgency,
                    status: mission.status,
                    skills: mission.skills ? JSON.parse(mission.skills) : [],
                    imageUri: mission.imageUri || mission.image_uri,
                    bgImage: mission.bgImage || mission.bg_image,
                    createdAt: new Date(mission.createdAt || mission.created_at),
                    userId: mission.userId || mission.user_id,
                    userName: user?.name || 'Unknown User',
                    userAvatar: user?.avatar,
                    userPhone: user?.phone,
                    timeAgo: formatTimeAgo(new Date(mission.createdAt || mission.created_at)),
                    isGlobalMission: false
                };
            }
        }
        return null;
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
            // TODO: Integrate with Checkout.com
            Alert.alert(
                'Donate to Mission',
                `Would you like to donate to "${mission.title}"?\n\nSuggested amount: $${mission.amount || 50}`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                        text: 'Donate', 
                        onPress: () => {
                            // For now, show placeholder
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
                        // TODO: Implement join mission logic
                        Alert.alert('Success', 'Your request to join this mission has been sent!');
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <YStack f={1} ai="center" jc="center" bg="#f8f9fa">
                <Spinner size="large" color="#4a8a28" />
                <Text mt={16} fontSize={16} color="#666">Loading mission details...</Text>
            </YStack>
        );
    }

    if (error || !mission) {
        return (
            <YStack f={1} ai="center" jc="center" bg="#f8f9fa" p={20}>
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
        );
    }

    return (
        <ScrollView f={1} bg="#f8f9fa" showsVerticalScrollIndicator={false}>
            <MissionHeader 
                title={mission.title}
                onBack={() => router.back()}
                onShare={() => Alert.alert('Share', 'Share functionality coming soon!')}
            />

            <MissionProfileSection
                userName={mission.userName}
                userAvatar={mission.userAvatar}
                timeAgo={mission.timeAgo}
                distance={mission.distance}
                userPhone={mission.userPhone}
                isGlobalMission={mission.isGlobalMission}
            />

            <LocationInfoSection location={mission.location} />

            <PaymentInfoSection 
                paymentType={mission.paymentType}
                amount={mission.amount}
                urgency={mission.urgency}
                status={mission.status}
            />

            <AboutSection description={mission.description} />

            {mission.skills.length > 0 && (
                <SkillsSection skills={mission.skills} />
            )}

            {mission.coordinates && (
                <MiniMapSection 
                    coordinates={mission.coordinates}
                    title={mission.title}
                    location={mission.location}
                />
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
    );
}