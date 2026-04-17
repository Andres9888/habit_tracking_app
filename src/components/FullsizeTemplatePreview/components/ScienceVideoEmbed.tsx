/**
 * Elevated video embed card with YouTube thumbnail image
 */

import React from 'react';
import { Image, Linking, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play } from 'lucide-react-native';
import { evidenceDetailStyles as s } from '../styles/evidenceDetail.styles';
import type { Template } from '../../../types/template';

interface ScienceVideoEmbedProps {
  iconColor: string;
  template: Template;
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})/,
  );
  return match ? match[1] : null;
}

export function ScienceVideoEmbed({ template }: ScienceVideoEmbedProps) {
  if (!template?.youtubeLink) return null;

  const videoId = extractYouTubeId(template.youtubeLink);
  const thumbnailUri = videoId
    ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    : null;

  return (
    <Pressable
      accessibilityLabel="Watch the science explained on YouTube"
      accessibilityRole="link"
      style={s.videoCard}
      onPress={() => void Linking.openURL(template.youtubeLink!)}
    >
      <View style={s.videoThumbnail}>
        {thumbnailUri ? (
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="cover"
            source={{ uri: thumbnailUri }}
            style={s.videoThumbnailImage}
          />
        ) : null}
        <LinearGradient
          colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.45)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={s.videoThumbnailOverlay}
        />
        <View style={s.playCircle}>
          <Play color="#FFFFFF" fill="#FFFFFF" size={22} />
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
