// assets/ui/components/missionstatus/MissionStatusHeader.js
import React from 'react';
import { XStack, Button } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

export default function MissionStatusHeader({ onBackPress }) {
    return (
        <XStack w="100%" jc="space-between" ai="center" mt={20}>
            <Button
                w={50}
                h={50}
                p={0}
                backgroundColor="#ffffffff"
                color="#000000ff"
                borderColor="#d7d7d7ff"
                onPress={onBackPress}
            >
                <Ionicons name="arrow-back" size={24} color="#16621aff" />
            </Button>
        </XStack>
    );
}