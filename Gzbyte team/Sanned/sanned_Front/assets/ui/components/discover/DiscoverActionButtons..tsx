// assets/ui/components/discover/DiscoverActionButtons.js
import React from 'react';
import { XStack, Button, Text } from 'tamagui';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';

interface DiscoverActionButtonsProps {
    onDecline: () => void;
    onAccept: () => void;
    onDonate: () => void;
    onBookmark: () => void;
    currentMission?: any;
}

export default function DiscoverActionButtons({ onDecline, onAccept, onDonate, onBookmark, currentMission }: DiscoverActionButtonsProps) {
    return (
        <XStack mt={40} ai="center" jc="space-between" w="100%">
            {/* Left button - Decline (X) */}
            <Button w={80} h={80} bg="#F6F6F6" borderRadius={40} p={0} onPress={onDecline}>
                <Ionicons name="close" size={40} color="red" />
            </Button>

            {/* Middle button - Donate (Big button) */}
            <Button
                w={100}
                h={100}
                bg="#8b5cf6"
                borderRadius={50}
                p={0}
                onPress={onDonate}
                pressStyle={{ scale: 0.95 }}
            >
                <Ionicons name="card" size={40} color="white" />
            </Button>

            {/* Right button - Accept Mission (✓) */}
            <Button w={80} h={80} bg="#4a8a28ff" borderRadius={40} p={0} onPress={onAccept}>
                <Ionicons name="checkmark" size={40} color="white" />
            </Button>
        </XStack>
    );
}