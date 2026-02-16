/**
 * @fileoverview CharacterScreen - RPG-style character progression view
 * 
 * **What it shows:**
 * - Screen header with back button
 * - Character card (avatar, level, XP progress bar)
 * - Attributes section (Strength, Discipline, Wisdom, Vitality)
 * - Stats section (numerical stats like Total XP, Habits Completed, etc.)
 * - Recent achievements section (unlocked achievement badges)
 * 
 * **How users get here:**
 * - From main navigation (Character/Profile tab)
 * - Modal or detail view with onBack callback
 * 
 * **Key interactions:**
 * - Back button → Calls onBack prop (closes modal/navigates)
 * - Scroll to view all sections
 * - Achievement badges display recently earned achievements
 * - Animated entrance with 60ms stagger per section
 * 
 * **Data source:**
 * - Currently uses MOCK_CHARACTER_DATA from constants
 * - TODO: Replace with real user character data from backend
 * 
 * **Technical notes:**
 * - 52 lines (compact, well-organized)
 * - Clean component composition (5 sub-components)
 * - Animated entrance (FadeInDown: 280, 340, 400, 460, 520ms delays)
 * - Safe area insets for header padding
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
