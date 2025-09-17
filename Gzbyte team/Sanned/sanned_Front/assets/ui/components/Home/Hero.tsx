
import { Text, YStack, XStack, Image } from 'tamagui';
import { Title, Button } from '~/tamagui.config';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '~/store/index';

export const Hero = () => {
    const { user } = useAppStore();
    
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    const firstName = user?.name?.split(' ')[0] || 'there';

    return (
        <YStack w="100%" ai="center" mb={30} py={20}>
            <YStack ai="center" mb={15}>
                <Image 
                    source={require("~/assets/images/missions.png")} 
                    h={300}
                    resizeMode='contain' 
                />
            </YStack>

            <YStack ai="center" mb={20} gap={5}>
                <Text fontSize={24} fontWeight="700" color="#333" textAlign="center">
                    {getGreeting()}, {firstName}! 👋
                </Text>
                <Text fontSize={16} color="#666" textAlign="center">
                    Ready to make a difference in Gaza today?
                </Text>
            </YStack>

            <Button 
                mt={10} 
                w="100%" 
                h={56} 
                backgroundColor="#528241ff" 
                fontSize={18}
                borderRadius={16}
                pressStyle={{ opacity: 0.8 }}
                onPress={() => { router.push('/matchfound') }}
            > 
                <XStack ai="center" gap={10}>
                    <Ionicons name="compass-outline" size={24} color="white" />
                    <Text color="white" fontSize={16} fontWeight="600">
                        Match Me With A Mission
                    </Text>
                </XStack>
            </Button>
        </YStack>
    );
};
