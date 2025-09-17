import React, { useEffect } from 'react';
import { useAppStore } from '~/store/index';
// import NetInfo from '@react-native-community/netinfo';

export const NetworkMonitor: React.FC = () => {
  const { setNetworkStatus } = useAppStore();

  useEffect(() => {
    // Fallback network monitoring without NetInfo
    // You can install @react-native-community/netinfo later
    
    // Mock network state - replace with actual NetInfo when available
    const checkConnection = () => {
      // For now, assume we're online
      setNetworkStatus(true, 'wifi');
    };

    checkConnection();

    // Set up a simple interval to simulate network monitoring
    const interval = setInterval(() => {
      // In a real implementation, this would use NetInfo
      setNetworkStatus(navigator.onLine ?? true, 'wifi');
    }, 5000);

    return () => clearInterval(interval);
  }, [setNetworkStatus]);

  return null; // This component doesn't render anything
};

export default NetworkMonitor;