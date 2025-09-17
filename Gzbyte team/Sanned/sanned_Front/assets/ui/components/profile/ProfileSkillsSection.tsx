import React, { useState, useEffect } from 'react';
import { YStack, XStack, Text, Button, ScrollView, Card } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { Modal, Alert } from 'react-native';
import { useAppStore } from '~/store/index';
// Use store actions instead of writing directly to the database

const availableSkills = [
    'First Aid', 'Cooking', 'Tutoring', 'Gardening', 'Carpentry', 
    'Plumbing', 'Cleaning', 'Pet Care', 'Elder Care', 'Teaching',
    'Translation', 'IT Support', 'Photography', 'Event Planning', 'Music',
    'Childcare', 'Home Repair', 'Moving Help', 'Shopping', 'Transportation'
];

interface ProfileSkillsSectionProps {
    userSkills: string[];
    onSkillsUpdate: () => void;
}

export default function ProfileSkillsSection({ userSkills, onSkillsUpdate }: ProfileSkillsSectionProps) {
    const { user, userSkills: storeSkills, addUserSkill, removeUserSkill, loadUserSkills } = useAppStore();
    const [showSkillsModal, setShowSkillsModal] = useState(false);
    const [selectedSkills, setSelectedSkills] = useState<string[]>(userSkills);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        setSelectedSkills(userSkills);
    }, [userSkills]);

    const toggleSkill = (skill: string) => {
        setSelectedSkills(prev => 
            prev.includes(skill) 
                ? prev.filter(s => s !== skill)
                : [...prev, skill]
        );
    };

    const handleSaveSkills = async () => {
        if (!user) return;

        setIsUpdating(true);
        try {
            // Compute diffs against store skills for this user
            const current = (storeSkills || []).filter(s => s.userId === user.id);
            const currentNamesLower = current.map(s => s.skill.toLowerCase());
            const selectedLower = selectedSkills.map(s => s.toLowerCase());

            const toAdd = selectedSkills.filter(s => !currentNamesLower.includes(s.toLowerCase()));
            const toRemove = current.filter(s => !selectedLower.includes(s.skill.toLowerCase()));

            // Add missing skills
            for (const s of toAdd) {
                await addUserSkill(s);
            }

            // Remove unselected skills
            for (const s of toRemove) {
                await removeUserSkill(s.id);
            }

            // Reload from DB and close
            await loadUserSkills(user.id);
            onSkillsUpdate();
            setShowSkillsModal(false);
            Alert.alert('Success', 'Your skills have been updated successfully!');
        } catch (error) {
            console.error('Failed to update skills:', error);
            Alert.alert('Error', 'Failed to update skills. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Card bg="white" p={20} mx={20} mt={20} borderRadius={16} elevate shadowColor="black" shadowOpacity={0.05} shadowRadius={10}>
            <XStack ai="center" jc="space-between" mb={16}>
                <XStack ai="center" gap={12}>
                    <Ionicons name="star-outline" size={24} color="#4a8a28" />
                    <Text fontSize={18} fontWeight="700" color="#1a1a1a">
                        My Skills
                    </Text>
                </XStack>
                <Button 
                    size="$3" 
                    bg="#4a8a28" 
                    onPress={() => setShowSkillsModal(true)}
                    borderRadius={20}
                >
                    <Text color="white" fontWeight="600">Edit</Text>
                </Button>
            </XStack>

            {userSkills.length > 0 ? (
                <XStack flexWrap="wrap" gap={8}>
                    {userSkills.map((skill) => (
                        <Card 
                            key={skill}
                            bg="#f0f9ff"
                            px={12}
                            py={6}
                            borderRadius={20}
                            borderWidth={1}
                            borderColor="#e0f2fe"
                        >
                            <Text fontSize={14} color="#0369a1" fontWeight="500">
                                {skill}
                            </Text>
                        </Card>
                    ))}
                </XStack>
            ) : (
                <YStack ai="center" py={20}>
                    <Ionicons name="add-circle-outline" size={48} color="#94a3b8" />
                    <Text fontSize={16} color="#64748b" textAlign="center" mt={8}>
                        No skills added yet
                    </Text>
                    <Text fontSize={14} color="#94a3b8" textAlign="center" mt={4}>
                        Add skills to help others find you
                    </Text>
                </YStack>
            )}

            {/* Skills Modal */}
            <Modal
                visible={showSkillsModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowSkillsModal(false)}
            >
                <YStack f={1} bg="white">
                    {/* Header */}
                    <XStack ai="center" jc="space-between" p={20} pt={60} bg="#f8f9fa">
                        <Button 
                            size="$3" 
                            variant="outlined" 
                            onPress={() => setShowSkillsModal(false)}
                            borderRadius={20}
                        >
                            <Text>Cancel</Text>
                        </Button>
                        <Text fontSize={18} fontWeight="700">
                            Edit Skills
                        </Text>
                        <Button 
                            size="$3" 
                            bg="#4a8a28" 
                            onPress={handleSaveSkills}
                            disabled={isUpdating}
                            borderRadius={20}
                        >
                            <Text color="white" fontWeight="600">
                                {isUpdating ? 'Saving...' : 'Save'}
                            </Text>
                        </Button>
                    </XStack>

                    <ScrollView p={20}>
                        <Text fontSize={16} fontWeight="600" mb={8}>
                            Select Your Skills ({selectedSkills.length} selected)
                        </Text>
                        <Text fontSize={14} color="#64748b" mb={20}>
                            Choose skills you can offer to help others
                        </Text>

                        <XStack flexWrap="wrap" gap={10}>
                            {availableSkills.map((skill) => {
                                const isSelected = selectedSkills.includes(skill);
                                return (
                                    <Button
                                        key={skill}
                                        size="$3"
                                        variant={isSelected ? "outlined" : "outlined"}
                                        bg={isSelected ? "#4a8a28" : "transparent"}
                                        borderColor={isSelected ? "#4a8a28" : "#e5e7eb"}
                                        onPress={() => toggleSkill(skill)}
                                        borderRadius={20}
                                    >
                                        <XStack ai="center" gap={6}>
                                            {isSelected && (
                                                <Ionicons name="checkmark" size={16} color="white" />
                                            )}
                                            <Text 
                                                color={isSelected ? "white" : "#374151"} 
                                                fontSize={14}
                                                fontWeight={isSelected ? "600" : "400"}
                                            >
                                                {skill}
                                            </Text>
                                        </XStack>
                                    </Button>
                                );
                            })}
                        </XStack>
                    </ScrollView>
                </YStack>
            </Modal>
        </Card>
    );
}