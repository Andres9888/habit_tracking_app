/**
 * YouTube thumbnail card — visual hook for the Watch action pill.
 */

import React from 'react';
import { Image, Linking, Pressable, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play } from 'lucide-react-native';

import { colors } from '@/theme/colors';
import { iconSizes } from '@/theme/iconSizes';
import { evidenceDetailStyles as s } from '../styles/evidenceDetail.styles';
import type { Template } from '../../../types/template';

interface ScienceVideoEmbedProps {
  template: Template;
}

const YOUTUBE_ID_RE =
  /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})/;

function extractYouTubeId(url: string): string | null {
  const match = url.match(YOUTUBE_ID_RE);
  return match ? match[1] : null;
}

function youtubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function ScienceVideoEmbed({ template }: ScienceVideoEmbedProps) {
  if (!template?.youtubeLink) return null;

  const videoId = extractYouTubeId(template.youtubeLink);
  if (!videoId) return null;

  const thumbnailUri = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <Pressable
      accessibilityLabel="Watch the science explained on YouTube"
      accessibilityRole="link"
      style={s.videoCard}
      onPress={() => void Linking.openURL(youtubeWatchUrl(videoId))}
    >
      <View style={s.videoThumbnail}>
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="cover"
          source={{ uri: thumbnailUri }}
          style={s.videoThumbnailImage}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.45)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={s.videoThumbnailOverlay}
        />
        <View style={s.playCircle}>
          <Play color={colors.gray[900]} fill={colors.gray[900]} size={iconSizes.large} />
        </View>
      </View>
    </Pressable>
  );
}
