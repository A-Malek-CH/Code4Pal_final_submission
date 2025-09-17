// assets/ui/components/profile/ProfileContactSection.js
import React from 'react';
import { YStack, XStack, Text, Card, Circle } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileContactSection({ email, phone, location }) {
    return (
        <Card 
            bg="white" 
            p={20} 
            br={20} 
            mb={25} 
            shadowColor="#000" 
            shadowOpacity={0.05} 
            shadowRadius={15} 
            shadowOffset={{ width: 0, height: 5 }}
        >
            <Text fontSize={20} fontWeight="800" mb={20} color="#333">Contact Info</Text>
            
            <YStack gap={18}>
                <XStack ai="center" gap={15}>
                    <Circle size={45} bg="rgba(74, 138, 40, 0.1)" ai="center" jc="center">
                        <Ionicons name="mail" size={22} color="#4a8a28" />
                    </Circle>
                    <YStack f={1}>
                        <Text fontSize={12} color="#999" fontWeight="600">EMAIL</Text>
                        <Text fontSize={16} color="#333" fontWeight="500">{email}</Text>
                    </YStack>
                </XStack>

                <XStack ai="center" gap={15}>
                    <Circle size={45} bg="rgba(74, 138, 40, 0.1)" ai="center" jc="center">
                        <Ionicons name="call" size={22} color="#4a8a28" />
                    </Circle>
                    <YStack f={1}>
                        <Text fontSize={12} color="#999" fontWeight="600">PHONE</Text>
                        <Text fontSize={16} color="#333" fontWeight="500">{phone}</Text>
                    </YStack>
                </XStack>

                <XStack ai="center" gap={15}>
                    <Circle size={45} bg="rgba(74, 138, 40, 0.1)" ai="center" jc="center">
                        <Ionicons name="location" size={22} color="#4a8a28" />
                    </Circle>
                    <YStack f={1}>
                        <Text fontSize={12} color="#999" fontWeight="600">LOCATION</Text>
                        <Text fontSize={16} color="#333" fontWeight="500">{location}</Text>
                    </YStack>
                </XStack>
            </YStack>
        </Card>
    );
}