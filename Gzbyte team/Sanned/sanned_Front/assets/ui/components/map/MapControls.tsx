// assets/ui/components/map/MapControls.js
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { YStack } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

export default function MapControls({ onLocationPress, onAddMarkerPress }) {
    return (
        <YStack pos="absolute" top={20} right={20} gap={10}>
            <TouchableOpacity style={styles.controlButton} onPress={onLocationPress}>
                <Ionicons name="locate" size={20} color="#4a8a28" />
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.controlButton, { backgroundColor: '#4a8a28' }]}
                onPress={onAddMarkerPress}
            >
                <Ionicons name="add" size={20} color="white" />
            </TouchableOpacity>
        </YStack>
    );
}

const styles = StyleSheet.create({
    controlButton: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});