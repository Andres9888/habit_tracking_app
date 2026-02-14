/**
 * MetadataPills Component
 *
 * Row of metadata pills showing frequency, research links, video, popularity
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../theme';
import { borderRadius, spacing } from '../../../theme/spacing';
import { colors } from '../../../theme/colors';
import { formatFrequency } from '../TemplateCard.constants';

interface MetadataPillsProps {
  frequency?: string;
  iconColor: string;
  popularityScore?: number;
  scientificLink?: string;
  usageCount?: number;
  youtubeLink?: string;
}

export function MetadataPills({
  frequency,
  iconColor,
  popularityScore,
  scientificLink,
  usageCount,
  youtubeLink,
}: MetadataPillsProps) {
  const theme = useAppTheme();
  const formattedFrequency = formatFrequency(frequency);

  const hasMetadata =
    formattedFrequency ||
    scientificLink ||
    youtubeLink ||
    typeof popularityScore === 'number' ||
    typeof usageCount === 'number';

  if (!hasMetadata) return null;

  return (
    <View style={styles.metadataRow}>
      {formattedFrequency && (
        <View style={[styles.metadataPill, { borderColor: `${iconColor}30` }]}>
          <Text style={[theme.custom.typography.caption, styles.metadataText]}>
            ⏱️ {formattedFrequency}
          </Text>
        </View>
      )}

      {scientificLink && (
        <View style={[styles.metadataPill, { borderColor: `${iconColor}30` }]}>
          <Text style={[theme.custom.typography.caption, styles.metadataText]}>
            🔗 Research
          </Text>
        </View>
      )}

      {youtubeLink && (
        <View style={[styles.metadataPill, { borderColor: '#FF000030' }]}>
          <Text style={[theme.custom.typography.caption, styles.metadataText]}>
            ▶️ Video
          </Text>
        </View>
      )}

      {typeof popularityScore === 'number' && (
        <View style={[styles.metadataPill, { borderColor: `${iconColor}30` }]}>
          <Text style={[theme.custom.typography.caption, styles.metadataText]}>
            {popularityScore >= 90 ? '🔥 Popular' : '⭐ Trusted'}
          </Text>
        </View>
      )}

      {typeof usageCount === 'number' && usageCount > 0 && (
        <View style={[styles.metadataPill, { borderColor: `${iconColor}30` }]}>
          <Text style={[theme.custom.typography.caption, styles.metadataText]}>
            👥 {usageCount.toLocaleString()} {usageCount === 1 ? 'user' : 'users'}
          </Text>
        </View>
      )}
    </View>
  );
}

export const styles = StyleSheet.create({
  metadataPill: {
    backgroundColor: colors.light.card,
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
  metadataText: {
    color: '#4b5563',
  },
});
