import { View, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '../../theme/ThemeContext';
import {
  ScreenHeader,
  CharacterCard,
  AttributesSection,
  StatsSection,
  AchievementsSection,
} from './components';
import { MOCK_CHARACTER_DATA } from './constants';
import type { CharacterScreenProps } from './types';

export default function CharacterScreen({ onBack }: CharacterScreenProps) {
  const characterData = MOCK_CHARACTER_DATA;
  const insets = useSafeAreaInsets();
  const { colors } = useThemeColors();

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
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
