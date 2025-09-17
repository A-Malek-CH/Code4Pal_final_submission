import React from 'react';
import { Alert, Linking, Platform } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

export interface SupportOption {
  icon: string;
  title: string;
  subtitle: string;
  action: () => void;
  color: string;
}

interface SupportOptionsProps {
  onExternalLink?: (url: string, title: string) => void;
}

export default function SupportOptions({ onExternalLink }: SupportOptionsProps) {
  const openExternalLink = onExternalLink || ((url: string, title: string) => {
    Alert.alert(
      'External Link',
      `This will open ${title} in your browser. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open', onPress: () => Linking.openURL(url) }
      ]
    );
  });

  const supportOptions: SupportOption[] = [
    {
      icon: 'mail',
      title: 'Email Support',
      subtitle: 'Get help via email support@communityhelper.com',
      color: '#4285f4',
      action: () => {
        Linking.openURL('mailto:support@communityhelper.com').catch(() =>
          Alert.alert('Error', 'Could not open email client')
        );
      },
    },
    {
      icon: 'call',
      title: 'Phone Support',
      subtitle: 'Call us at +1 (555) 123-4567',
      color: '#34a853',
      action: () => {
        const phoneNumber = Platform.OS === 'ios' ? 'telprompt:+15551234567' : 'tel:+15551234567';
        Linking.openURL(phoneNumber).catch(() =>
          Alert.alert('Error', 'Could not make phone call')
        );
      },
    },
    {
      icon: 'chatbubbles',
      title: 'Live Chat',
      subtitle: 'Chat with our support team (Mon-Fri 9AM-5PM)',
      color: '#ea4335',
      action: () => {
        openExternalLink('https://communityhelper.com/chat', 'Live Chat');
      },
    },
    {
      icon: 'help-circle',
      title: 'Help Center',
      subtitle: 'Browse articles and tutorials',
      color: '#fbbc04',
      action: () => {
        openExternalLink('https://help.communityhelper.com', 'Help Center');
      },
    },
    {
      icon: 'document-text',
      title: 'User Guide',
      subtitle: 'Complete guide to using the app',
      color: '#9c27b0',
      action: () => {
        openExternalLink('https://communityhelper.com/guide', 'User Guide');
      },
    },
    {
      icon: 'bug',
      title: 'Report Bug',
      subtitle: 'Found a bug? Let us know',
      color: '#ff5722',
      action: () => {
        openExternalLink('https://communityhelper.com/bug-report', 'Bug Report');
      },
    },
    {
      icon: 'bulb',
      title: 'Feature Request',
      subtitle: 'Suggest new features',
      color: '#ff9800',
      action: () => {
        openExternalLink('https://communityhelper.com/feature-request', 'Feature Request');
      },
    },
    {
      icon: 'shield-checkmark',
      title: 'Privacy Policy',
      subtitle: 'How we protect your data',
      color: '#607d8b',
      action: () => {
        openExternalLink('https://communityhelper.com/privacy', 'Privacy Policy');
      },
    },
    {
      icon: 'document',
      title: 'Terms of Service',
      subtitle: 'App terms and conditions',
      color: '#795548',
      action: () => {
        openExternalLink('https://communityhelper.com/terms', 'Terms of Service');
      },
    },
  ];

  return (
    <YStack gap={16}>
      <Text fontSize={20} fontWeight="700" color="#333" mb={8}>
        Get Help
      </Text>
      
      {supportOptions.map((option, index) => (
        <TouchableOpacity key={index} onPress={option.action}>
          <XStack 
            bg="white" 
            p={20} 
            borderRadius={16} 
            ai="center" 
            borderWidth={1}
            borderColor="#e5e5e5"
            gap={16}
          >
            <YStack 
              w={48} 
              h={48} 
              borderRadius={24} 
              bg={option.color} 
              ai="center" 
              jc="center"
            >
              <Ionicons name={option.icon as any} size={24} color="white" />
            </YStack>
            
            <YStack f={1} gap={2}>
              <Text fontSize={16} fontWeight="600" color="#333">
                {option.title}
              </Text>
              <Text fontSize={14} color="#666">
                {option.subtitle}
              </Text>
            </YStack>
            
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </XStack>
        </TouchableOpacity>
      ))}
    </YStack>
  );
}