// assets/ui/components/missiondetails/AboutSection.js
import React from 'react';
import { YStack, XStack, Text } from 'tamagui';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function AboutSection({ description, urgency }) {
    const getUrgencyColor = (urgency) => {
        switch (urgency) {
            case 'urgent': return '#ef4444';
            case 'soon': return '#f59e0b';
            case 'flexible': return '#10b981';
            default: return '#ef4444';
        }
    };

    return (
        <YStack gap={6}>
            <XStack ai="center" jc="space-between">
                <Text fontSize={16} fontWeight="700">About</Text>
                <XStack ai="center" gap={4}>
                    <Icon name="alarm-light-outline" size={14} color={getUrgencyColor(urgency)} />
                    <Text fontSize={12} color={getUrgencyColor(urgency)} fontWeight="700" textTransform="capitalize">
                        {urgency}
                    </Text>
                </XStack>
            </XStack>
            <Text fontSize={14} color="$gray11" lineHeight={16}>
                {description}
            </Text>
        </YStack>
    );
}