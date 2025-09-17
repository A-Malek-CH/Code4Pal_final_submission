import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AppStore } from './types';
import { createAuthSlice } from './slices/authSlice';
import { createNotificationsSlice } from './slices/notificationsSlice';
import { createMissionsSlice } from './slices/missionsSlice';
import { createSkillsSlice } from './slices/skillsSlice';
import { createLocationSlice } from './slices/locationSlice';
import { createSettingsSlice } from './slices/settingsSlice';

export const useAppStore = create<AppStore>()(
  persist(
    (set, get, ...a) => ({
      // Combine all slices
      ...createAuthSlice(set, get, ...a),
      ...createNotificationsSlice(set, get, ...a),
      ...createMissionsSlice(set, get, ...a),
      ...createSkillsSlice(set, get, ...a),
      ...createLocationSlice(set, get, ...a),
      ...createSettingsSlice(set, get, ...a),
      
      // Global reset action
      resetApp: () => {
        const { resetAuth, clearNotifications, clearMissions, clearSkills, clearLocation, resetSettings } = get();
        resetAuth();
        clearNotifications();
        clearMissions(); 
        clearSkills();
        clearLocation();
        resetSettings();
      },
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Only persist auth and settings data
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        authToken: state.authToken,
        settings: state.settings,
        notificationSettings: state.notificationSettings,
      }),
    }
  )
);

// Re-export types for convenience
export * from './types';