/**
 * MetadataPills Component
 *
 * Row of metadata pills showing frequency, research links, video, popularity
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../theme';
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
            {popularityScore >= 90 ? 'Popular' : '⭐ Trusted'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  metadataPill: {
    backgroundColor: '#ffffff',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  metadataRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  metadataText: {
    color: '#4b5563',
  },
});
