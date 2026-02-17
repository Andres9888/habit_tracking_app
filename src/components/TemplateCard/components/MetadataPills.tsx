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
  duration?: number | null;
  frequency?: string;
  iconColor: string;
  popularityScore?: number;
  scientificLink?: string;
  youtubeLink?: string;
}

export function MetadataPills({
  duration,
  frequency,
  iconColor,
  popularityScore,
  scientificLink,
  youtubeLink,
}: MetadataPillsProps) {
  const theme = useAppTheme();
  const { colors: themeColors } = useThemeColors();
  const formattedFrequency = formatFrequency(frequency);

  const formatDuration = (mins: number): string => {
    if (mins < 60) return `${mins} min`;
    return `${Math.floor(mins / 60)}h ${mins % 60 > 0 ? `${mins % 60}m` : ''}`;
  };

  const hasMetadata =
    duration ||
    formattedFrequency ||
    scientificLink ||
    youtubeLink ||
    typeof popularityScore === 'number';

  if (!hasMetadata) return null;

  return (
    <View style={styles.metadataRow}>
      {duration && (
        <View
          style={[
            styles.metadataPill,
            {
              backgroundColor: duration <= 5 ? '#d1fae5' : themeColors.surface,
              borderColor: duration <= 5 ? '#059669' : `${iconColor}30`,
            },
          ]}
        >
          <Text
            style={[
              theme.custom.typography.caption,
              { color: duration <= 5 ? '#047857' : themeColors.text.secondary },
            ]}
          >
            {duration <= 5 ? '⚡ ' : ''}{formatDuration(duration)}
          </Text>
        </View>
      )}

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
        <View style={[styles.metadataPill, { backgroundColor: themeColors.surface, borderColor: '#FF000030' }]}>
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
