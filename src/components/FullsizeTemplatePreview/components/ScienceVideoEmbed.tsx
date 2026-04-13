/**
 * Elevated video embed card with gradient thumbnail
 */

import React from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play } from 'lucide-react-native';
import { colors } from '@/theme';
import { evidenceDetailStyles as s } from '../styles/evidenceDetail.styles';
import type { Template } from '../../../types/template';

interface ScienceVideoEmbedProps {
  iconColor: string;
  template: Template;
}

export function ScienceVideoEmbed({
  iconColor,
  template,
}: ScienceVideoEmbedProps) {
  if (!template?.youtubeLink) return null;

  const thumbnailColors = [
    `${iconColor}20`,
    `${colors.primary[600]}15`,
  ] as const;

  return (
    <Pressable
      accessibilityLabel="Watch the science explained on YouTube"
      accessibilityRole="link"
      style={s.videoCard}
      onPress={() => void Linking.openURL(template.youtubeLink!)}
    >
      <LinearGradient
        colors={thumbnailColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.videoThumbnail}
      >
        <View style={s.playCircle}>
          <Play color={colors.text.inverse} fill={colors.text.inverse} size={22} />
        </View>
      </LinearGradient>
      <View style={s.videoMeta}>
        <Text style={s.videoLabel}>Watch: The science explained</Text>
        <Text style={s.videoSubtitle}>
          Learn the research behind this habit on YouTube
        </Text>
      </View>
    </Pressable>
  );
}
