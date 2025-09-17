import React from 'react';
import { YStack, XStack, Text, Button } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import * as Clipboard from 'expo-clipboard';
import { Alert } from 'react-native';
import { useAppStore } from '~/store/index';

interface NotificationActionsProps {
  notifications: any[];
  onClearAll: () => void;
}

export default function NotificationActions({ notifications, onClearAll }: NotificationActionsProps) {
  const { notificationSettings } = useAppStore();

  const sendTestNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Test Notification',
          body: 'This is a test notification queued from the app.',
          data: { type: 'system', route: '/support' },
          sound: notificationSettings.inAppSounds ? 'default' : undefined,
        },
        trigger: { seconds: 2 } as any,
      });
      Alert.alert('Scheduled', 'Test notification will appear in ~2s');
    } catch (error) {
      console.warn('Failed to schedule', error);
      Alert.alert('Error', 'Failed to schedule test notification');
    }
  };

  const exportNotifications = async () => {
    try {
      const payload = JSON.stringify(notifications, null, 2);
      await Clipboard.setStringAsync(payload);
      Alert.alert('Exported', 'All notifications copied to clipboard (JSON)');
    } catch (e) {
      Alert.alert('Error', 'Failed to export notifications');
    }
  };

  return (
    <YStack gap={12}>
      <Button bg="#4a8a28" h={45} br={12} onPress={sendTestNotification}>
        <XStack ai="center" gap={8}>
          <Ionicons name="notifications" size={18} color="white" />
          <Text fontSize={14} fontWeight="600" color="white">
            Send Test Notification
          </Text>
        </XStack>
      </Button>

      <Button 
        bg="#fff" 
        h={45} 
        br={12} 
        borderWidth={1} 
        borderColor="#4a8a28" 
        onPress={exportNotifications}
      >
        <XStack ai="center" gap={8}>
          <Ionicons name="share" size={18} color="#4a8a28" />
          <Text fontSize={14} fontWeight="600" color="#4a8a28">
            Export Notifications
          </Text>
        </XStack>
      </Button>

      <Button 
        bg="#fff" 
        h={45} 
        br={12} 
        borderWidth={1} 
        borderColor="#dc3545" 
        onPress={onClearAll}
      >
        <XStack ai="center" gap={8}>
          <Ionicons name="trash" size={18} color="#dc3545" />
          <Text fontSize={14} fontWeight="600" color="#dc3545">
            Clear All Notifications
          </Text>
        </XStack>
      </Button>
    </YStack>
  );
}