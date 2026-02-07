import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
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

  return (
    <View
      className='flex-1'
      style={{ backgroundColor: colors.light.background }}
    >
      <ScrollView className='flex-1'>
        <View
          className='w-full px-6'
          style={{ paddingTop: Math.max(insets.top + 8, 16) }}
        >
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
