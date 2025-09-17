import React from 'react';
import OfflineScreen from '~/assets/ui/components/network/OfflineScreen';
import { useAppStore } from '~/store/index';
import { router } from 'expo-router';

export default function OfflineErrorPage() {
  const { isOnline } = useAppStore();

  const handleRetry = () => {
    if (isOnline) {
      // Go back to previous screen or main app
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)');
      }
    }
  };

  return <OfflineScreen onRetry={handleRetry} />;
}