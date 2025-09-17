// assets/ui/components/missiondetails/MissionHeader.js
import React from 'react';
import { ImageBackground } from 'react-native';
import { XStack, Button } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

export default function MissionHeader({ bgimage, onBackPress }) {
    return (
        <ImageBackground 
            source={bgimage} 
            style={{ width: '100%', height: 415 }} 
            resizeMode="cover"
        >
            <XStack w="100%" jc="space-between" ai="center" mt={20} mr={10} ml={10}>
                <Button
                    w={50}
                    h={50}
                    p={0}
                    backgroundColor="#ffffff05"
                    color="#000000ff"
                    borderColor="#d7d7d7ff"
                    onPress={onBackPress}
                >
                    <Ionicons name="arrow-back" size={24} color="#ffffffff" />
                </Button>
            </XStack>
        </ImageBackground>
    );
}