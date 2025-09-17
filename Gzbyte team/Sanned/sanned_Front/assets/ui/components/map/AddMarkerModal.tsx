// assets/ui/components/map/AddMarkerModal.js
import React from 'react';
import { Modal, View, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { YStack, XStack, Text, Card, Button, Input, ScrollView } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

export default function AddMarkerModal({
    visible,
    onClose,
    newMarker,
    setNewMarker,
    onAddMarker,
    getMarkerColor
}) {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <Card bg="white" p={20} br={20} m={20} maxHeight={height * 0.8}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <YStack gap={20}>
                            <XStack ai="center" jc="space-between">
                                <Text fontSize={20} fontWeight="800">Add Mission</Text>
                                <TouchableOpacity onPress={onClose}>
                                    <Ionicons name="close" size={24} color="#666" />
                                </TouchableOpacity>
                            </XStack>

                            <YStack gap={15}>
                                <YStack gap={8}>
                                    <Text fontSize={14} fontWeight="600">Mission Title *</Text>
                                    <Input
                                        placeholder="Enter mission title"
                                        value={newMarker.title}
                                        onChangeText={(text) => setNewMarker({ ...newMarker, title: text })}
                                        borderColor="#e5e5e5"
                                        focusStyle={{ borderColor: '#4a8a28' }}
                                    />
                                </YStack>

                                <YStack gap={8}>
                                    <Text fontSize={14} fontWeight="600">Description</Text>
                                    <Input
                                        placeholder="Mission description (optional)"
                                        value={newMarker.description}
                                        onChangeText={(text) => setNewMarker({ ...newMarker, description: text })}
                                        borderColor="#e5e5e5"
                                        focusStyle={{ borderColor: '#4a8a28' }}
                                    />
                                </YStack>

                                <YStack gap={8}>
                                    <Text fontSize={14} fontWeight="600">Type</Text>
                                    <XStack gap={10}>
                                        {['volunteer', 'paid', 'sponsor'].map((type) => (
                                            <Button
                                                key={type}
                                                flex={1}
                                                bg={newMarker.type === type ? '#4a8a28' : 'white'}
                                                borderColor={newMarker.type === type ? '#4a8a28' : '#e5e5e5'}
                                                borderWidth={2}
                                                onPress={() => setNewMarker({ ...newMarker, type })}
                                            >
                                                <Text
                                                    color={newMarker.type === type ? 'white' : '#666'}
                                                    textTransform="capitalize"
                                                >
                                                    {type}
                                                </Text>
                                            </Button>
                                        ))}
                                    </XStack>
                                </YStack>

                                <YStack gap={8}>
                                    <Text fontSize={14} fontWeight="600">Urgency</Text>
                                    <XStack gap={10}>
                                        {['urgent', 'soon', 'flexible'].map((urgency) => (
                                            <Button
                                                key={urgency}
                                                flex={1}
                                                bg={newMarker.urgency === urgency ? getMarkerColor(urgency) : 'white'}
                                                borderColor={newMarker.urgency === urgency ? getMarkerColor(urgency) : '#e5e5e5'}
                                                borderWidth={2}
                                                onPress={() => setNewMarker({ ...newMarker, urgency })}
                                            >
                                                <Text
                                                    color={newMarker.urgency === urgency ? 'white' : getMarkerColor(urgency)}
                                                    textTransform="capitalize"
                                                >
                                                    {urgency}
                                                </Text>
                                            </Button>
                                        ))}
                                    </XStack>
                                </YStack>
                            </YStack>

                            <Button
                                bg="#4a8a28"
                                h={50}
                                onPress={onAddMarker}
                                mt={10}
                            >
                                <Text color="white" fontWeight="700">Add Mission</Text>
                            </Button>
                        </YStack>
                    </ScrollView>
                </Card>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
    },
});