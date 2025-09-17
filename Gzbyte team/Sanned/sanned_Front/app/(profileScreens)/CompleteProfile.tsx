import React, { useState } from 'react';
import { ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { YStack, XStack, Text, Button, Input } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '~/store/index';
import { router } from 'expo-router';

const availableSkills = [
  'First Aid', 'Cooking', 'Tutoring', 'Gardening', 'Carpentry', 
  'Plumbing', 'Cleaning', 'Pet Care', 'Elder Care', 'Teaching',
  'Translation', 'IT Support', 'Photography', 'Event Planning', 'Music',
  'Childcare', 'Home Repair', 'Moving Help', 'Shopping', 'Transportation'
];

export default function CompleteProfile() {
  const { user, updateUser, addUserSkill, userSkills, loadUserSkills } = useAppStore();
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(userSkills.map(s => s.skill));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const handleComplete = async () => {
    if (!user) {
      Alert.alert('Error', 'No user found. Please log in again.');
      return;
    }
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
      await updateUser({ phone: phoneNumber.trim() });

      // Load current skills to compute diffs
      await loadUserSkills(user.id);
      const current = userSkills.filter(s => s.userId === user.id).map(s => s.skill.toLowerCase());

      for (const skill of selectedSkills) {
        if (!current.includes(skill.toLowerCase())) {
          await addUserSkill(skill);
        }
      }

      Alert.alert('All Set!', 'Your profile has been completed.', [
        { text: 'Continue', onPress: () => router.replace('/(tabs)' as any) }
      ]);
    } catch (err) {
      console.error('Complete profile failed:', err);
      Alert.alert('Error', 'Failed to complete profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Setup?',
      'You can complete this later in your profile settings.',
      [
        { text: 'Continue Setup', style: 'cancel' },
        { text: 'Skip', onPress: () => router.replace('/(tabs)' as any) }
      ]
    );
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <YStack f={1} bg="white" p={20}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack gap={24} pt={50}>
            {/* Header */}
            <YStack ai="center" gap={12}>
              <YStack w={80} h={80} bg="$blue2" borderRadius={40} ai="center" jc="center">
                <Ionicons name="person-add" size={40} color="#3b82f6" />
              </YStack>
              <Text fontSize={24} fontWeight="700" ta="center" color="$gray12">Complete Your Profile</Text>
              <Text fontSize={16} color="$gray10" ta="center" lineHeight={24}>
                Add your phone number and skills to get better matches
              </Text>
            </YStack>

            {/* Phone Number */}
            <YStack gap={12}>
              <Text fontSize={18} fontWeight="600" color="$gray12">Phone Number</Text>
              <Input
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                size="$4"
                borderColor="$gray8"
                focusStyle={{ borderColor: '$blue8' }}
              />
              <Text fontSize={14} color="$gray9">This helps mission creators contact you directly</Text>
            </YStack>

            {/* Skills */}
            <YStack gap={12}>
              <Text fontSize={18} fontWeight="600" color="$gray12">Your Skills ({selectedSkills.length} selected)</Text>
              <Text fontSize={14} color="$gray9">Select skills you can offer</Text>
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
                      pressStyle={{ scale: 0.95, bg: isSelected ? '$blue11' : '$gray3' }}
                    >
                      <XStack ai="center" gap={4}>
                        {isSelected && <Ionicons name="checkmark" size={16} color="white" />}
                        <Text fontSize={14} color={isSelected ? 'white' : '$gray11'}>{skill}</Text>
                      </XStack>
                    </Button>
                  );
                })}
              </XStack>
            </YStack>

            {/* Actions */}
            <YStack gap={12} pt={10}>
              <Button size="$5" bg="$blue10" color="white" onPress={handleComplete} disabled={isSubmitting} opacity={isSubmitting ? 0.7 : 1}>
                <XStack ai="center" gap={8}>
                  <Text color="white" fontSize={16} fontWeight="600">{isSubmitting ? 'Saving...' : 'Complete Setup'}</Text>
                </XStack>
              </Button>
              <Button size="$4" bg="transparent" color="$gray10" onPress={handleSkip} disabled={isSubmitting}>
                <Text color="$gray10" fontSize={14}>Skip for now</Text>
              </Button>
            </YStack>
          </YStack>
        </ScrollView>
      </YStack>
    </KeyboardAvoidingView>
  );
}
