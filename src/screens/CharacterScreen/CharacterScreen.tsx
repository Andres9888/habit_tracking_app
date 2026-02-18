import { View, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '../../theme/ThemeContext';
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
  const { colors } = useThemeColors();

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
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
