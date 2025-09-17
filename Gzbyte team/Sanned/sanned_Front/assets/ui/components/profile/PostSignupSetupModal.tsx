import React, { useState } from 'react';
import { Modal, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { YStack, XStack, Text, Button, Input, Card } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '~/store/index';

interface PostSignupSetupModalProps {
    visible: boolean;
    onComplete: () => void;
}

const availableSkills = [
    'First Aid', 'Cooking', 'Tutoring', 'Gardening', 'Carpentry', 
    'Plumbing', 'Cleaning', 'Pet Care', 'Elder Care', 'Teaching',
    'Translation', 'IT Support', 'Photography', 'Event Planning', 'Music'
];

export default function PostSignupSetupModal({ visible, onComplete }: PostSignupSetupModalProps) {
    const { user, updateUser, addUserSkill } = useAppStore();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleSkill = (skill: string) => {
        setSelectedSkills(prev => 
            prev.includes(skill) 
                ? prev.filter(s => s !== skill)
                : [...prev, skill]
        );
    };

    const handleComplete = async () => {
        if (!phoneNumber.trim()) {
            Alert.alert('Error', 'Please enter your phone number');
            return;
        }

        if (selectedSkills.length === 0) {
            Alert.alert('Error', 'Please select at least one skill');
            return;
        }

        setIsSubmitting(true);
        try {
            // Update user profile with phone number
            await updateUser({
                phone: phoneNumber.trim(),
            });

            // Add each selected skill to the database
            for (const skill of selectedSkills) {
                await addUserSkill(skill);
            }

            Alert.alert(
                'Setup Complete!', 
                'Your profile has been updated successfully. You can now start discovering missions!',
                [{ text: 'Continue', onPress: onComplete }]
            );
        } catch (error) {
            console.error('Failed to update profile:', error);
            Alert.alert('Error', 'Failed to update profile. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSkip = () => {
        Alert.alert(
            'Skip Setup?',
            'You can complete this later in your profile settings, but having skills and contact info helps others find and trust you.',
            [
                { text: 'Continue Setup', style: 'cancel' },
                { text: 'Skip for Now', onPress: onComplete }
            ]
        );
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <YStack f={1} bg="white" p={20}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <YStack gap={24} pt={20}>
                            {/* Header */}
                            <YStack ai="center" gap={12}>
                                <YStack 
                                    w={80} 
                                    h={80} 
                                    bg="$blue2" 
                                    borderRadius={40} 
                                    ai="center" 
                                    jc="center"
                                >
                                    <Ionicons name="person-add" size={40} color="#3b82f6" />
                                </YStack>
                                <Text fontSize={24} fontWeight="700" ta="center" color="$gray12">
                                    Complete Your Profile
                                </Text>
                                <Text fontSize={16} color="$gray10" ta="center" lineHeight={24}>
                                    Help others connect with you by adding your skills and contact information
                                </Text>
                            </YStack>

                            {/* Phone Number Section */}
                            <YStack gap={12}>
                                <Text fontSize={18} fontWeight="600" color="$gray12">
                                    Phone Number
                                </Text>
                                <Input
                                    value={phoneNumber}
                                    onChangeText={setPhoneNumber}
                                    placeholder="Enter your phone number"
                                    keyboardType="phone-pad"
                                    size="$4"
                                    borderColor="$gray8"
                                    focusStyle={{ borderColor: '$blue8' }}
                                />
                                <Text fontSize={14} color="$gray9">
                                    This helps mission creators contact you directly
                                </Text>
                            </YStack>

                            {/* Skills Section */}
                            <YStack gap={12}>
                                <Text fontSize={18} fontWeight="600" color="$gray12">
                                    Your Skills ({selectedSkills.length} selected)
                                </Text>
                                <Text fontSize={14} color="$gray9" mb={8}>
                                    Select skills you can offer to help others
                                </Text>
                                
                                <XStack flexWrap="wrap" gap={8}>
                                    {availableSkills.map((skill) => {
                                        const isSelected = selectedSkills.includes(skill);
                                        return (
                                            <Button
                                                key={skill}
                                                size="$3"
                                                bg={isSelected ? '$blue10' : '$gray2'}
                                                borderColor={isSelected ? '$blue10' : '$gray6'}
                                                borderWidth={1}
                                                color={isSelected ? 'white' : '$gray11'}
                                                onPress={() => toggleSkill(skill)}
                                                pressStyle={{ 
                                                    scale: 0.95,
                                                    bg: isSelected ? '$blue11' : '$gray3'
                                                }}
                                            >
                                                <XStack ai="center" gap={4}>
                                                    {isSelected && (
                                                        <Ionicons name="checkmark" size={16} color="white" />
                                                    )}
                                                    <Text 
                                                        fontSize={14} 
                                                        color={isSelected ? 'white' : '$gray11'}
                                                    >
                                                        {skill}
                                                    </Text>
                                                </XStack>
                                            </Button>
                                        );
                                    })}
                                </XStack>
                            </YStack>

                            {/* Action Buttons */}
                            <YStack gap={12} pt={20}>
                                <Button
                                    size="$5"
                                    bg="$blue10"
                                    color="white"
                                    onPress={handleComplete}
                                    disabled={isSubmitting}
                                    opacity={isSubmitting ? 0.7 : 1}
                                >
                                    <XStack ai="center" gap={8}>
                                        {isSubmitting && (
                                            <Ionicons name="refresh" size={16} color="white" />
                                        )}
                                        <Text color="white" fontSize={16} fontWeight="600">
                                            {isSubmitting ? 'Updating Profile...' : 'Complete Setup'}
                                        </Text>
                                    </XStack>
                                </Button>

                                <Button
                                    size="$4"
                                    bg="transparent"
                                    color="$gray10"
                                    onPress={handleSkip}
                                    disabled={isSubmitting}
                                >
                                    <Text color="$gray10" fontSize={14}>
                                        Skip for now
                                    </Text>
                                </Button>
                            </YStack>
                        </YStack>
                    </ScrollView>
                </YStack>
            </KeyboardAvoidingView>
        </Modal>
    );
}