import React from 'react';
import { YStack, XStack, Text, Button } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';

interface OfflineScreenProps {
  onRetry?: () => void;
}

export default function OfflineScreen({ onRetry }: OfflineScreenProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      Alert.alert('Retrying', 'Checking network connection...');
    }
  };

  return (
    <YStack f={1} bg="#f8f9fa" ai="center" jc="center" px={20}>
      <YStack ai="center" gap={20}>
        {/* Offline Icon */}
        <YStack 
          w={100} 
          h={100} 
          br={50} 
          bg="#ff6b6b20" 
          ai="center" 
          jc="center"
          mb={20}
        >
          <Ionicons name="cloud-offline" size={48} color="#ff6b6b" />
        </YStack>

        {/* Title */}
        <Text fontSize={24} fontWeight="700" color="#333" textAlign="center">
          No Internet Connection
        </Text>

        {/* Description */}
        <Text fontSize={16} color="#6c757d" textAlign="center" lineHeight={24}>
          Please check your internet connection and try again. Some features may not work properly while offline.
        </Text>

        {/* Connection Status */}
        <YStack bg="white" br={12} p={16} w="100%" maxWidth={300}>
          <XStack ai="center" gap={12} mb={12}>
            <YStack w={12} h={12} br={6} bg="#ff6b6b" />
            <Text fontSize={14} fontWeight="600" color="#333">
              Connection Status
            </Text>
          </XStack>
          
          <YStack gap={8}>
            <XStack ai="center" jc="space-between">
              <Text fontSize={12} color="#6c757d">WiFi</Text>
              <Text fontSize={12} color="#ff6b6b" fontWeight="500">Disconnected</Text>
            </XStack>
            <XStack ai="center" jc="space-between">
              <Text fontSize={12} color="#6c757d">Mobile Data</Text>
              <Text fontSize={12} color="#ff6b6b" fontWeight="500">Unavailable</Text>
            </XStack>
          </YStack>
        </YStack>

        {/* Action Buttons */}
        <YStack gap={12} w="100%" maxWidth={300}>
          <Button 
            bg="#4a8a28" 
            h={50} 
            br={12} 
            onPress={handleRetry}
          >
            <XStack ai="center" gap={8}>
              <Ionicons name="refresh" size={18} color="white" />
              <Text fontSize={16} fontWeight="600" color="white">
                Try Again
              </Text>
            </XStack>
          </Button>

          <Button 
            bg="white" 
            borderWidth={1} 
            borderColor="#e0e0e0" 
            h={50} 
            br={12} 
            onPress={() => Alert.alert('Offline Mode', 'You can still browse cached content and view previously loaded data.')}
          >
            <Text fontSize={16} fontWeight="600" color="#6c757d">
              Continue Offline
            </Text>
          </Button>
        </YStack>

        {/* Tips */}
        <YStack bg="#fff3cd" br={12} p={16} w="100%" maxWidth={300} mt={20}>
          <XStack ai="center" gap={8} mb={8}>
            <Ionicons name="bulb" size={16} color="#856404" />
            <Text fontSize={12} fontWeight="600" color="#856404">
              Tips to reconnect:
            </Text>
          </XStack>
          
          <YStack gap={4}>
            <Text fontSize={11} color="#856404">• Check your WiFi connection</Text>
            <Text fontSize={11} color="#856404">• Enable mobile data if available</Text>
            <Text fontSize={11} color="#856404">• Move to an area with better signal</Text>
            <Text fontSize={11} color="#856404">• Restart your device if needed</Text>
          </YStack>
        </YStack>
      </YStack>
    </YStack>
  );
}