import { View, ScrollView, Text, StyleSheet } from 'react-native';
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

// Loading state: Currently uses mock data (no async fetch).
// When connected to real data, add ActivityIndicator centered on colors.light.background.
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
          <View style={previewStyles.badgeContainer}>
            <Text style={previewStyles.badgeText}>Preview — Coming Soon</Text>
          </View>
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

const previewStyles = StyleSheet.create({
  badgeContainer: {
    alignSelf: 'center',
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    color: '#92400E',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.08,
  },
});
