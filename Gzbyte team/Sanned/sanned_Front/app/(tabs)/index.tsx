
import { Text, YStack, XStack, Image, ScrollView } from 'tamagui';

import { HeaderB } from '~/assets/ui/components/headerB';
import { Hero } from '~/assets/ui/components/Home/Hero';
import { Mymissions } from '~/assets/ui/components/Home/Mymissions';
import { Link,router } from 'expo-router';



export default function Home() {
  function presshandler() {
    console.log('pressed');
    router.push('/addmission');
  }

  return (
    <ScrollView f={1} bg="white">
      <YStack f={1} bg="white" pl={20} pr={20} pb={20}>
        <HeaderB icon="add" name='Missions' presshandler={presshandler}/>
        <Hero />
        <XStack ai="center" jc="space-between" mb={20}>
          <Text fontSize={15}>My Missions</Text>
          <Link href="/missions" asChild>
            <Text fontSize={15} color="#16621aff">See All</Text>
          </Link>
        </XStack>
        <Mymissions horizontal={true} width={300} />
      </YStack>
    </ScrollView>


      
  
  );
}








