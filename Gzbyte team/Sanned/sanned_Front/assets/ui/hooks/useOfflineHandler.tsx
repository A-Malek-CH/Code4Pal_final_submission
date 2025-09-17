import { useEffect } from 'react';
import { useAppStore } from '~/store/index';
import { router, usePathname } from 'expo-router';

export const useOfflineHandler = () => {
  const { isOnline } = useAppStore();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect if we're already on the offline screen or critical auth screens
    const protectedScreens = ['/offline', '/onboarding', '/login', '/signup'];
    const isOnProtectedScreen = protectedScreens.some(screen => pathname.startsWith(screen));

    if (!isOnline && !isOnProtectedScreen) {
      // Only show offline screen for non-critical flows
      // You can customize this logic based on which screens need network
      const networkRequiredScreens = ['/missions', '/addmission', '/discover'];
      const requiresNetwork = networkRequiredScreens.some(screen => pathname.startsWith(screen));

      if (requiresNetwork) {
        router.push('/offline');
      }
    }
  }, [isOnline, pathname]);
};

export default useOfflineHandler;