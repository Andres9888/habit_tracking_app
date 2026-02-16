/**
 * CharacterScreen - Gamification profile showing user progress
 * Displays avatar, attributes, stats, and achievements
 * 
 * ## Navigation Entry Points
 * - Accessed from HabitsApp (likely via profile or character tab)
 * 
 * ## State Management
 * - Uses MOCK_CHARACTER_DATA for demo/development
 * - Components receive data via props (characterData.attributes, etc.)
 * 
 * ## Props Contract
 * @interface CharacterScreenProps
 * @property {() => void} onBack - Navigation callback to go back
 * 
 * ## Sections (top to bottom)
 * 1. ScreenHeader - back button and title
 * 2. CharacterCard - avatar and level display
 * 3. AttributesSection - user attributes (e.g., consistency, streak)
 * 4. StatsSection - numerical statistics
 * 5. AchievementsSection - recent achievement badges
 * 
 * @flag UNDER_60_LINES - Screen is minimal at 52 lines (mostly imports/wiring)
 * @flag USES_MOCK_DATA - Currently uses MOCK_CHARACTER_DATA instead of real data
 */

import { View, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import {
  ScreenHeader,
  CharacterCard,
  AttributesSection,
  StatsSection,
  AchievementsSection,
} from './components';
import { MOCK_CHARACTER_DATA } from './constants';
import type { CharacterScreenProps } from './types';

function CharacterScreenContent({ onBack }: CharacterScreenProps) {
  const characterData = MOCK_CHARACTER_DATA;
  const insets = useSafeAreaInsets();

  return (
    <View className='flex-1 bg-white'>
      <ScrollView className='flex-1'>
        <View className='w-full px-6' style={{ paddingTop: insets.top + 12 }}>
          <Animated.View entering={FadeInDown.delay(280).springify().damping(18)}>
            <ScreenHeader onBack={onBack} />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(340).springify().damping(18)}>
            <CharacterCard data={characterData} />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(400).springify().damping(18)}>
            <AttributesSection attributes={characterData.attributes} />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(460).springify().damping(18)}>
            <StatsSection stats={characterData.stats} />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(520).springify().damping(18)}>
            <AchievementsSection
              achievements={characterData.recentAchievements}
            />
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

export default function CharacterScreen({ onBack }: CharacterScreenProps) {
  return (
    <ScreenErrorBoundary screenName="Character" onGoBack={onBack}>
      <CharacterScreenContent onBack={onBack} />
    </ScreenErrorBoundary>
  );
}
