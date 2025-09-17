import { StateCreator } from 'zustand';
import { database } from '~/database';
import { Notification as DBNotification } from '~/database/models';
import { Q } from '@nozbe/watermelondb';
import { AppStore, NotificationsState, NotificationsActions, NotificationItem } from '../types';

export interface NotificationsSlice extends NotificationsState, NotificationsActions {}

export const createNotificationsSlice: StateCreator<
  AppStore,
  [],
  [],
  NotificationsSlice
> = (set, get) => ({
  // Initial state
  notifications: [],

  // Actions
  loadNotifications: async (userId: string) => {
    try {
      const dbNotifications = await database
        .get<DBNotification>('notifications')
        .query(Q.where('user_id', userId), Q.sortBy('created_at', Q.desc))
        .fetch();
      
      const notifications: NotificationItem[] = dbNotifications.map(n => ({
        id: n.id,
        userId: n.userId,
        type: n.type,
        title: n.title,
        message: n.message,
        isRead: n.isRead,
        icon: n.icon,
        color: n.color,
        createdAt: n.createdAt,
      }));
      
      set({ notifications });
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  },

  markNotificationAsRead: async (notificationId: string) => {
    try {
      await database.write(async () => {
        const notification = await database.get<DBNotification>('notifications').find(notificationId);
        await notification.update(n => {
          n.isRead = true;
        });
      });
      
      // Update local state
      set(state => ({
        notifications: state.notifications.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      }));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  },

  createNotification: async (notification: Omit<NotificationItem, 'id' | 'createdAt'>) => {
    try {
      await database.write(async () => {
        const newNotification = await database.get<DBNotification>('notifications').create(n => {
          n.userId = notification.userId;
          n.type = notification.type;
          n.title = notification.title;
          n.message = notification.message;
          n.isRead = notification.isRead;
          n.icon = notification.icon || '';
          n.color = notification.color || '#333';
          n.createdAt = new Date();
          n.updatedAt = new Date();
        });
        
        // Update local state
        set(state => ({
          notifications: [{
            id: newNotification.id,
            userId: newNotification.userId,
            type: newNotification.type,
            title: newNotification.title,
            message: newNotification.message,
            isRead: newNotification.isRead,
            icon: newNotification.icon,
            color: newNotification.color,
            createdAt: newNotification.createdAt,
          }, ...state.notifications]
        }));
      });
    } catch (error) {
      console.error('Failed to create notification:', error);
      throw error;
    }
  },

  clearNotifications: () => set({ notifications: [] }),
});