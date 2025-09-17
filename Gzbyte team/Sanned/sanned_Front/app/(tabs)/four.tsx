// Profile.tsx (Refactored with Dynamic Data)
import React, { useEffect, useState } from 'react';
import { YStack, XStack, Text, Button, ScrollView, Spinner } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, Modal } from "react-native";

// Import broken-down components
import ProfileHeaderSection from '~/assets/ui/components/profile/ProfileHeaderSection';
import ProfileActionButtons from '~/assets/ui/components/profile/ProfileActionButtons';
import ProfileStatsSection from '~/assets/ui/components/profile/ProfileStatsSection';
import ProfileSkillsSection from '~/assets/ui/components/profile/ProfileSkillsSection';
import ProfileContactSection from '~/assets/ui/components/profile/ProfileContactSection';
import ProfileMenuSection from '~/assets/ui/components/profile/ProfileMenuSection';
import SecurityAuditComponent from '~/assets/ui/components/profile/SecurityAuditComponent';

// Import store
import { useAppStore } from '~/store/index';

export default function Profile() {
    const { user, missions, loadMissions, logout, isAuthenticated, loadUserSkills, userSkills } = useAppStore();
    const [loading, setLoading] = useState(true);
    const [showSecurityAudit, setShowSecurityAudit] = useState(false);
    const [userStats, setUserStats] = useState({
        missions: 0,
        completed: 0,
        peopleHelped: 0
    });

    useEffect(() => {
        loadUserData();
    }, [user, missions]); // Add missions dependency to recalculate when missions change

    const loadUserData = async () => {
        try {
            if (user?.id) {
                // Load user's missions to calculate stats
                await loadMissions(user.id);
                
                // Load user's skills using store function
                await loadUserSkills(user.id);
                
                // Calculate user statistics from missions
                const userMissions = missions.filter(mission => mission.userId === user.id);
                const completedMissions = userMissions.filter(mission => mission.status === 'completed');
                const matchedMissions = userMissions.filter(mission => mission.status === 'matched');
                const activeMissions = userMissions.filter(mission => mission.status === 'active');
                
                setUserStats({
                    missions: userMissions.length,
                    completed: completedMissions.length,
                    peopleHelped: completedMissions.length * 2 // Estimate 2 people helped per completed mission
                });
            }
            setLoading(false);
        } catch (error) {
            console.error('Failed to load user data:', error);
            setLoading(false);
        }
    };

    // Fallback data if user is not available
    const userData = {
        name: user?.name || "User",
        username: user?.email ? `@${user.email.split('@')[0]}` : "@user",
        bio: user?.bio || "Helping missions and spreading kindness 🌿",
        profileImage: user?.avatar ? { uri: user.avatar } : require("~/assets/images/pfp.jpeg"),
        stats: userStats,
        contact: {
            email: user?.email || "user@example.com",
            phone: user?.phone || "+970 59 123 456", // Palestinian mobile number format
            location: user?.location || (user?.isInGaza ? "Gaza, Palestine" : "Palestine")
        },
        isVerified: user?.isVerified || false
    };

    const menuItems = [
        { 
            icon: "notifications-outline", 
            label: "Notifications", 
            route: "/(profileScreens)/Notification", 
            color: "#4a8a28" 
        },
        {
            icon: "star-outline",
            label: "Edit Skills",
            route: "/(profileScreens)/CompleteProfile",
            color: "#4a8a28"
        },
        { 
            icon: "shield-checkmark-outline", 
            label: "Security Audit", 
            route: "/security-audit", 
            color: "#3B82F6" 
        },
        { 
            icon: "help-circle-outline", 
            label: "Support", 
            route: "/(profileScreens)/Support", 
            color: "#4a8a28" 
        },
        { 
            icon: "settings-outline", 
            label: "Settings", 
            route: "/(profileScreens)/Settings", 
            color: "#4a8a28" 
        }
    ];

    const handleEditProfile = () => {
        router.push("/(profileScreens)/EditProfile");
    };

    const handleShare = () => {
        // Add share functionality
        console.log("Share profile");
    };

    const handleMenuItemPress = (route: string) => {
        if (route === "/security-audit") {
            setShowSecurityAudit(true);
        } else {
            router.push(route as any);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await logout();
                            router.replace("/login");
                        } catch (error) {
                            console.error("Logout failed:", error);
                            Alert.alert("Error", "Failed to logout. Please try again.");
                        }
                    }
                }
            ]
        );
    };

    // Show loading spinner while data loads
    if (loading) {
        return (
            <YStack f={1} ai="center" jc="center" bg="#f8f9fa">
                <Spinner size="large" color="$blue10" />
                <Text mt={16} fontSize={16} color="$gray10">Loading profile...</Text>
            </YStack>
        );
    }

    return (
        <ScrollView f={1} bg="#f8f9fa" showsVerticalScrollIndicator={false}>
            <ProfileHeaderSection
                name={userData.name}
                username={userData.username}
                bio={userData.bio}
                profileImage={userData.profileImage}
            />

            <YStack px={20} mt={-20}>
                <ProfileActionButtons
                    onEditProfile={handleEditProfile}
                    onShare={handleShare}
                />

                <ProfileStatsSection
                    missions={userData.stats.missions}
                    completed={userData.stats.completed}
                    peopleHelped={userData.stats.peopleHelped}
                />

                <ProfileSkillsSection
                    userSkills={userSkills.map(skill => skill.skill)}
                    onSkillsUpdate={() => loadUserSkills(user?.id || '')}
                />

                <ProfileContactSection
                    email={userData.contact.email}
                    phone={userData.contact.phone}
                    location={userData.contact.location}
                />

                <ProfileMenuSection
                    menuItems={menuItems}
                    onMenuItemPress={handleMenuItemPress}
                />

                {/* Logout Button */}
                <Button
                    bg="#df1010"
                    h={55}
                    br={16}
                    mb={30}
                    onPress={handleLogout}
                    shadowColor="#df1010"
                    shadowOpacity={0.3}
                    shadowRadius={8}
                    shadowOffset={{ width: 0, height: 4 }}
                >
                    <XStack ai="center" gap={12}>
                        <Ionicons name="log-out-outline" size={22} color="white" />
                        <Text fontSize={16} fontWeight="700" color="white">Logout</Text>
                    </XStack>
                </Button>
            </YStack>

            {/* Security Audit Modal */}
            <Modal
                visible={showSecurityAudit}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowSecurityAudit(false)}
            >
                <SecurityAuditComponent onClose={() => setShowSecurityAudit(false)} />
            </Modal>
        </ScrollView>
    );
}