import { Card,CardBackground,CardFooter, } from "tamagui";
import { Image, Text, YStack, XStack } from "tamagui";
import {BlurView} from 'expo-blur';
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export const CustomCard = ({ width, description, bgimage, profile, name , id }: { width: number; description: string; bgimage: any; profile: any; name: string;id:string }) => {
  return (
    <Card width={width} height={200} borderRadius={20} overflow="hidden"  onPress={() => router.push(`/missionstatus/${id}`)} >
      <CardBackground>
        <Image source={bgimage} style={{ width: '100%', height: '100%' }} />
      </CardBackground>
      <CardFooter>
        <YStack w="100%"  > 
            <BlurView intensity={100} tint="dark" >
            <YStack p={10}>  
          <Text fontSize={18} fontWeight="bold" color="#fff">{description}</Text>

          <XStack alignItems="center" marginTop={5}>
            <Image source={profile} style={{ width: 30, height: 30, borderRadius: 15 }} />
            <Text fontSize={14} marginLeft={5} color="#fff">{name}</Text>
       
          </XStack>
          </YStack>
          </BlurView>
        </YStack>
      </CardFooter>
    </Card>
  );
};