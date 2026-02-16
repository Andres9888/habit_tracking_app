/**
 * MetadataPills Component
 *
 * Row of metadata pills showing frequency, research links, video, popularity
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../theme';
import { useThemeColors } from '../../../theme/ThemeContext';
import { borderRadius, spacing } from '../../../theme/spacing';
import { formatFrequency } from '../TemplateCard.constants';

interface MetadataPillsProps {
  frequency?: string;
  iconColor: string;
  popularityScore?: number;
  scientificLink?: string;
  youtubeLink?: string;
}

export function MetadataPills({
  frequency,
  iconColor,
  popularityScore,
  scientificLink,
  youtubeLink,
}: MetadataPillsProps) {
  const theme = useAppTheme();
  const { colors: themeColors } = useThemeColors();
  const formattedFrequency = formatFrequency(frequency);

  const hasMetadata =
    formattedFrequency ||
    scientificLink ||
    youtubeLink ||
    typeof popularityScore === 'number';

  if (!hasMetadata) return null;

  return (
    <View style={styles.metadataRow}>
      {formattedFrequency && (
        <View style={[styles.metadataPill, { backgroundColor: themeColors.surface, borderColor: `${iconColor}30` }]}>
          <Text style={[theme.custom.typography.caption, { color: themeColors.text.secondary }]}>
            ⏱️ {formattedFrequency}
          </Text>
        </View>
      )}

      {scientificLink && (
        <View style={[styles.metadataPill, { backgroundColor: themeColors.surface, borderColor: `${iconColor}30` }]}>
          <Text style={[theme.custom.typography.caption, { color: themeColors.text.secondary }]}>
            🔗 Research
          </Text>
        </View>
      )}

      {youtubeLink && (
        <View style={[styles.metadataPill, { backgroundColor: themeColors.surface, borderColor: `${iconColor}30` }]}>
          <Text style={[theme.custom.typography.caption, { color: themeColors.text.secondary }]}>
            ▶️ Video
          </Text>
        </View>
      )}

      {typeof popularityScore === 'number' && (
        <View style={[styles.metadataPill, { backgroundColor: themeColors.surface, borderColor: `${iconColor}30` }]}>
          <Text style={[theme.custom.typography.caption, { color: themeColors.text.secondary }]}>
            {popularityScore >= 90 ? 'Popular' : '⭐ Trusted'}
          </Text>
        </View>
      )}
    </View>
  );
}

export const styles = StyleSheet.create({
  metadataPill: {
    borderRadius: borderRadius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  metadataRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  metadataText: {},
});
