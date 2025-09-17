import { Card, CardBackground, CardFooter, Stack } from "tamagui";
import { Image, Text, YStack, XStack } from "tamagui";
import { BlurView } from 'expo-blur';
import { Ionicons } from "@expo/vector-icons";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { router } from "expo-router";
import Animated, {
  FadeInDown,
  FadeOutLeft,
  Layout,
  SlideOutLeft
} from 'react-native-reanimated';



export const CustomCard = ({ top, description, bgimage, profile, name, id, urgency, distance, paymentType }: { 
  top: number, 
  description: string; 
  bgimage: any; 
  profile: any; 
  name: string,
  id: string;
  urgency?: string;
  distance?: number;
  paymentType?: string;
}) => {
  // Helper function to get urgency color
  const getUrgencyColor = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
      case 'urgent': return '#ec2121ff';
      case 'soon': return '#ff9800';
      case 'flexible': return '#4caf50';
      default: return '#ec2121ff';
    }
  };

  // Helper function to get urgency icon
  const getUrgencyIcon = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
      case 'urgent': return 'alarm-light-outline';
      case 'soon': return 'clock-outline';  
      case 'flexible': return 'clock-time-four-outline';
      default: return 'alarm-light-outline';
    }
  };

  return (
    <Animated.View

      entering={FadeInDown}
      exiting={SlideOutLeft}
      layout={Layout.springify()}
        style={{
    width: '100%',
    height: '100%',
    position: 'absolute',
  }}

    >
      <Card width={"100%"} height={"100%"} borderRadius={20} overflow="hidden" position="absolute" top={top} left={0} right={0} bottom={0} marginRight={20} elevate onPress={() => router.push(`/missiondetails/${id}`)} >
        <CardBackground>
          <Image source={bgimage} style={{ width: '100%', height: '100%' }} />
        </CardBackground>
        <XStack bg={'white'} pos={'absolute'} top={20} left={20} br={5} ai={'center'} p={7} jc={'center'}>
          <Ionicons name="location-outline" size={20} color="#000000ff" />
          <Text fontSize={14} marginLeft={5} color="#000000ff">
            {distance ? `${distance.toFixed(1)} km` : '1 km'}
          </Text>
        </XStack>
        <XStack bg={'white'} pos={'absolute'} top={20} right={20} br={5} ai={'center'} p={7} jc={'center'}>
          <Icon name={getUrgencyIcon(urgency || 'urgent')} size={24} color={getUrgencyColor(urgency || 'urgent')} />
          <Text fontSize={14} marginLeft={5} color={getUrgencyColor(urgency || 'urgent')}>
            {urgency ? urgency.charAt(0).toUpperCase() + urgency.slice(1) : 'Urgent'}
          </Text>
        </XStack>

        <CardFooter>
          <YStack w="100%"  >
            <BlurView intensity={100} tint="dark" >
              <YStack p={10}>
                <Text fontSize={30} fontWeight="bold" color="#fff">{description}</Text>

                <XStack alignItems="center" marginTop={5}>
                  <Image source={profile} style={{ width: 30, height: 30, borderRadius: 15 }} />
                  <Text fontSize={14} marginLeft={5} color="#fff">{name}</Text>
                  <Text fontSize={14} marginLeft="auto" color="#fff"><Ionicons name="calendar" /> Today, 12:30 PM</Text>
                </XStack>
              </YStack>
            </BlurView>
          </YStack>
        </CardFooter>
      </Card>
    </Animated.View>
  );
};