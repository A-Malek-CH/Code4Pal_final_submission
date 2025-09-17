import { Ionicons } from '@expo/vector-icons'
import { Text, YStack, XStack, Image, Tabs, SizableText,H5, ScrollView,Button,TextArea } from 'tamagui'
import { HeaderA } from '~/assets/ui/components/headerA'
import { Mymissions } from '~/assets/ui/components/Home/Mymissions'
import { useState } from 'react'


const missions = () => {
  const [index, setIndex] = useState(0)
  const[search,setSearch]= useState(false)


  function searchHandler() {
    setSearch(!search)

    console.log('search')
  }
  return (
    <YStack f={1} bg="white" p={20} ai={"center"}>
      <HeaderA icon='search' presshandler={searchHandler}  name='Missions' />

      <YStack mt={20} mb={20} p={10} ai={'center'} >

        {search && <TextArea placeholder='Search Missions' w={300} h={50} bg={'#F6F6F6'} br={10} p={10} mb={20} onChangeText={(text) => console.log(text)} />}
       
        
           <XStack ai="center"  mb={20} w={200} h={32} bg={'#F6F6F6'} br={10}  p={2}>
          <Button w={'50%'} h={'100%'} p={0}  onPress={() => setIndex(0) }bg={index === 0 ? '#ffffffff' : '#F6F6F6'}>
            <Text fontSize={15}>Active</Text>
          </Button>
          <Button w={'50%'} h={'100%'} p={0}    onPress={() => setIndex(1)} bg={index === 1 ? '#ffffffff' : '#F6F6F6'}>
            <Text fontSize={15}>Completed</Text>
          </Button>
          </XStack>

          
          {index === 0 && <Mymissions horizontal={false} width={320} />}
          {index === 1 && <Text>No Completed Missions</Text>}
          
               


      </YStack>

      
    </YStack>
  )
}

export default missions
