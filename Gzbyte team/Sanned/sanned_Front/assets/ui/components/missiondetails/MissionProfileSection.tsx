// assets/ui/components/missiondetails/MissionProfileSection.js
import React from 'react';
import { XStack, YStack, Text, Image } from 'tamagui';

export default function MissionProfileSection({ profile, name, username }) {
    return (
        <XStack ai="center" gap={12}>
            <Image 
                source={profile}
                width={67}
                height={67}
                borderRadius={33.5}
            />
            <YStack>
                <Text fontSize={24} fontWeight="700">{name}</Text>
                <Text fontSize={14} fontWeight="400" color="$gray10">{username}</Text>
            </YStack>
        </XStack>
    );
}