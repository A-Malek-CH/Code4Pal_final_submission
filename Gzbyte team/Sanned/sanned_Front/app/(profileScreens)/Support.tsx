import React, { useState } from 'react';
import { Alert, Linking, TouchableOpacity } from 'react-native';
import { YStack, XStack, Text, ScrollView } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';

// Components
import FAQSection, { FAQItem } from '~/assets/ui/components/support/FAQSection';
import ContactForm from '~/assets/ui/components/support/ContactForm';
import SupportOptions from '~/assets/ui/components/support/SupportOptions';

export default function SupportScreen() {
  const [activeTab, setActiveTab] = useState<'help' | 'contact' | 'faq'>('help');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'How do I create a mission?',
      answer: 'Tap the "+" button on the home screen, fill out the mission details including title, description, location, and type. Once submitted, your mission will be reviewed and published.'
    },
    {
      id: '2',
      question: 'How do I find missions near me?',
      answer: 'Go to the Discover tab and use the map view or list view to see missions in your area. You can filter by mission type and distance.'
    },
    {
      id: '3',
      question: 'What types of missions are available?',
      answer: 'We have three main types: Donations (giving items), Exchanges (trading items), and Services (offering help or skills).'
    },
    {
      id: '4',
      question: 'How do I join a mission?',
      answer: 'Find a mission you want to join, tap on it to view details, and tap the "Join Mission" button. The mission creator will receive your request.'
    },
    {
      id: '5',
      question: 'Is my personal information safe?',
      answer: 'Yes, we take privacy seriously. Your personal information is encrypted and only shared with mission participants when necessary.'
    },
    {
      id: '6',
      question: 'How do I report inappropriate content?',
      answer: 'Tap the three dots menu on any mission or user profile and select "Report". We review all reports within 24 hours.'
    },
    {
      id: '7',
      question: 'Can I cancel a mission I created?',
      answer: 'Yes, go to your profile > My Missions, find the mission you want to cancel, and tap "Cancel Mission". Participants will be notified.'
    },
    {
      id: '8',
      question: 'How do I update my profile?',
      answer: 'Go to the Profile tab and tap "Edit Profile" to update your information, avatar, bio, and skills.'
    },
  ];

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const openExternalLink = (url: string, title: string) => {
    Alert.alert(
      'External Link',
      `This will open ${title} in your browser. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open', onPress: () => Linking.openURL(url) }
      ]
    );
  };

  const TabButton = ({ id, label }: { id: 'help' | 'contact' | 'faq', label: string }) => (
    <TouchableOpacity onPress={() => setActiveTab(id)} style={{ flex: 1 }}>
      <YStack
        bg={activeTab === id ? '#4a8a28' : 'transparent'}
        py={12}
        ai="center"
        borderRadius={8}
      >
        <Text
          fontSize={14}
          fontWeight="600"
          color={activeTab === id ? 'white' : '#666'}
        >
          {label}
        </Text>
      </YStack>
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'help':
        return <SupportOptions onExternalLink={openExternalLink} />;
      case 'contact':
        return <ContactForm />;
      case 'faq':
        return (
          <FAQSection
            faqItems={faqItems}
            expandedFAQ={expandedFAQ}
            onToggleFAQ={toggleFAQ}
          />
        );
      default:
        return <SupportOptions onExternalLink={openExternalLink} />;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <XStack
        bg="white"
        h={60}
        ai="center"
        jc="space-between"
        px={20}
        borderBottomWidth={1}
        borderBottomColor="#e5e5e5"
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <Text fontSize={18} fontWeight="600" color="#333">
          Support
        </Text>

        <YStack w={24} /> {/* Spacer for center alignment */}
      </XStack>

      {/* Tab Navigation */}
      <XStack bg="white" px={20} py={12} borderBottomWidth={1} borderBottomColor="#e5e5e5" gap={8}>
        <TabButton id="help" label="Get Help" />
        <TabButton id="contact" label="Contact" />
        <TabButton id="faq" label="FAQ" />
      </XStack>

      {/* Content */}
      <ScrollView f={1} showsVerticalScrollIndicator={false}>
        <YStack px={20} py={24}>
          {renderContent()}
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}