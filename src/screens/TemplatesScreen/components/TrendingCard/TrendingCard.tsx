/**
 * TrendingCard — tall narrow card for trending/popular template carousel.
 *
 * Two press targets: card body → preview, add button → direct import.
 */

import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { AddButton } from './AddButton';
import { formatPopularity } from './formatPopularity';
import { s } from './TrendingCard.styles';
import type { TrendingCardProps } from './TrendingCard.types';

export function TrendingCard({
  description,
  frequency,
  hasResearch,
  icon,
  iconColor,
  isImported,
  isImporting,
  name,
  onImport,
  onPress,
  popularityScore,
}: TrendingCardProps) {
  const { colors } = useThemeColors();

  return (
    <Pressable
      accessibilityHint='Opens the habit preview'
      accessibilityLabel={`Preview ${name} habit`}
      accessibilityRole='button'
      style={[
        s.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={onPress}
    >
      <View style={[s.iconBox, { backgroundColor: `${iconColor}25` }]}>
        <Text style={s.iconEmoji}>{icon}</Text>
      </View>

      <Text numberOfLines={2} style={[s.name, { color: colors.text.primary }]}>
        {name}
      </Text>

      {description ? (
        <Text
          numberOfLines={2}
          style={[s.description, { color: colors.text.secondary }]}
        >
          {description}
        </Text>
      ) : null}

      <View style={s.metaRow}>
        <Text style={[s.frequency, { color: colors.text.tertiary }]}>
          {frequency}
        </Text>
        {hasResearch ? (
          <View
            style={[
              s.scienceBadge,
              { backgroundColor: colors.status.warningLight },
            ]}
          >
            <Text
              style={[s.scienceText, { color: colors.status.warningText }]}
            >
              🔬 Science-backed
            </Text>
          </View>
        ) : null}
      </View>

      <View style={s.bottomRow}>
        <Text style={[s.popularityText, { color: colors.primary[600] }]}>
          {formatPopularity(popularityScore)}
        </Text>
        <AddButton
          isImported={isImported}
          isImporting={isImporting}
          name={name}
          onImport={onImport}
        />
      </View>
    </Pressable>
  );
}
