import React from 'react';
import { YStack, XStack, Text, Button } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface SettingsHeaderProps {
  onGoBack: () => void;
}

export default function SettingsHeader({ onGoBack }: SettingsHeaderProps) {
  return (
    <YStack pt={50} pb={20} px={20} bg="white">
      <XStack ai="center" jc="space-between">
        <Button unstyled onPress={onGoBack} p={8}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </Button>
        <Text fontSize={18} fontWeight="700" color="#333">Settings</Text>
        <YStack w={24} />
      </XStack>
    </YStack>
  );
}