import React from 'react';
import { YStack, Text } from 'tamagui';

export default function SettingsFooter() {
  return (
    <YStack ai="center" py={20}>
      <Text fontSize={12} color="#6c757d">Version 2.1.0 (Build 2024.09.13)</Text>
      <Text fontSize={12} color="#6c757d" mt={4}>Made with ❤️ for the community</Text>
    </YStack>
  );
}