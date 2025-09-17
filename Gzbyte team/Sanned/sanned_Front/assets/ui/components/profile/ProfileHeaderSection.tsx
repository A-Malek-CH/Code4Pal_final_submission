// assets/ui/components/profile/ProfileHeaderSection.js
import React from 'react';
import { YStack, Text, Image, Circle } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileHeaderSection({ name, username, bio, profileImage }) {
    return (
        <YStack>
            <LinearGradient
                colors={['#4a8a28', '#6ba83a']}
                style={{ 
                    paddingTop: 60, 
                    paddingBottom: 40, 
                    paddingHorizontal: 20,
                    borderBottomLeftRadius: 30,
                    borderBottomRightRadius: 30 
                }}
            >
                <YStack ai="center" gap={15}>
                    <YStack ai="center" pos="relative">
                        <Circle size={140} bg="white" p={4}>
                            <Image
                                source={profileImage}
                                width={132}
                                height={132}
                                borderRadius={66}
                            />
                        </Circle>
                    </YStack>
                    
                    <YStack ai="center" gap={5}>
                        <Text fontSize={26} fontWeight="800" color="white">{name}</Text>
                        <Text fontSize={16} color="rgba(255,255,255,0.8)">{username}</Text>
                        <Text fontSize={15} color="rgba(255,255,255,0.9)" textAlign="center" mt={8} maxWidth={250}>
                            {bio}
                        </Text>
                    </YStack>
                </YStack>
            </LinearGradient>
        </YStack>
    );
}