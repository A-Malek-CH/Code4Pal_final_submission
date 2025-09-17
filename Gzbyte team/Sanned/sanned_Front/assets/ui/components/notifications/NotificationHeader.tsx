import React from 'react';
import { YStack, XStack, Text, Button } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Alert } from 'react-native';

interface NotificationHeaderProps {
  unreadCount: number;
  expoPushToken: string;
  onMarkAllAsRead: () => void;
  onGoBack: () => void;
}

export default function NotificationHeader({ 
  unreadCount, 
  expoPushToken, 
  onMarkAllAsRead, 
  onGoBack 
}: NotificationHeaderProps) {
  
  const handleCopyToken = async () => {
    if (expoPushToken) {
      await Clipboard.setStringAsync(expoPushToken);
      Alert.alert('Copied', 'Push token copied to clipboard');
    } else {
      Alert.alert('No token', 'No push token available');
    }
  };

  return (
    <YStack pt={50} pb={20} px={20} bg="white">
      <XStack ai="center" jc="space-between" mb={20}>
        <Button unstyled onPress={onGoBack} p={8}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </Button>

        <XStack ai="center" gap={8}>
          <Text fontSize={18} fontWeight="700" color="#333">
            Notifications
          </Text>
          {unreadCount > 0 && (
            <YStack
              w={20}
              h={20}
              br={10}
              bg="#dc3545"
              ai="center"
              jc="center"
            >
              <Text fontSize={10} fontWeight="700" color="white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </YStack>
          )}
        </XStack>

        <Button 
          unstyled 
          onPress={onMarkAllAsRead} 
          disabled={unreadCount === 0} 
          opacity={unreadCount === 0 ? 0.5 : 1}
        >
          <Text fontSize={14} fontWeight="600" color="#4a8a28">
            Mark all read
          </Text>
        </Button>
      </XStack>

      {/* Push Token Display */}
      <XStack ai="center" jc="space-between">
        <Text fontSize={12} color="#6c757d">
          Token: {expoPushToken ? expoPushToken.substring(0, 20) + '...' : 'Not available'}
        </Text>
        <Button unstyled onPress={handleCopyToken}>
          <Text fontSize={12} color="#4a8a28">Copy</Text>
        </Button>
      </XStack>
    </YStack>
  );
}