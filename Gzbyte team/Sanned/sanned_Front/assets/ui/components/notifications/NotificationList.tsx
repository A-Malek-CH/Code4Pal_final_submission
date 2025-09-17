import React from 'react';
import { YStack, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import NotificationItemComponent, { NotificationItem } from './NotificationItem';

interface NotificationListProps {
  notifications: NotificationItem[];
  onNotificationPress: (notification: NotificationItem) => void;
  onToggleRead: (notificationId: string) => void;
  onDeleteNotification: (notificationId: string) => void;
}

export default function NotificationList({ 
  notifications, 
  onNotificationPress, 
  onToggleRead, 
  onDeleteNotification 
}: NotificationListProps) {
  
  if (notifications.length === 0) {
    return (
      <YStack bg="white" br={16} p={40} ai="center" jc="center">
        <Ionicons name="notifications-off" size={48} color="#6c757d" />
        <Text fontSize={16} fontWeight="600" color="#6c757d" mt={16}>
          No notifications yet
        </Text>
        <Text fontSize={14} color="#6c757d" mt={8} textAlign="center">
          You'll see notifications about missions, messages, and achievements here.
        </Text>
      </YStack>
    );
  }

  return (
    <YStack gap={12}>
      {notifications.map(notification => (
        <YStack key={notification.id} bg="white" br={16} overflow="hidden">
          <NotificationItemComponent
            notification={notification}
            onPress={onNotificationPress}
            onToggleRead={onToggleRead}
            onDelete={onDeleteNotification}
          />
        </YStack>
      ))}
    </YStack>
  );
}