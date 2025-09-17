import React from 'react';
import { YStack, XStack, Text, Button } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '~/store/index';
import NetworkIndicator from '~/assets/ui/components/network/NetworkIndicator';

interface UserProfileCardProps {
  onEditProfile: () => void;
}

export default function UserProfileCard({ onEditProfile }: UserProfileCardProps) {
  const { user } = useAppStore();

  return (
    <YStack bg="white" mx={20} br={16} mb={20} p={20}>
      <XStack ai="center" gap={16}>
        <YStack w={60} h={60} br={30} bg="#4a8a28" ai="center" jc="center">
          {user?.avatar ? (
            <Text fontSize={20} fontWeight="700" color="white">
              {user.name?.charAt(0) || 'U'}
            </Text>
          ) : (
            <Text fontSize={20} fontWeight="700" color="white">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'AS'}
            </Text>
          )}
        </YStack>
        
        <YStack f={1}>
          <Text fontSize={16} fontWeight="600" color="#333">
            {user?.name || 'Ayoub Salhi'}
          </Text>
          <Text fontSize={14} color="#6c757d" mt={2}>
            {user?.email || 'ayoub@example.com'}
          </Text>
          <XStack ai="center" gap={6} mt={4}>
            <NetworkIndicator />
            {user?.isVerified && (
              <>
                <YStack w={8} h={8} br={4} bg="#007bff" ml={8} />
                <Text fontSize={12} color="#007bff" fontWeight="500">Verified</Text>
              </>
            )}
          </XStack>
        </YStack>
        
        <Button unstyled onPress={onEditProfile} p={8}>
          <Ionicons name="create" size={20} color="#4a8a28" />
        </Button>
      </XStack>
    </YStack>
  );
}