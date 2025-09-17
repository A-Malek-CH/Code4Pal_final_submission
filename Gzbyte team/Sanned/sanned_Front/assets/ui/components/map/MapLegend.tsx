// assets/ui/components/map/MapLegend.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { YStack, XStack, Text, Card } from 'tamagui';

export default function MapLegend() {
    return (
        <Card 
            pos="absolute" 
            bottom={20} 
            left={20} 
            bg="white" 
            p={15} 
            br={12} 
            shadowColor="#000" 
            shadowOpacity={0.1} 
            shadowRadius={8}
        >
            <Text fontSize={14} fontWeight="700" mb={10}>Legend</Text>
            <YStack gap={5}>
                <XStack ai="center" gap={8}>
                    <View style={[styles.legendDot, { backgroundColor: '#ff4757' }]} />
                    <Text fontSize={12}>Urgent</Text>
                </XStack>
                <XStack ai="center" gap={8}>
                    <View style={[styles.legendDot, { backgroundColor: '#ffa726' }]} />
                    <Text fontSize={12}>Soon</Text>
                </XStack>
                <XStack ai="center" gap={8}>
                    <View style={[styles.legendDot, { backgroundColor: '#4a8a28' }]} />
                    <Text fontSize={12}>Flexible</Text>
                </XStack>
            </YStack>
        </Card>
    );
}

const styles = StyleSheet.create({
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
});