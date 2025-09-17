// assets/ui/components/missiondetails/SkillsSection.tsx
import React from 'react';
import { YStack, XStack, Text } from 'tamagui';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface SkillsSectionProps {
    skills?: string[];
}

export default function SkillsSection({ skills = [] }: SkillsSectionProps) {
    return (
        <YStack gap={16}>
            <Text fontSize={16} fontWeight="700">Skills</Text>
            <XStack gap={12} flexWrap="wrap">
                {skills.map((skill, index) => (
                    <XStack 
                        key={index}
                        h={34} 
                        ai="center" 
                        jc={'center'} 
                        gap={4} 
                        bg={"#5282410d"} 
                        p={5} 
                        borderColor={"#528241ff"} 
                        borderWidth={1} 
                        br={7}
                    >
                        <Icon name="check-all" size={14} color="#528241ff" />
                        <Text fontSize={14} fontWeight={700} color="#528241ff">
                            {skill.toUpperCase()}
                        </Text>
                    </XStack>
                ))}
            </XStack>
        </YStack>
    );
}