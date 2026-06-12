/**
 * TrendingCard — tall narrow card for trending/popular template carousel.
 *
 * Two press targets: card body → preview, add button → direct import.
 */

import { memo } from 'react';
import { Text, View } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { triggerHaptic } from '@/utils/haptics';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { getTemplateMetaLabel } from '../HabitTemplateCard/templateMeta';
import { getImportedStateColors } from '../../utils/importedStateColors';
import { ScienceDoorPill } from '../ScienceDoorPill';
import { AddButton } from './AddButton';
import { formatPopularity } from './formatPopularity';
import { s } from './TrendingCard.styles';
import type { TrendingCardProps } from './TrendingCard.types';

function TrendingCardComponent({
  description,
  hasResearch,
  icon,
  iconColor,
  isImported,
  isImporting,
  name,
  onImport,
  onPress,
  popularityPrefix,
  popularityScore,
  template,
}: TrendingCardProps) {
  const { colors, isDark } = useThemeColors();
  const importedColors = getImportedStateColors(isDark);
  const metaLabel = getTemplateMetaLabel(template);

  return (
    <AnimatedPressable
      accessibilityHint='Opens the habit preview'
      accessibilityLabel={`Preview ${name} habit`}
      accessibilityRole='button'
      style={[
        s.card,
        {
          backgroundColor: isImported
            ? importedColors.backgroundColor
            : colors.card,
          borderColor: isImported ? importedColors.borderColor : colors.border,
          opacity: isImporting ? 0.72 : 1,
        },
      ]}
      onPress={() => {
        void triggerHaptic('tap');
        onPress();
      }}
    >
      <View
        style={[
          s.accent,
          {
            backgroundColor: isImported ? colors.primary[500] : iconColor,
          },
        ]}
      />
      <View style={[s.iconBox, { backgroundColor: `${iconColor}25` }]}>
        <Text style={s.iconEmoji}>{icon}</Text>
      </View>

      <Text numberOfLines={2} style={[s.name, { color: colors.text.primary }]}>
        {name}
      </Text>

      {description ? (
        <Text
          numberOfLines={1}
          style={[s.description, { color: colors.text.secondary }]}
        >
          {description}
        </Text>
      ) : null}

      <View style={s.metaRow}>
        {metaLabel ? (
          <Text style={[s.frequency, { color: colors.text.tertiary }]}>
            {metaLabel}
          </Text>
        ) : null}
        {hasResearch ? (
          <ScienceDoorPill template={template} onPress={() => onPress()} />
        ) : null}
      </View>

      <View style={s.bottomRow}>
        <Text style={[s.popularityText, { color: colors.primary[600] }]}>
          {popularityPrefix ? `${popularityPrefix} ` : ''}
          {formatPopularity(popularityScore)}
        </Text>
        <AddButton
          isImported={isImported}
          isImporting={isImporting}
          name={name}
          onImport={onImport}
        />
      </View>
    </AnimatedPressable>
  );
}

export const TrendingCard = memo(TrendingCardComponent);
