// services/PushNotificationService.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationData {
  title: string;
  body: string;
  data?: any;
  categoryId?: string;
  sound?: boolean;
  badge?: number;
  priority?: 'min' | 'low' | 'default' | 'high' | 'max';
  channelId?: string;
}

export interface ScheduledNotification {
  id: string;
  trigger: Notifications.NotificationTriggerInput;
  content: NotificationData;
}

class PushNotificationService {
  private static instance: PushNotificationService;
  private expoPushToken: string | null = null;
  private notificationListener: any = null;
  private responseListener: any = null;

  private constructor() {
    this.setupNotificationChannels();
    this.configureNotificationHandler();
  }

  public static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  private setupNotificationChannels() {
    if (Platform.OS === 'android') {
      // Create notification channels for Android
      const channels = [
        {
          id: 'missions',
          name: 'Mission Updates',
          importance: Notifications.AndroidImportance.HIGH,
          description: 'Notifications about new missions and updates',
          sound: 'default',
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#4a8a28',
        },
        {
          id: 'messages',
          name: 'Messages',
          importance: Notifications.AndroidImportance.HIGH,
          description: 'New messages from other users',
          sound: 'default',
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#007bff',
        },
        {
          id: 'achievements',
          name: 'Achievements',
          importance: Notifications.AndroidImportance.DEFAULT,
          description: 'Achievement unlocks and milestones',
          sound: 'default',
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#ffc107',
        },
        {
          id: 'system',
          name: 'System',
          importance: Notifications.AndroidImportance.DEFAULT,
          description: 'System updates and announcements',
          sound: 'default',
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#6c757d',
        },
        {
          id: 'marketing',
          name: 'Promotions',
          importance: Notifications.AndroidImportance.LOW,
          description: 'Marketing and promotional content',
          sound: null,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#17a2b8',
        }
      ];

      channels.forEach(async (channel) => {
        await Notifications.setNotificationChannelAsync(channel.id, channel);
      });
    }
  }

  private configureNotificationHandler() {
    Notifications.setNotificationHandler({
      handleNotification: async (notification) => {
        const settings = await this.getNotificationSettings();
        
        return {
          shouldShowAlert: settings.pushNotifications,
          shouldPlaySound: settings.inAppSounds && settings.pushNotifications,
          shouldSetBadge: true,
          shouldShowBanner: settings.pushNotifications,
          shouldShowList: settings.pushNotifications,
        };
      },
    });
  }

  private async getNotificationSettings() {
    try {
      const settings = await AsyncStorage.getItem('notificationSettings');
      return settings ? JSON.parse(settings) : {
        pushNotifications: true,
        inAppSounds: true,
        missionUpdates: true,
        newMessages: true,
        achievements: true,
        marketing: false,
      };
    } catch (error) {
      console.error('Failed to get notification settings:', error);
      return {
        pushNotifications: true,
        inAppSounds: true,
        missionUpdates: true,
        newMessages: true,
        achievements: true,
        marketing: false,
      };
    }
  }

