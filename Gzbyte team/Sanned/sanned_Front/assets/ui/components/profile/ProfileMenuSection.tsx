// assets/ui/components/profile/ProfileMenuSection.js
import React from 'react';
import { YStack, XStack, Text, Card, Button, Circle } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileMenuSection({ menuItems, onMenuItemPress }) {
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
            <Text fontSize={20} fontWeight="800" mb={20} color="#333">Quick Actions</Text>
            
            <YStack gap={4}>
                {menuItems.map((item, index) => (
                    <Button
                        key={index}
                        bg="transparent"
                        h={60}
                        br={12}
                        jc="flex-start"
                        px={0}
                        pressStyle={{ bg: "rgba(74, 138, 40, 0.05)" }}
                        onPress={() => onMenuItemPress(item.route)}
                    >
                        <XStack ai="center" gap={15} w="100%">
                            <Circle size={45} bg="rgba(74, 138, 40, 0.1)" ai="center" jc="center">
                                <Ionicons name={item.icon} size={22} color={item.color} />
                            </Circle>
                            <Text fontSize={16} fontWeight="600" color="#333" f={1}>
                                {item.label}
                            </Text>
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </XStack>
                    </Button>
                ))}
            </YStack>
        </Card>
    );
}