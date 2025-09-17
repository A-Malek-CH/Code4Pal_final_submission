// assets/ui/components/discover/DiscoverCardsStack.js
import React from 'react';
import { YStack } from 'tamagui';
import { CustomCard } from '~/assets/ui/components/CardBig';

interface Mission {
    id: string;
    description: string;
    bgimage?: any;
    profile?: any;
    name?: string;
    urgency?: string;
    paymentType?: string;
    distance?: number;
}

interface DiscoverCardsStackProps {
    missions: Mission[];
}

export default function DiscoverCardsStack({ missions }: DiscoverCardsStackProps) {
    // Get the default images for fallback
    const defaultBgImage = require('~/assets/images/tent.jpeg');
    const defaultProfileImage = require('~/assets/images/pfp.jpeg');

    return (
        <YStack h="65%" w="100%" mt={50} ai="center">
            {[...missions].reverse()
                .slice(-3)
                .map((item, index) => (
                    <CustomCard
                        key={item.id}
                        top={missions.length - missions.indexOf(item) * 10}
                        description={item.description}
                        bgimage={item.bgimage || defaultBgImage}
                        profile={item.profile || defaultProfileImage}
                        name={item.name || `user_${item.id.slice(-4)}`}
                        id={item.id}
                        urgency={item.urgency}
                        distance={item.distance || Math.random() * 5 + 0.5} // Random distance for demo
                        paymentType={item.paymentType}
                    />
                ))}
        </YStack>
    );
}