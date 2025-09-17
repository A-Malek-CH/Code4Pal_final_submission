import React from 'react';
import { YStack, XStack, Text, Button } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export type NotificationItem = {
  id: string;
  type: 'mission' | 'message' | 'system' | 'achievement';
  title: string;
  message: string;
  timestamp: string; // ISO
  read: boolean;
  actionData?: any;
};

interface NotificationItemProps {
  notification: NotificationItem;
  onPress: (notification: NotificationItem) => void;
  onToggleRead: (notificationId: string) => void;
  onDelete: (notificationId: string) => void;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'mission':
      return 'location';
    case 'message':
      return 'chatbubble';
    case 'system':
      return 'settings';
    case 'achievement':
      return 'trophy';
    default:
      return 'notifications';
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'mission':
      return '#4a8a28';
    case 'message':
      return '#007bff';
    case 'system':
      return '#6c757d';
    case 'achievement':
      return '#ffc107';
    default:
      return '#6c757d';
  }
};

const formatTimestamp = (iso: string) => {
  const timestamp = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return timestamp.toLocaleDateString();
};

export default function NotificationItemComponent({ 
  notification, 
  onPress, 
  onToggleRead, 
  onDelete 
}: NotificationItemProps) {
  const iconName = getNotificationIcon(notification.type);
  const iconColor = getNotificationColor(notification.type);

  return (
    <Button 
      unstyled 
      onPress={() => onPress(notification)}
      key={notification.id}
    >
      <XStack 
        ai="center" 
        p={16} 
        bg={notification.read ? 'white' : '#f8f9fa'} 
        borderBottomWidth={1} 
        borderBottomColor="#f0f0f0"
        opacity={notification.read ? 0.7 : 1}
      >
        {/* Icon */}
        <YStack 
          w={40} 
          h={40} 
          br={20} 
          bg={`${iconColor}20`} 
          ai="center" 
          jc="center" 
          mr={12}
        >
          <Ionicons name={iconName as any} size={18} color={iconColor} />
        </YStack>

        {/* Content */}
        <YStack f={1} mr={12}>
          <XStack ai="center" jc="space-between" mb={4}>
            <Text 
              fontSize={14} 
              fontWeight={notification.read ? '500' : '700'} 
              color="#333" 
              numberOfLines={1}
              f={1}
            >
              {notification.title}
            </Text>
            <Text fontSize={10} color="#6c757d">
              {formatTimestamp(notification.timestamp)}
            </Text>
          </XStack>
          
          <Text 
            fontSize={12} 
            color="#6c757d" 
            numberOfLines={2}
            lineHeight={16}
          >
            {notification.message}
          </Text>
        </YStack>

        {/* Actions */}
        <XStack ai="center" gap={8}>
          <Button 
            unstyled 
            onPress={(e) => {
              e.stopPropagation();
              onToggleRead(notification.id);
            }} 
            p={8}
          >
            <Ionicons 
              name={notification.read ? 'mail-unread' : 'mail-open'} 
              size={16} 
              color="#6c757d" 
            />
          </Button>
          
          <Button 
            unstyled 
            onPress={(e) => {
              e.stopPropagation();
              onDelete(notification.id);
            }} 
            p={8}
          >
            <Ionicons name="trash-outline" size={16} color="#dc3545" />
          </Button>
        </XStack>

        {/* Unread indicator */}
        {!notification.read && (
          <YStack 
            position="absolute" 
            right={12} 
            top={12}
            w={8} 
            h={8} 
            br={4} 
            bg={iconColor} 
          />
        )}
      </XStack>
    </Button>
  );
}