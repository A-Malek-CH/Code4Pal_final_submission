// assets/ui/components/missionstatus/MissionActionButtons.js
import React from 'react';
import { YStack, Button, Text } from 'tamagui';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function MissionActionButtons({ onUploadImage, onMissionComplete, completed }) {
    return (
        <YStack mt={20} ai="center" w="100%" gap={30}>
            <Button
                w="100%"
                h={60}
                mb={10}
                bg="#abd2aec6"
                color="#16621aff"
                onPress={onUploadImage}
            >
                <Icon name="image-plus" size={24} color="#16621aff" /> Upload a picture
                to confirm
            </Button>

            {!completed && (
                <Button
                    w="100%"
                    h={60}
                    mb={10}
                    bg="#16621aff"
                    color="white"
                    fontSize={16}
                    onPress={onMissionComplete}
                >
                    Mission Completed
                </Button>
            )}
        </YStack>
    );
}