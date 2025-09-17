// assets/ui/components/missionstatus/MissionCompletionToast.tsx
import React from 'react';
import { YStack, XStack, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'tamagui/linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function MissionCompletionToast() {
    return (
        <Animated.View
            entering={FadeInUp.delay(100)}
            style={[{ width: '100%', alignItems: 'center' }]}
        >
            <LinearGradient
                borderRadius={12}
                p={12}
                ai="center"
                colors={['rgba(15, 157, 88, 0.94)', '#1E252B']}
                start={[0, 0.3]}
                end={[0.3, 0.5]}
            >
                <XStack ai="center" space="$3">
                    <YStack pos="relative" jc="center" ai="center">
                        <YStack
                            pos="absolute"
                            w={50}
                            h={50}
                            borderRadius={25}
                            bg="rgba(15, 157, 88, 0.21)"
                        />
                        <YStack
                            borderRadius={9999}
                            p={8}
                            jc="center"
                            ai="center"
                            bg="#0F9D58"
                        >
                            <Ionicons name="checkmark" size={20} color="#1C1F24" />
                        </YStack>
                    </YStack>

                    <Text fontSize={18} fontWeight="600" color="white">
                        Mission Completed
                    </Text>
                </XStack>
            </LinearGradient>
        </Animated.View>
    );
}
