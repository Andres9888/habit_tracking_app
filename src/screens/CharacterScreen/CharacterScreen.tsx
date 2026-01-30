/**
 * CharacterScreen Component
 *
 * Gamification screen showing user's character, stats, and achievements.
 * Data is computed from actual habit tracking data via useCharacterData hook.
 */

import { View, ScrollView, ActivityIndicator, Text } from 'react-native';

import {
  AchievementsSection,
  AttributesSection,
  CharacterCard,
  ScreenHeader,
  StatsSection,
} from './components';
import { useCharacterData } from './hooks';
import type { CharacterScreenProps } from './types';

export default function CharacterScreen({ onBack }: CharacterScreenProps) {
  const characterData = useCharacterData();

  if (!characterData) {
    return (
      <View className='flex-1 items-center justify-center bg-white'>
        <ActivityIndicator color='#6366F1' size='large' />
        <Text className='mt-4 text-stone-500'>Loading your character...</Text>
      </View>
    );
  }

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
