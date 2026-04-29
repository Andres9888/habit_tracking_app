/**
 * Watch + Read action pills for the Science section.
 * Filled green Watch (links to youtubeLink), white outlined Read (links to scientificLink).
 */

import React from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { FileText, Play } from 'lucide-react-native';

import { colors } from '@/theme';
import { iconSizes } from '@/theme/iconSizes';
import { actionPillsStyles as s } from '../styles';
import type { Template } from '../../../types/template';

interface ScienceActionPillsProps {
  template: Template;
}

export function ScienceActionPills({ template }: ScienceActionPillsProps) {
  const youtubeLink = template?.youtubeLink;
  const scientificLink = template?.scientificLink;

  if (!youtubeLink && !scientificLink) return null;

  return (
    <View style={s.row}>
      {youtubeLink ? (
        <Pressable
          accessibilityLabel="Watch the science explained on YouTube"
          accessibilityRole="link"
          hitSlop={6}
          style={s.filled}
          onPress={() => void Linking.openURL(youtubeLink)}
        >
          <Play color={colors.text.inverse} fill={colors.text.inverse} size={iconSizes.small} />
          <Text style={s.filledText}>Watch</Text>
        </Pressable>
      ) : null}
      {scientificLink ? (
        <Pressable
          accessibilityLabel="Read the research paper"
          accessibilityRole="link"
          hitSlop={6}
          style={s.outline}
          onPress={() => void Linking.openURL(scientificLink)}
        >
          <FileText color={colors.primary[700]} size={iconSizes.small} strokeWidth={2} />
          <Text style={s.outlineText}>Read paper</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
