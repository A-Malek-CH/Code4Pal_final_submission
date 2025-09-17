// assets/ui/components/missiondetails/MiniMapSection.js
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

export default function MiniMapSection({ 
    coordinates, 
    location, 
    createMiniMapHTML, 
    onMapMessage, 
    onViewFullMap 
}) {
    return (
        <YStack gap={8}>
            <XStack ai="center" jc="space-between">
                <Text fontSize={16} fontWeight="700">Location Map</Text>
                <TouchableOpacity onPress={onViewFullMap}>
                    <XStack ai="center" gap={4} bg={"#5282410d"} px={12} py={6} br={20}>
                        <Ionicons name="expand-outline" size={16} color="#528241ff" />
                        <Text fontSize={12} color="#528241ff" fontWeight="600">View Full Map</Text>
                    </XStack>
                </TouchableOpacity>
            </XStack>
            
            <YStack 
                h={200} 
                br={12} 
                pos="relative"
                ov="hidden"
                shadowColor="#000"
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={0.1}
                shadowRadius={4}
            >
                <WebView
                    source={{ html: createMiniMapHTML() }}
                    style={{ flex: 1 }}
                    onMessage={onMapMessage}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    scrollEnabled={false}
                />
                
                {/* Overlay with coordinates info */}
                <XStack 
                    pos="absolute" 
                    bottom={8} 
                    right={8}
                    bg="rgba(255,255,255,0.9)"
                    px={8}
                    py={4}
                    br={6}
                    ai="center"
                    gap={4}
                >
                    <Ionicons name="navigate" size={12} color="#528241ff" />
                    <Text fontSize={10} color="#528241ff" fontWeight="600">
                        {coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)}
                    </Text>
                </XStack>

                {/* Tap to expand hint */}
                <XStack 
                    pos="absolute" 
                    top={8} 
                    left={8}
                    bg="rgba(82, 130, 65, 0.9)"
                    px={8}
                    py={4}
                    br={6}
                    ai="center"
                    gap={4}
                >
                    <Ionicons name="hand-left" size={12} color="white" />
                    <Text fontSize={10} color="white" fontWeight="600">
                        Tap to view full map
                    </Text>
                </XStack>
            </YStack>
        </YStack>
    );
}