import { Link } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';
import { Text, YStack, XStack, Image, Spinner } from 'tamagui';
import { CustomCard } from '~/assets/ui/components/card';
import { useAppStore } from '~/store/index';
import { useEffect, useState } from 'react';

export const Mymissions = ({ horizontal, width }: { horizontal: boolean; width: number }) => {
  const { missions, loadMissions, user } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserMissions();
  }, []);

  const loadUserMissions = async () => {
    try {
      // Load missions for the current user
      if (user?.id) {
        await loadMissions(user.id);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to load user missions:', error);
      setLoading(false);
    }
  };

  // Filter missions to show user's own missions or matched missions
  const userMissions = missions.filter(mission => 
    mission.userId === user?.id || mission.status === 'matched'
  );

  if (loading) {
    return (
      <YStack f={1} ai="center" jc="center" h={200}>
        <Spinner size="large" color="$blue10" />
        <Text mt={16} fontSize={14} color="$gray10">Loading missions...</Text>
      </YStack>
    );
  }

  if (userMissions.length === 0) {
    return (
      <YStack f={1} ai="center" jc="center" h={200}>
        <Text fontSize={16} color="$gray10" textAlign="center">
          No missions found
        </Text>
        <Text mt={8} fontSize={12} color="$gray8" textAlign="center">
          Create a mission or accept one from the discover tab
        </Text>
      </YStack>
    );
  }

  return (
    <YStack f={1} w="100%" mb={60}>
      <FlatList
        data={userMissions}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 15 }}
        bounces={false}
        snapToInterval={width + 15}
        decelerationRate="fast"
        renderItem={({ item }) => (
          <CustomCard
            width={width}
            description={item.description}
            bgimage={item.bgimage || require('~/assets/images/tent.jpeg')}
            profile={item.profile || require('~/assets/images/pfp.jpeg')}
            name={item.name || 'Unknown User'}
            id={item.id}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </YStack>
  );
};
