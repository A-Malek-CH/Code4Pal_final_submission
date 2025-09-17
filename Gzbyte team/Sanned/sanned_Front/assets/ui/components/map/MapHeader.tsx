// assets/ui/components/map/MapHeader.js
import React from 'react';
import { TouchableOpacity, TextInput, ActivityIndicator, StyleSheet } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

export default function MapHeader({ 
    onBackPress, 
    onLocationPress, 
    searchQuery, 
    setSearchQuery, 
    onSearch, 
    isSearching 
}) {
    return (
        <YStack bg="#4a8a28" pt={50} pb={20} px={20}>
            <XStack ai="center" jc="space-between" mb={15}>
                <TouchableOpacity onPress={onBackPress}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text fontSize={20} fontWeight="800" color="white">Mission Map</Text>
                <TouchableOpacity onPress={onLocationPress}>
                    <Ionicons name="locate" size={24} color="white" />
                </TouchableOpacity>
            </XStack>

            {/* Search Bar */}
            <XStack gap={10} ai="center">
                <XStack f={1} ai="center" bg="white" br={25} px={15} h={45}>
                    <Ionicons name="search" size={20} color="#666" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for locations..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={onSearch}
                    />
                </XStack>
                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={onSearch}
                    disabled={isSearching}
                >
                    {isSearching ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Ionicons name="search" size={20} color="white" />
                    )}
                </TouchableOpacity>
            </XStack>
        </YStack>
    );
}

const styles = StyleSheet.create({
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    searchButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 22.5,
        width: 45,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
    },
});