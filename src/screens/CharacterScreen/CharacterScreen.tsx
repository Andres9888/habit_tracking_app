import { View, ScrollView, ActivityIndicator, Text } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import {
  ScreenHeader,
  CharacterCard,
  AttributesSection,
  StatsSection,
  AchievementsSection,
} from './components';
import { MOCK_CHARACTER_DATA } from './constants';
import type { CharacterScreenProps, CharacterData } from './types';

export default function CharacterScreen({ onBack }: CharacterScreenProps) {
  // Fetch real character stats from Convex
  const characterStats = useQuery(api.character.getCharacterStats);

  // Show loading state while data is being fetched
  if (characterStats === undefined) {
    return (
      <View className='flex-1 items-center justify-center bg-white'>
        <ActivityIndicator color='#ad46ff' size='large' />
        <Text className='mt-4 text-stone-500'>Loading character...</Text>
      </View>
    );
  }

  // Transform Convex data to match CharacterData interface
  const characterData: CharacterData = {
    attributes: characterStats.attributes,
    level: characterStats.level,
    recentAchievements: MOCK_CHARACTER_DATA.recentAchievements, // TODO: Add achievements query
    stats: characterStats.stats,
    title: characterStats.title,
    xp: characterStats.xp,
    xpToNextLevel: characterStats.xpToNextLevel,
  };

  return (
    <View className='flex-1 bg-white'>
      <ScrollView className='flex-1'>
        <View className='w-full px-6 pt-[60px]'>
          <ScreenHeader onBack={onBack} />
          <CharacterCard data={characterData} />
          <AttributesSection attributes={characterData.attributes} />
          <StatsSection stats={characterData.stats} />
          <AchievementsSection
            achievements={characterData.recentAchievements}
          />
        </View>
      </ScrollView>
    </View>
  );
}
