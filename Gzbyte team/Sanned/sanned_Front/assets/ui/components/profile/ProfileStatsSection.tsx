// assets/ui/components/profile/ProfileStatsSection.js
import React from 'react';
import { YStack, XStack, Text, Card, Circle } from 'tamagui';

export default function ProfileStatsSection({ missions, completed, peopleHelped }) {
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
            <Text fontSize={20} fontWeight="800" mb={20} textAlign="center" color="#333">Activity Overview</Text>
            <XStack jc="space-between">
                <YStack ai="center" f={1}>
                    <Circle size={60} bg="#4a8a28" ai="center" jc="center" mb={10}>
                        <Text fontSize={24} fontWeight="800" color="white">{missions}</Text>
                    </Circle>
                    <Text fontSize={14} fontWeight="600" color="#666">Missions</Text>
                </YStack>
                <YStack ai="center" f={1}>
                    <Circle size={60} bg="#6ba83a" ai="center" jc="center" mb={10}>
                        <Text fontSize={24} fontWeight="800" color="white">{completed}</Text>
                    </Circle>
                    <Text fontSize={14} fontWeight="600" color="#666">Completed</Text>
                </YStack>
                <YStack ai="center" f={1}>
                    <Circle size={60} bg="#8bc34a" ai="center" jc="center" mb={10}>
                        <Text fontSize={24} fontWeight="800" color="white">{peopleHelped}</Text>
                    </Circle>
                    <Text fontSize={14} fontWeight="600" color="#666">People Helped</Text>
                </YStack>
            </XStack>
        </Card>
    )
}