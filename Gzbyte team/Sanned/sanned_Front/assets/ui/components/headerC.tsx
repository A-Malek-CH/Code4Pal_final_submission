import { Text, YStack, XStack, Image } from 'tamagui';
import { Title, Button } from '~/tamagui.config';
import { CustomCard } from '~/assets/ui/components/card';

import { ScreenContent } from '~/components/ScreenContent';
import { Ionicons } from '@expo/vector-icons';


export const HeaderC= ({icon,presshandler,name}) => {

    return (
         <XStack  w="100%"  jc={'space-between'} ai="center" mt={20}>
           <Button w={50} h={50} p={0} backgroundColor="#ffffffff" color="#000000ff" borderColor="#d7d7d7ff" onPress={() => {presshandler()}}>
          <Ionicons name={icon} size={24} color="#16621aff" />
        </Button>
       
        <YStack>
          <Text fontSize={30} textAlign='center'> {name}</Text>
          </YStack>
     
      </XStack>
    );
    };