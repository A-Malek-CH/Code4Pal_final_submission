import React, { useEffect, useState } from 'react';
import { TamaguiProvider } from 'tamagui';
import { SplashScreen, Stack, Redirect, useRouter, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '~/store/index';
import PushNotificationService from '~/services/PushNotifications';
import NetworkMonitor from '~/assets/ui/components/network/NetworkMonitor';
import useOfflineHandler from '~/assets/ui/hooks/useOfflineHandler';
import { initializeDatabase } from '~/database';
import { syncService } from '~/services/SyncService';

import config from '~/tamagui.config';

SplashScreen.preventAutoHideAsync();

function useProtectedRoute() {
  const segments = useSegments();
  const router = useRouter();
  const { hasCompletedOnboarding, isAuthenticated } = useAppStore();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(tabs)';
    const inOnboarding = segments[0] === 'onboarding' || segments[0] === undefined;
    const inLogin = segments[0] === 'login';
    const inSignup = segments[0] === 'signup';

    if (!hasCompletedOnboarding) {
      // User hasn't completed onboarding, redirect to onboarding
      if (!inOnboarding) {
        router.replace('/onboarding');
      }
    } else if (hasCompletedOnboarding && !isAuthenticated) {
      // User completed onboarding but not authenticated, redirect to login
      if (!inLogin && !inSignup && !inOnboarding) {
        router.replace('/login');
      }
    } else if (hasCompletedOnboarding && isAuthenticated) {
      // User is fully onboarded and authenticated, redirect to main app
      if (!inAuthGroup && (inOnboarding || inLogin || inSignup)) {
        router.replace('/(tabs)');
      }
    }
  }, [hasCompletedOnboarding, isAuthenticated, segments]);
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SK: require('~/assets/fonts/Sk-Modernist-Bold.otf'),
    SKBold: require('~/assets/fonts/Sk-Modernist-Bold.otf'),
  });

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (loaded) {
      // Initialize app services
      const initializeApp = async () => {
        try {
          // Initialize database first
          await initializeDatabase();
          console.log('Database initialized');

          // Load user from database if exists
          const { loadUserFromDatabase } = useAppStore.getState();
          try {
            await loadUserFromDatabase();
            console.log('User loaded from database');
          } catch (userError) {
            console.warn('No user loaded from database:', userError);
          }

          // Initialize notifications
          const notificationService = PushNotificationService.getInstance();
          await notificationService.initialize();
          console.log('Notifications initialized');
          
          // Initialize sync service for offline-first functionality
          console.log('Sync service initialized and monitoring network status');
        } catch (error) {
          console.warn('Failed to initialize app services:', error);
        }
      };

      initializeApp().finally(() => {
        setIsReady(true);
        SplashScreen.hideAsync();
      });
    }
  }, [loaded]);

  if (!loaded || !isReady) return null;

  return (
    <TamaguiProvider config={config}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          <RootLayoutNav />
        </SafeAreaView>
      </SafeAreaProvider>
    </TamaguiProvider>
  );
}

function RootLayoutNav() {
  useProtectedRoute();
  useOfflineHandler();

  return (
    <>
      <NetworkMonitor />
      <Stack 
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="offline" options={{ headerShown: false }} />
        
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="missions" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="missionstatus" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="missiondetails" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="addmission" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="matchfound" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="map" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="(profileScreens)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
