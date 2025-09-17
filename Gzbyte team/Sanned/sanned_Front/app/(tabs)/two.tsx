
import { Text, YStack, XStack, Image, Tabs, SizableText,H5, ScrollView,Button,TextArea } from 'tamagui'
import { HeaderB } from '~/assets/ui/components/headerB'
import { Mymissions } from '~/assets/ui/components/Home/Mymissions'
import { useState, useEffect } from 'react'
import { database } from '~/database'
import { Q } from '@nozbe/watermelondb'
import Donation from '~/database/models/Donation'
import GlobalMission from '~/database/models/GlobalMission'
import MyMission from '~/database/models/MyMission'
import { useAppStore } from '~/store/index'

interface DonatedMission {
  id: string;
  title: string;
  description: string;
  location: string;
  amount: number;
  donationAmount: number;
  donationStatus: string;
  donationDate: Date;
  isGlobalMission: boolean;
}

const donations = () => {
  const [index, setIndex] = useState(0)
  const [search, setSearch] = useState(false)
  const [donations, setDonations] = useState<DonatedMission[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAppStore()

  useEffect(() => {
    if (user) {
      loadUserDonations();
    }
  }, [user])

  const loadUserDonations = async () => {
    try {
      setLoading(true)
      console.log('Loading user donations for user:', user?.id)
      
      // Get all donations made by this user
      const userDonations = await database.get<Donation>('donations')
        .query(Q.where('donor_id', user?.id || ''))
        .fetch()
      
      console.log('Found donations:', userDonations.length)
      
      const donatedMissions: DonatedMission[] = []
      
      for (const donation of userDonations) {
        // First try to find in global missions
        let mission = await database.get<GlobalMission>('global_missions')
          .query(Q.where('id', donation.missionId))
          .fetch()
        
        if (mission.length > 0) {
          const globalMission = mission[0]
          donatedMissions.push({
            id: globalMission.id,
            title: globalMission.title,
            description: globalMission.description,
            location: globalMission.location || 'Location not specified',
            amount: globalMission.amount || 0,
            donationAmount: donation.amount,
            donationStatus: donation.status,
            donationDate: donation.createdAt,
            isGlobalMission: true
          })
        } else {
          // Try to find in my missions
          let myMission = await database.get<MyMission>('my_missions')
            .query(Q.where('id', donation.missionId))
            .fetch()
          
          if (myMission.length > 0) {
            const userMission = myMission[0]
            donatedMissions.push({
              id: userMission.id,
              title: userMission.title,
              description: userMission.description,
              location: userMission.location || 'Location not specified',
              amount: userMission.amount || 0,
              donationAmount: donation.amount,
              donationStatus: donation.status,
              donationDate: donation.createdAt,
              isGlobalMission: false
            })
          }
        }
      }
      
      console.log('Loaded donated missions:', donatedMissions.length)
      setDonations(donatedMissions)
    } catch (error) {
      console.error('Failed to load user donations:', error)
    } finally {
      setLoading(false)
    }
  }

  function searchHandler() {
    setSearch(!search)
    console.log('search')
  }

  const activeDonations = donations.filter(d => d.donationStatus === 'completed')
  const completedDonations = donations.filter(d => d.donationStatus === 'completed')

  return (
    <YStack f={1} bg="white" pl={20} pr={20} pb={20} ai={"center"}>
      <HeaderB icon='search' name='My Donations' presshandler={searchHandler}  />

      <YStack mt={20} mb={20} p={10} ai={'center'} >

        {search && <TextArea placeholder='Search Donations' w={300} h={50} bg={'#F6F6F6'} br={10} p={10} mb={20} onChangeText={(text) => console.log(text)} />}
       
        
         <XStack ai="center"  mb={20} w={200} h={32} bg={'#F6F6F6'} br={10}  p={2}>
          <Button w={'50%'} h={'100%'} p={0}  onPress={() => setIndex(0) }bg={index === 0 ? '#ffffffff' : '#F6F6F6'}>
            <Text fontSize={15}>Active</Text>
          </Button>
          <Button w={'50%'} h={'100%'} p={0}    onPress={() => setIndex(1)} bg={index === 1 ? '#ffffffff' : '#F6F6F6'}>
            <Text fontSize={15}>Completed</Text>
          </Button>
           
         </XStack>

         {loading ? (
           <Text>Loading donations...</Text>
         ) : (
           <>
             {index === 0 && (
               <ScrollView w="100%" h="60%">
                 {activeDonations.length === 0 ? (
                   <Text textAlign="center" mt={50} fontSize={16} color="$gray9">
                     No active donations found
                   </Text>
                 ) : (
                   <YStack gap={16}>
                     {activeDonations.map((donation, idx) => (
                       <YStack key={idx} p={16} bg="$gray1" br={12} gap={8}>
                         <Text fontSize={18} fontWeight="600">{donation.title}</Text>
                         <Text fontSize={14} color="$gray9" numberOfLines={2}>
                           {donation.description}
                         </Text>
                         <Text fontSize={12} color="$gray8">{donation.location}</Text>
                         <XStack jc="space-between" ai="center">
                           <Text fontSize={16} fontWeight="600" color="$green9">
                             Donated: ${donation.donationAmount}
                           </Text>
                           <Text fontSize={12} color="$gray8">
                             {donation.donationDate.toLocaleDateString()}
                           </Text>
                         </XStack>
                       </YStack>
                     ))}
                   </YStack>
                 )}
               </ScrollView>
             )}
             {index === 1 && (
               <ScrollView w="100%" h="60%">
                 {completedDonations.length === 0 ? (
                   <Text textAlign="center" mt={50} fontSize={16} color="$gray9">
                     No completed donations found
                   </Text>
                 ) : (
                   <YStack gap={16}>
                     {completedDonations.map((donation, idx) => (
                       <YStack key={idx} p={16} bg="$gray1" br={12} gap={8}>
                         <Text fontSize={18} fontWeight="600">{donation.title}</Text>
                         <Text fontSize={14} color="$gray9" numberOfLines={2}>
                           {donation.description}
                         </Text>
                         <Text fontSize={12} color="$gray8">{donation.location}</Text>
                         <XStack jc="space-between" ai="center">
                           <Text fontSize={16} fontWeight="600" color="$green9">
                             Donated: ${donation.donationAmount}
                           </Text>
                           <Text fontSize={12} color="$gray8">
                             {donation.donationDate.toLocaleDateString()}
                           </Text>
                         </XStack>
                       </YStack>
                     ))}
                   </YStack>
                 )}
               </ScrollView>
             )}
           </>
         )}
         
               


      </YStack>

      
    </YStack>
  )
}

export default donations
