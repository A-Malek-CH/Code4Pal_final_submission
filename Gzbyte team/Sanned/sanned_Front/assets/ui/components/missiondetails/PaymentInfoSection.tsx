// assets/ui/components/missiondetails/PaymentInfoSection.js
import React from 'react';
import { XStack, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentInfoSection({ paymentType, amount }) {
    return (
        <XStack ai="center" jc="space-between" br={6}>
            <Text fontSize={16} fontWeight="700">Payment</Text>
            <XStack gap={8}>                       
                <XStack w={76} h={34} ai="center" jc={'center'} gap={4} bg={"#5282410d"} br={7}>
                    <Ionicons name="cash-outline" size={12} color="#528241ff" />
                    <Text fontSize={12} color="#528241ff">{paymentType}</Text>
                </XStack>
                {amount && (
                    <XStack w={49} h={34} ai="center" jc={'center'} gap={4} bg={"#5282410d"} br={7}>
                        <Text fontSize={12} color="#528241ff">$ {amount}</Text>
                    </XStack>
                )}
            </XStack>
        </XStack>
    );
}