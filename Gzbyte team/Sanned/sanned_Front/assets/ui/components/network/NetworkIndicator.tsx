import React from 'react';
import { XStack, YStack, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '~/store/index';

interface NetworkIndicatorProps {
  showText?: boolean;
}

export default function NetworkIndicator({ showText = true }: NetworkIndicatorProps) {
  const { isOnline, networkType } = useAppStore();

  const getNetworkIcon = () => {
    if (!isOnline) return 'cloud-offline';
    
    switch (networkType) {
      case 'wifi':
        return 'wifi';
      case 'cellular':
        return 'cellular';
      case 'ethernet':
        return 'desktop';
      default:
        return 'globe';
    }
  };

  const getStatusColor = () => {
    return isOnline ? '#28a745' : '#dc3545';
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    
    switch (networkType) {
      case 'wifi':
        return 'WiFi';
      case 'cellular':
        return 'Mobile';
      case 'ethernet':
        return 'Ethernet';
      default:
        return 'Online';
    }
  };

  return (
    <XStack ai="center" gap={6}>
      <YStack w={8} h={8} br={4} bg={getStatusColor()} />
      {showText && (
        <>
          <Ionicons 
            name={getNetworkIcon() as any} 
            size={12} 
            color={getStatusColor()} 
          />
          <Text 
            fontSize={12} 
            color={getStatusColor()} 
            fontWeight="500"
          >
            {getStatusText()}
          </Text>
        </>
      )}
    </XStack>
  );
}