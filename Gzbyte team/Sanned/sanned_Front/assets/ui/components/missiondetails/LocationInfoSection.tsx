// assets/ui/components/missiondetails/LocationInfoSection.js
import React from 'react';
import { YStack, XStack, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

export default function LocationInfoSection({ location, distance }) {
    return (
        <YStack gap={6}>
            <Text fontSize={16} fontWeight="700">Location</Text>
            <XStack ai="center" jc="space-between">
                <Text fontSize={13} color="$gray11">{location}</Text>
                <XStack w={61} h={34} ai="center" gap={4} bg={"#5282410d"} p={5} br={7}>
                    <Ionicons name="location-outline" size={12} color="#528241ff" />
                    <Text fontSize={12} color="#528241ff">{distance} km</Text>
                </XStack>
            </XStack>
        </YStack>
    );
}