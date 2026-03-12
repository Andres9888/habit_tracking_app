import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useHabitData } from '../../features/habits/hooks/useHabitData';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import { ScreenHeader } from '../../components/ScreenHeader';
import { useThemeColors } from '../../theme/ThemeContext';
import { AchievementsSection, AttributesSection, CharacterCard, StatsSection } from './components';
import { buildCharacterData, buildDateRange, type HabitLike, type TrackingLike } from './characterData.helpers';
import type { CharacterScreenProps } from './types';

function CharacterScreenContent({ onBack }: CharacterScreenProps) {
  const dateRange = useMemo(() => buildDateRange(), []);
  const { habits, tracking } = useHabitData(dateRange);
  const characterData = useMemo(() => buildCharacterData(habits as HabitLike[], tracking as TrackingLike[]), [habits, tracking]);
  const { colors } = useThemeColors();

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      <ScrollView className='flex-1'>
        <ScreenHeader title='Character' onBack={onBack} />
        <View className='w-full px-6'>
          <Animated.View entering={FadeInDown.delay(340).springify().damping(18)}><CharacterCard data={characterData} /></Animated.View>
          <Animated.View entering={FadeInDown.delay(400).springify().damping(18)}><AttributesSection attributes={characterData.attributes} /></Animated.View>
          <Animated.View entering={FadeInDown.delay(460).springify().damping(18)}><StatsSection stats={characterData.stats} /></Animated.View>
          <Animated.View entering={FadeInDown.delay(520).springify().damping(18)}><AchievementsSection achievements={characterData.recentAchievements} /></Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

export default function CharacterScreen({ onBack }: CharacterScreenProps) {
  return <ScreenErrorBoundary screenName='Character' onGoBack={onBack}><CharacterScreenContent onBack={onBack} /></ScreenErrorBoundary>;
}
