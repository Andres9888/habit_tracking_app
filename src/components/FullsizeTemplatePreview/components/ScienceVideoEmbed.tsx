/**
 * Elevated video embed card with real YouTube thumbnail
 */

import React, { useState } from 'react';
import { Image, Linking, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play } from 'lucide-react-native';
import { colors } from '@/theme';
import { evidenceDetailStyles as s } from '../styles/evidenceDetail.styles';
import { extractYoutubeVideoId } from '../utils/extractYoutubeVideoId';
import type { Template } from '../../../types/template';

interface ScienceVideoEmbedProps {
  iconColor: string;
  template: Template;
}

export function ScienceVideoEmbed({
  iconColor,
  template,
}: ScienceVideoEmbedProps) {
  const [thumbQuality, setThumbQuality] = useState<
    'maxres' | 'hq' | 'fallback'
  >('maxres');
  if (!template?.youtubeLink) return null;

  const videoId = extractYoutubeVideoId(template.youtubeLink);
  const showImage = videoId !== null && thumbQuality !== 'fallback';
  const thumbUrl = showImage
    ? `https://i.ytimg.com/vi/${videoId}/${thumbQuality === 'maxres' ? 'maxresdefault' : 'hqdefault'}.jpg`
    : null;
  const fallbackColors = [
    `${iconColor}20`,
    `${colors.primary[600]}15`,
  ] as const;

  return (
    <Pressable
      accessibilityLabel='Watch the science explained on YouTube'
      accessibilityRole='link'
      style={s.videoCard}
      onPress={() => void Linking.openURL(template.youtubeLink!)}
    >
      <View style={s.videoThumbnail}>
        {showImage && thumbUrl ? (
          <Image
            accessibilityIgnoresInvertColors
            resizeMode='cover'
            source={{ uri: thumbUrl }}
            style={s.videoThumbnailImage}
            onError={() =>
              setThumbQuality((q) => (q === 'maxres' ? 'hq' : 'fallback'))
            }
          />
        ) : (
          <LinearGradient
            colors={fallbackColors}
            end={{ x: 1, y: 1 }}
            start={{ x: 0, y: 0 }}
            style={s.videoThumbnailFallback}
          />
        )}
        <View style={s.videoThumbnailScrim} />
        <View style={s.playCircle}>
          <Play color='#FFFFFF' fill='#FFFFFF' size={22} />
        </View>
      </View>
      <View style={s.videoMeta}>
        <Text style={s.videoLabel}>Watch: The science explained</Text>
        <Text style={s.videoSubtitle}>
          Learn the research behind this habit on YouTube
        </Text>
      </View>
    </Pressable>
  );
}
