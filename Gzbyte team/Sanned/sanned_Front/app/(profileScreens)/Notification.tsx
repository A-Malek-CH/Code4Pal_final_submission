import React, { useEffect, useState, useRef } from 'react';
import { Alert, Platform } from 'react-native';
import { YStack, ScrollView, Text } from 'tamagui';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppStore } from '~/store/index';

// Components
import NotificationHeader from '~/assets/ui/components/notifications/NotificationHeader';
import NotificationSettings from '~/assets/ui/components/notifications/NotificationSettings';
import NotificationList from '~/assets/ui/components/notifications/NotificationList';
import NotificationActions from '~/assets/ui/components/notifications/NotificationActions';
import { NotificationItem } from '~/assets/ui/components/notifications/NotificationItem';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const STORAGE_KEYS = {
  NOTIFS: '@app_notifications_v1',
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  const notifListener = useRef<any>(null);
  const responseListener = useRef<any>(null);
  
  const { notificationSettings } = useAppStore();

  useEffect(() => {
    (async () => {
      // Load saved notifications
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFS);
        if (saved) setNotifications(JSON.parse(saved));
      } catch (e) {
        console.warn('Failed to load notifications', e);
      }

      // Register for push notifications
      const token = await registerForPushNotificationsAsync();
      if (token) setExpoPushToken(token);

      // Set up notification listeners
      notifListener.current = Notifications.addNotificationReceivedListener(n => {
        const content = n.request.content;
        const newItem: NotificationItem = {
          id: `${Date.now()}`,
          type: (content.data?.type as any) || 'system',
          title: content.title || 'Notification',
          message: content.body || '',
          timestamp: new Date().toISOString(),
          read: false,
          actionData: content.data || null,
        };
        pushNotificationToState(newItem);
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener(r => {
        const data = r.notification.request.content.data;
        if (data?.route && typeof data.route === 'string') {
          // Ensure we only push valid routes that exist in our app
          if (data.route.startsWith('/')) {
            router.push(data.route as any);
          }
        }
      });

      return () => {
        if (notifListener.current) Notifications.removeNotificationSubscription(notifListener.current);
        if (responseListener.current) Notifications.removeNotificationSubscription(responseListener.current);
      };
    })();
  }, []);

  const persistNotifications = async (items: NotificationItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to persist notifications', e);
    }
  };

  const pushNotificationToState = (item: NotificationItem) => {
    setNotifications(prev => {
      const next = [item, ...prev].slice(0, 200); // cap history
      persistNotifications(next);
      return next;
    });
  };

  const registerForPushNotificationsAsync = async () => {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4a8a28',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert('Notifications disabled', 'Enable push notifications from settings to receive updates.');
        return '';
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      Alert.alert('Physical device required', 'Push notifications only work on a physical device.');
      return '';
    }

    return token;
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => {
      const next = prev.map(n => (n.id === notificationId ? { ...n, read: true } : n));
      persistNotifications(next);
      return next;
    });
  };

  const toggleRead = (notificationId: string) => {
    setNotifications(prev => {
      const next = prev.map(n => (n.id === notificationId ? { ...n, read: !n.read } : n));
      persistNotifications(next);
      return next;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const next = prev.map(n => ({ ...n, read: true }));
      persistNotifications(next);
      return next;
    });
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => {
      const next = prev.filter(n => n.id !== notificationId);
      persistNotifications(next);
      return next;
    });
  };

  const clearAll = () => {
    Alert.alert('Clear all notifications', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          try {
            setNotifications([]);
            await AsyncStorage.removeItem(STORAGE_KEYS.NOTIFS);
          } catch (e) {
            console.warn('Failed to clear notifs', e);
          }
        },
      },
    ]);
  };

  const handleNotificationPress = (notification: NotificationItem) => {
    markAsRead(notification.id);

    switch (notification.type) {
      case 'mission':
        router.push('/missions');
        break;
      case 'message':
        // router.push('/messages'); // Route doesn't exist yet
        Alert.alert('Messages', 'Message feature coming soon!');
        break;
      case 'system':
        Alert.alert('System', notification.title, [{ text: 'OK' }]);
        break;
      case 'achievement':
        // router.push('/profile/achievements'); // Route doesn't exist yet
        Alert.alert('Achievement', notification.title, [{ text: 'OK' }]);
        break;
      default:
        break;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <ScrollView f={1} bg="#f8f9fa" showsVerticalScrollIndicator={false}>
      <NotificationHeader
        unreadCount={unreadCount}
        expoPushToken={expoPushToken}
        onMarkAllAsRead={markAllAsRead}
        onGoBack={() => router.back()}
      />

      <YStack px={20} mb={20}>
        <NotificationSettings />
      </YStack>

      <YStack px={20} mb={20}>
        <NotificationActions
          notifications={notifications}
          onClearAll={clearAll}
        />
      </YStack>

      <YStack px={20} pb={30}>
        <YStack mb={16}>
          <Text fontSize={16} fontWeight="700" color="#333">Recent Notifications</Text>
        </YStack>
        
        <NotificationList
          notifications={notifications}
          onNotificationPress={handleNotificationPress}
          onToggleRead={toggleRead}
          onDeleteNotification={deleteNotification}
        />
      </YStack>
    </ScrollView>
  );
}