  public async initialize(): Promise<string | null> {
    try {
      if (!Device.isDevice) {
        console.warn('Push notifications only work on physical devices');
        return null;
      }

      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Push notification permissions not granted');
        return null;
      }

      // Get Expo push token
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-project-id', // Replace with your actual Expo project ID
      });
      
      this.expoPushToken = tokenData.data;
      
      // Store token for server registration
      await AsyncStorage.setItem('expoPushToken', this.expoPushToken);
      
      // Set up listeners
      this.setupNotificationListeners();
      
      console.log('Push notification service initialized with token:', this.expoPushToken);
      return this.expoPushToken;

    } catch (error) {
      console.error('Failed to initialize push notification service:', error);
      return null;
    }
  }

  private setupNotificationListeners() {
    // Listener for notifications received while app is foregrounded
    this.notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
        this.handleNotificationReceived(notification);
      }
    );

    // Listener for when user taps on notification
    this.responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification response:', response);
        this.handleNotificationResponse(response);
      }
    );
  }

  private async handleNotificationReceived(notification: Notifications.Notification) {
    // Handle notification received while app is open
    const { title, body, data } = notification.request.content;
    
    // You can show custom in-app notification here
    // or update app state based on notification data
    
    // Store notification in local storage for notification history
    await this.storeNotificationInHistory({
      id: notification.request.identifier,
      title: title || '',
      message: body || '',
      data: data || {},
      timestamp: new Date(),
      read: false,
      type: data?.type || 'system'
    });
  }

  private handleNotificationResponse(response: Notifications.NotificationResponse) {
    const { notification } = response;
    const { data } = notification.request.content;
    
    // Handle navigation based on notification type
    if (data?.type) {
      switch (data.type) {
        case 'mission':
          // Navigate to missions screen
          // router.push('/missions');
          break;
        case 'message':
          // Navigate to messages screen
          // router.push('/messages');
          break;
        case 'achievement':
          // Navigate to profile screen
          // router.push('/profile');
          break;
        default:
          // Default navigation
          break;
      }
    }
  }

  private async storeNotificationInHistory(notification: any) {
    try {
      const existingNotifications = await AsyncStorage.getItem('notificationHistory');
      const notifications = existingNotifications ? JSON.parse(existingNotifications) : [];
      
      // Add new notification to the beginning
      notifications.unshift(notification);
      
      // Keep only last 50 notifications
      if (notifications.length > 50) {
        notifications.splice(50);
      }
      
      await AsyncStorage.setItem('notificationHistory', JSON.stringify(notifications));
    } catch (error) {
      console.error('Failed to store notification in history:', error);
    }
  }

  public async scheduleLocalNotification(
    content: NotificationData,
    trigger: Notifications.NotificationTriggerInput
  ): Promise<string> {
    try {
      const settings = await this.getNotificationSettings();
      
      if (!settings.pushNotifications) {
        throw new Error('Push notifications are disabled');
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: content.title,
          body: content.body,
          data: content.data || {},
          sound: content.sound !== false && settings.inAppSounds ? 'default' : false,
          badge: content.badge,
          categoryIdentifier: content.categoryId,
        },
        trigger,
      });

      console.log('Scheduled local notification with ID:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('Failed to schedule local notification:', error);
      throw error;
    }
  }

  public async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('Cancelled notification:', notificationId);
    } catch (error) {
      console.error('Failed to cancel notification:', error);
      throw error;
    }
  }

  public async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('Cancelled all notifications');
    } catch (error) {
      console.error('Failed to cancel all notifications:', error);
      throw error;
    }
  }

  public async getAllScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Failed to get scheduled notifications:', error);
      return [];
    }
  }

  public async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('Failed to set badge count:', error);
    }
  }

  public async getBadgeCount(): Promise<number> {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      console.error('Failed to get badge count:', error);
      return 0;
    }
  }

  public getExpoPushToken(): string | null {
    return this.expoPushToken;
  }

  public async updateNotificationSettings(settings: any): Promise<void> {
    try {
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(settings));
      
      // If push notifications are disabled, cancel all scheduled notifications
      if (!settings.pushNotifications) {
        await this.cancelAllNotifications();
      }
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      throw error;
    }
  }

  // Predefined notification templates
  public async sendMissionNotification(missionTitle: string, location: string): Promise<string> {
    const settings = await this.getNotificationSettings();
    
    if (!settings.missionUpdates || !settings.pushNotifications) {
      throw new Error('Mission notifications are disabled');
    }

    return this.scheduleLocalNotification(
      {
        title: 'New Mission Available',
        body: `"${missionTitle}" near ${location}`,
        data: { type: 'mission', missionTitle, location },
        categoryId: 'missions',
        sound: true,
      },
      { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 1, repeats: false }
    );
  }

  public async sendMessageNotification(senderName: string, preview: string): Promise<string> {
    const settings = await this.getNotificationSettings();
    
    if (!settings.newMessages || !settings.pushNotifications) {
      throw new Error('Message notifications are disabled');
    }

    return this.scheduleLocalNotification(
      {
        title: `Message from ${senderName}`,
        body: preview,
        data: { type: 'message', senderName },
        categoryId: 'messages',
        sound: true,
      },
      { seconds: 1 }
    );
  }

  public async sendAchievementNotification(achievementTitle: string, description: string): Promise<string> {
    const settings = await this.getNotificationSettings();
    
    if (!settings.achievements || !settings.pushNotifications) {
      throw new Error('Achievement notifications are disabled');
    }

    return this.scheduleLocalNotification(
      {
        title: 'Achievement Unlocked! 🏆',
        body: `${achievementTitle}: ${description}`,
        data: { type: 'achievement', achievementTitle },
        categoryId: 'achievements',
        sound: true,
      },
      { seconds: 1 }
    );
  }

  public async sendReminderNotification(title: string, body: string, delayInMinutes: number): Promise<string> {
    return this.scheduleLocalNotification(
      {
        title,
        body,
        data: { type: 'reminder' },
        categoryId: 'system',
        sound: true,
      },
      { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: delayInMinutes * 60, repeats: false }
    );
  }

  public cleanup(): void {
    if (this.notificationListener) {
      this.notificationListener.remove();
    }
    if (this.responseListener) {
      this.responseListener.remove();
    }
  }
}

export default PushNotificationService;

