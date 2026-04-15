/**
 * PremiumPackCard - softer premium shelf card for curated habit bundles
 */

import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '../../../../theme/ThemeContext';
import type { PremiumPack } from '../../data/premiumPacks';
import { s } from './PremiumPackCard.styles';

interface PremiumPackCardProps {
  onPress: () => void;
  pack: PremiumPack;
}

function withAlpha(hex: string, alpha: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(hex) ? `${hex}${alpha}` : hex;
}

export function PremiumPackCard({ onPress, pack }: PremiumPackCardProps) {
  const { colors } = useThemeColors();
  const accent = pack.backgroundGradient[1];
  const gradientColors: [string, string] = [
    withAlpha(pack.backgroundGradient[0], '22'),
    withAlpha(pack.backgroundGradient[1], '12'),
  ];

  return (
    <Pressable
      testID={`templates-pack-${pack.id}`}
      accessibilityLabel={`${pack.name} pack`}
      accessibilityRole='button'
      onPress={onPress}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[s.gradient, { borderColor: colors.border }]}
      >
        <View style={s.content}>
          <View style={s.emojiGroup}>
            {pack.emojiGroup.map((e, i) => (
              <Text key={i} style={s.emoji}>
                {e}
              </Text>
            ))}
          </View>
          <Text style={[s.name, { color: colors.text.primary }]} numberOfLines={1}>
            {pack.name}
          </Text>
          <Text style={[s.desc, { color: colors.text.secondary }]} numberOfLines={2}>
            {pack.description}
          </Text>
          <Text style={[s.habitCount, { color: accent }]}>
            {pack.habits.length} habits
          </Text>
        </View>
        <View style={[s.cta, { backgroundColor: colors.card, borderColor: withAlpha(accent, '33') }]}>
          <Text style={[s.ctaText, { color: accent }]}>Preview pack</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}
