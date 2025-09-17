import React from 'react';
import { YStack, XStack, Text, Switch } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '~/store/index';

export default function NotificationSettings() {
  const { notificationSettings, updateNotificationSettings } = useAppStore();

  const settingItems = [
    {
      key: 'pushNotifications' as const,
      icon: 'notifications',
      title: 'Push Notifications',
      subtitle: 'Receive notifications on your device',
      isMaster: true,
    },
    {
      key: 'missionUpdates' as const,
      icon: 'location',
      title: 'Mission Updates',
      subtitle: 'Updates about mission status and changes',
      disabled: !notificationSettings.pushNotifications,
    },
    {
      key: 'newMessages' as const,
      icon: 'chatbubble',
      title: 'New Messages',
      subtitle: 'Notifications for new messages',
      disabled: !notificationSettings.pushNotifications,
    },
    {
      key: 'achievements' as const,
      icon: 'trophy',
      title: 'Achievements',
      subtitle: 'Celebrate your accomplishments',
      disabled: !notificationSettings.pushNotifications,
    },
    {
      key: 'emailNotifications' as const,
      icon: 'mail',
      title: 'Email Notifications',
      subtitle: 'Receive updates via email',
    },
    {
      key: 'marketing' as const,
      icon: 'megaphone',
      title: 'Marketing & Promotions',
      subtitle: 'Special offers and app updates',
    },
    {
      key: 'inAppSounds' as const,
      icon: 'volume-high',
      title: 'In-App Sounds',
      subtitle: 'Play sounds for notifications',
      disabled: !notificationSettings.pushNotifications,
    },
  ];

  return (
    <YStack bg="white" br={16} overflow="hidden">
      <YStack px={20} py={16} bg="#f8f9fa">
        <Text fontSize={12} fontWeight="600" color="#6c757d" textTransform="uppercase">
          Notification Settings
        </Text>
      </YStack>
      
      <YStack>
        {settingItems.map((item, index) => (
          <XStack 
            key={item.key} 
            ai="center" 
            jc="space-between" 
            px={20} 
            py={16}
            borderBottomWidth={index < settingItems.length - 1 ? 1 : 0}
            borderBottomColor="#f0f0f0"
            opacity={item.disabled ? 0.5 : 1}
          >
            <XStack ai="center" f={1} gap={16}>
              <YStack 
                w={36} 
                h={36} 
                br={18} 
                bg={item.isMaster ? '#4a8a2820' : '#f8f9fa'} 
                ai="center" 
                jc="center"
              >
                <Ionicons 
                  name={item.icon as any} 
                  size={18} 
                  color={item.isMaster ? '#4a8a28' : '#6c757d'} 
                />
              </YStack>
              
              <YStack f={1}>
                <Text 
                  fontSize={14} 
                  fontWeight={item.isMaster ? '600' : '500'} 
                  color="#333" 
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <Text 
                  fontSize={12} 
                  color="#6c757d" 
                  mt={2} 
                  numberOfLines={1}
                >
                  {item.subtitle}
                </Text>
              </YStack>
            </XStack>

            <Switch 
              size="$4" 
              checked={notificationSettings[item.key]} 
              onCheckedChange={(value) => updateNotificationSettings(item.key, value)}
              disabled={item.disabled}
            >
              <Switch.Thumb animation="bouncy" />
            </Switch>
          </XStack>
        ))}
      </YStack>
    </YStack>
  );
}