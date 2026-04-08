/**
 * VideoLink - tappable row that opens a YouTube guide for the habit
 * Only rendered when the template has a youtubeLink field.
 */

import React from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { Play } from 'lucide-react-native';
import { videoStyles as s } from '../styles';
import type { Template } from '../../../types/template';

interface VideoLinkProps {
  template: Template;
}

export function VideoLink({ template }: VideoLinkProps) {
  if (!template?.youtubeLink) return null;

  return (
    <Pressable
      accessibilityLabel='Watch a quick guide on YouTube'
      accessibilityRole='link'
      style={s.row}
      onPress={() => void Linking.openURL(template.youtubeLink!)}
    >
      <View style={s.playCircle}>
        <Play color='#FFFFFF' fill='#FFFFFF' size={18} />
      </View>
      <View style={s.textColumn}>
        <Text style={s.label}>Watch a quick guide</Text>
        <Text style={s.subtitle}>Learn the technique on YouTube</Text>
      </View>
      <Text style={s.arrow}>›</Text>
    </Pressable>
  );
}
