// assets/ui/components/discover/DiscoverFiltersModal.js
import React from 'react';
import { Text, YStack, XStack, Button, Sheet, Slider } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

export default function DiscoverFiltersModal({
    visible,
    onClose,
    distance,
    setDistance,
    paymentType,
    setPaymentType,
    urgency,
    setUrgency
}) {
    const pillButton = (label, selected, onPress) => (
        <Button
            key={label}
            onPress={onPress}
            bg={selected ? '#4a8a28' : 'white'}
            h={'100%'}
            w={'33.33%'}
            px={20}
            py={8}
        >
            <Text color={selected ? 'white' : 'black'} fontSize={16}>{label}</Text>
        </Button>
    );

    return (
        <Sheet modal open={visible} onOpenChange={onClose} snapPoints={[75]} dismissOnSnapToBottom>
            <Sheet.Frame bg="white" br={20} p={20}>
                <YStack gap={25}>
                    {/* Header */}
                    <XStack ai="center">
                        <Text flex={1} textAlign="center" fontSize={35} fontWeight="bold">
                            Filters
                        </Text>
                        <Button unstyled onPress={onClose}>
                            <Text color="#4a8a28">Clear</Text>
                        </Button>
                    </XStack>

                    {/* Payment Type */}
                    <Text fontWeight="700" fontSize={18}>Payment Type</Text>
                    <XStack borderColor={"#E3E3E3"} borderWidth={1} borderRadius={12} h={60}>
                        {pillButton('Volunteer', paymentType === 'Volunteer', () => setPaymentType('Volunteer'))}
                        {pillButton('Paid', paymentType === 'Paid', () => setPaymentType('Paid'))}
                        {pillButton('Sponsor', paymentType === 'Sponsor', () => setPaymentType('Sponsor'))}
                    </XStack>

                    {/* Location */}
                    <YStack gap={10}>
                        <Text fontWeight="700" fontSize={18}>Location</Text>
                        <XStack
                            jc="space-between"
                            ai="center"
                            borderWidth={1}
                            borderColor="#E3E3E3"
                            borderRadius={12}
                            h={60}
                            px={15}
                            py={12}
                        >
                            <Text>Gaza, Khan Younis</Text>
                            <Ionicons name="chevron-forward" size={18} color="gray" />
                        </XStack>
                    </YStack>

                    {/* Distance */}
                    <XStack jc="space-between">
                        <Text fontWeight="700" fontSize={18}>Distance</Text>
                        <Text>{distance[0]} km</Text>
                    </XStack>
                    <Slider value={distance} onValueChange={setDistance} max={100} step={5}>
                        <Slider.Track bg="#E3E3E3">
                            <Slider.TrackActive bg="black" />
                        </Slider.Track>
                        <Slider.Thumb circular index={0} bg="black" />
                    </Slider>

                    {/* Urgency */}
                    <Text fontWeight="700" fontSize={18}>Urgency</Text>
                    <XStack borderColor={"#E3E3E3"} borderWidth={1} borderRadius={12} h={60}>
                        {pillButton('Urgent', urgency === 'Urgent', () => setUrgency('Urgent'))}
                        {pillButton('Soon', urgency === 'Soon', () => setUrgency('Soon'))}
                        {pillButton('Flexible', urgency === 'Flexible', () => setUrgency('Flexible'))}
                    </XStack>

                    {/* Continue Button */}
                    <Button bg="#4a8a28" borderRadius={12} h={60} mb={30} onPress={onClose}>
                        <Text color="white" fontWeight="600" fontSize={20}>Continue</Text>
                    </Button>
                </YStack>
            </Sheet.Frame>
        </Sheet>
    );
}