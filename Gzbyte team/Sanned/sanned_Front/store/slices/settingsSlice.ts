import { StateCreator } from 'zustand';
import { AppStore, SettingsState, SettingsActions, AppSettings, NotificationSettings } from '../types';

export interface SettingsSlice extends SettingsState, SettingsActions {}

export const createSettingsSlice: StateCreator<
  AppStore,
  [],
  [],
  SettingsSlice
> = (set) => ({
  // Initial state
  isOnline: true,
  networkType: null,
  
  settings: {
    darkMode: false,
    notifications: true,
    locationServices: true,
    hapticFeedback: true,
    autoBackup: true,
    analytics: false,
    backgroundAppRefresh: true,
    twoFactor: false,
  },
  
  notificationSettings: {
    pushNotifications: true,
    missionUpdates: true,
    newMessages: true,
    achievements: true,
    marketing: false,
    emailNotifications: true,
    inAppSounds: true,
  },

  // Actions
  setNetworkStatus: (isOnline: boolean, networkType: string | null) => set({ 
    isOnline, 
    networkType 
  }),
  
  updateSettings: (key: keyof AppSettings, value: boolean) => 
    set((state) => ({
      settings: { ...state.settings, [key]: value }
    })),
  
  updateNotificationSettings: (key: keyof NotificationSettings, value: boolean) => 
    set((state) => {
      const newSettings = { ...state.notificationSettings, [key]: value };
      
      // If master switch is turned off, disable other related settings
      if (key === 'pushNotifications' && !value) {
        newSettings.missionUpdates = false;
        newSettings.newMessages = false;
        newSettings.achievements = false;
        newSettings.marketing = false;
        newSettings.inAppSounds = false;
      }
      
      return { notificationSettings: newSettings };
    }),
  
  resetSettings: () => set({
    isOnline: true,
    networkType: null,
    settings: {
      darkMode: false,
      notifications: true,
      locationServices: true,
      hapticFeedback: true,
      autoBackup: true,
      analytics: false,
      backgroundAppRefresh: true,
      twoFactor: false,
    },
    notificationSettings: {
      pushNotifications: true,
      missionUpdates: true,
      newMessages: true,
      achievements: true,
      marketing: false,
      emailNotifications: true,
      inAppSounds: true,
    },
  }),
});