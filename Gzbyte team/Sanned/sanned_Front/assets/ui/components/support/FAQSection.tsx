import React from 'react';
import { TouchableOpacity } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  expanded?: boolean;
}

interface FAQSectionProps {
  faqItems: FAQItem[];
  expandedFAQ: string | null;
  onToggleFAQ: (faqId: string) => void;
}

export default function FAQSection({ faqItems, expandedFAQ, onToggleFAQ }: FAQSectionProps) {
  return (
    <YStack gap={16}>
      <Text fontSize={20} fontWeight="700" color="#333" mb={8}>
        Frequently Asked Questions
      </Text>
      
      {faqItems.map((faq) => (
        <YStack key={faq.id} bg="white" borderRadius={16} overflow="hidden" borderWidth={1} borderColor="#e5e5e5">
          <TouchableOpacity onPress={() => onToggleFAQ(faq.id)}>
            <XStack p={20} ai="center" jc="space-between">
              <Text fontSize={16} fontWeight="600" color="#333" f={1} mr={16}>
                {faq.question}
              </Text>
              <Ionicons
                name={expandedFAQ === faq.id ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#666"
              />
            </XStack>
          </TouchableOpacity>
          
          {expandedFAQ === faq.id && (
            <YStack px={20} pb={20}>
              <YStack h={1} bg="#f0f0f0" mb={16} />
              <Text fontSize={15} color="#666" lineHeight={22}>
                {faq.answer}
              </Text>
            </YStack>
          )}
        </YStack>
      ))}
    </YStack>
  );
}