// assets/ui/components/profile/ProfileActionButtons.js
import React from 'react';
import { XStack, Button, Text } from 'tamagui';

export default function ProfileActionButtons({ onEditProfile, onShare }) {
    return (
        <XStack gap={12} mb={25} jc="center">
            <Button
                bg="white"
                borderColor="#4a8a28"
                borderWidth={2}
                h={48}
                px={25}
                br={24}
                flex={1}
                onPress={onEditProfile}
                shadowColor="#000"
                shadowOpacity={0.1}
                shadowRadius={8}
                shadowOffset={{ width: 0, height: 4 }}
            >
                <Text color="#4a8a28" fontWeight="700" fontSize={15}>Edit Profile</Text>
            </Button>
            <Button
                bg="#4a8a28"
                h={48}
                px={25}
                br={24}
                flex={1}
                onPress={onShare}
                shadowColor="#4a8a28"
                shadowOpacity={0.3}
                shadowRadius={8}
                shadowOffset={{ width: 0, height: 4 }}
            >
                <Text color="white" fontWeight="700" fontSize={15}>Share</Text>
            </Button>
        </XStack>
    );
}