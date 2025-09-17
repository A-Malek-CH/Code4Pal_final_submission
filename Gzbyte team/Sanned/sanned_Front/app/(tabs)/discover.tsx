import React, { useState, useEffect } from 'react';
import { YStack, Text, Spinner } from 'tamagui';
import { Alert, Linking } from 'react-native';
import { router } from 'expo-router';

// Import broken-down components
import { HeaderB } from '~/assets/ui/components/headerB';
import DiscoverCardsStack from '~/assets/ui/components/discover/DiscoverCardsStack';
import DiscoverActionButtons from '~/assets/ui/components/discover/DiscoverActionButtons.';
import DiscoverFiltersModal from '~/assets/ui/components/discover/DiscoverFiltersModal';
import { useAppStore } from '~/store/index';
import { database } from '~/database';
import Donation from '~/database/models/Donation';

export default function Discover() {
    const { missions, globalMissions, loadMissions, loadGlobalMissions, joinMission, bookmarkMission, user } = useAppStore();
    const [showFilters, setShowFilters] = useState(false);
    const [distance, setDistance] = useState([40]);
    const [paymentType, setPaymentType] = useState('Volunteer');
    const [urgency, setUrgency] = useState('Urgent');
    const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [allMissions, setAllMissions] = useState<any[]>([]);

    // Load missions when component mounts
    useEffect(() => {
        loadMissionsData();
    }, []);

    // Combine missions when they change
    useEffect(() => {
        const combined = [
            ...globalMissions.map(m => ({ ...m, isGlobal: true })),
            ...missions.map(m => ({ ...m, isGlobal: false }))
        ];
        setAllMissions(combined);
        console.log('Combined missions:', combined.length);
    }, [missions, globalMissions]);

    const loadMissionsData = async () => {
        try {
            await Promise.all([
                loadMissions(), // Load user missions
                loadGlobalMissions() // Load global missions
            ]);
            setLoading(false);
        } catch (error) {
            console.error('Failed to load missions:', error);
            setLoading(false);
        }
    };

    const handleDecline = () => {
        // Move to next mission
        if (currentMissionIndex < allMissions.length - 1) {
            setCurrentMissionIndex(prev => prev + 1);
        } else {
            // No more missions
            Alert.alert('No More Missions', 'You\'ve viewed all available missions!');
        }
        console.log('Mission declined');
    };

    const handleAccept = async () => {
        try {
            if (allMissions.length > 0 && currentMissionIndex < allMissions.length) {
                const currentMission = allMissions[currentMissionIndex];
                
                // Regular mission join (accept button)
                await joinMission(currentMission.id);
                
                Alert.alert(
                    'Mission Accepted!',
                    'You have successfully joined this mission. Redirecting to mission details...',
                    [
                        {
                            text: 'View Details',
                            onPress: () => router.push(`/missiondetails/${currentMission.id}?type=${currentMission.isGlobal ? 'global' : 'my'}` as any)
                        },
                        {
                            text: 'Continue Discovering',
                            onPress: handleDecline,
                            style: 'default'
                        }
                    ]
                );
                
                console.log('Successfully joined mission');
            }
        } catch (error) {
            console.error('Failed to join mission:', error);
            Alert.alert('Error', 'Failed to join mission. Please try again.');
        }
    };

    const handleDonate = async () => {
        try {
            if (allMissions.length > 0 && currentMissionIndex < allMissions.length) {
                const currentMission = allMissions[currentMissionIndex];
                
                if (!user) {
                    Alert.alert('Error', 'You must be logged in to make donations.');
                    return;
                }

                const donationAmount = currentMission.amount || 50;
                
                // Create checkout.com URL (you would need to get this from your API)
                const checkoutUrl = `https://pay.checkout.com/payment-link/pk_test_example?amount=${donationAmount * 100}&currency=USD&reference=${currentMission.id}&description=${encodeURIComponent(`Donation to mission: ${currentMission.title}`)}`;
                
                Alert.alert(
                    'Proceed to Payment',
                    `You will be redirected to our secure payment processor to donate $${donationAmount} to "${currentMission.title}".`,
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { 
                            text: 'Continue to Payment', 
                            onPress: async () => {
                                try {
                                    // Check if the URL can be opened
                                    const supported = await Linking.canOpenURL(checkoutUrl);
                                    
                                    if (supported) {
                                        await Linking.openURL(checkoutUrl);
                                        
                                        // Record the donation attempt in the database (pending status)
                                        await database.write(async () => {
                                            const donation = await database.get<Donation>('donations').create((d: any) => {
                                                d.donorId = user.id;
                                                d.missionId = currentMission.id;
                                                d.amount = donationAmount;
                                                d.currency = 'USD';
                                                d.paymentMethod = 'card';
                                                d.status = 'pending'; // Mark as pending until payment confirmation
                                                d.message = `Donation via app to mission: ${currentMission.title}`;
                                                d.isAnonymous = false;
                                                d.isDeleted = false;
                                                d.needsSync = true;
                                                d.createdAt = new Date();
                                                d.updatedAt = new Date();
                                            });
                                            
                                            console.log('Donation attempt recorded:', donation.id);
                                        });
                                        
                                        // Move to next mission after initiating payment
                                        handleDecline();
                                    } else {
                                        Alert.alert('Error', 'Unable to open payment page. Please try again later.');
                                    }
                                } catch (error) {
                                    console.error('Failed to open payment URL:', error);
                                    Alert.alert('Error', 'Unable to process payment. Please try again later.');
                                }
                            }
                        }
                    ]
                );
            }
        } catch (error) {
            console.error('Failed to process donation:', error);
            Alert.alert('Error', 'Failed to process donation. Please try again.');
        }
    };

    const handleBookmark = async () => {
        try {
            if (allMissions.length > 0 && currentMissionIndex < allMissions.length) {
                const currentMission = allMissions[currentMissionIndex];
                await bookmarkMission(currentMission.id);
                console.log('Mission bookmarked');
                
                // Move to next mission after bookmarking
                handleDecline();
            }
        } catch (error) {
            console.error('Failed to bookmark mission:', error);
            Alert.alert('Error', 'Failed to bookmark mission. Please try again.');
        }
    };

    if (loading) {
        return (
            <YStack f={1} ai="center" jc="center" bg="white">
                <Spinner size="large" color="$blue10" />
                <Text mt={16} fontSize={16} color="$gray10">Loading missions...</Text>
            </YStack>
        );
    }

    if (allMissions.length === 0) {
        return (
            <YStack f={1} ai="center" jc="center" bg="white" px={24}>
                <Text fontSize={18} fontWeight="600" color="$gray10" textAlign="center">
                    No missions available at the moment
                </Text>
                <Text mt={8} fontSize={14} color="$gray8" textAlign="center">
                    Check back later for new missions
                </Text>
            </YStack>
        );
    }

    // Get current missions to display (show up to 3 missions in stack)
    const visibleMissions = allMissions.slice(currentMissionIndex, currentMissionIndex + 3);

    return (
        <YStack f={1} bg="white" pl={20} pr={20} pb={20} ai="center">
            <HeaderB 
                icon="options" 
                presshandler={() => setShowFilters(true)} 
                name="Discover" 
            />

            <DiscoverCardsStack missions={visibleMissions} />

            <DiscoverActionButtons
                onDecline={handleDecline}
                onAccept={handleAccept}
                onDonate={handleDonate}
                onBookmark={handleBookmark}
                currentMission={allMissions.length > 0 ? allMissions[currentMissionIndex] : null}
            />

            <DiscoverFiltersModal
                visible={showFilters}
                onClose={() => setShowFilters(false)}
                distance={distance}
                setDistance={setDistance}
                paymentType={paymentType}
                setPaymentType={setPaymentType}
                urgency={urgency}
                setUrgency={setUrgency}
            />
        </YStack>
    );
}