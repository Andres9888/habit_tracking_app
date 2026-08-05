/**
 * ShareCard Component
 * The card that gets captured and shared as an image
 */

import React, { forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ViewShot, { type ViewShotRef } from 'react-native-view-shot';
import { shareCardContentStyles as contentStyles } from '../styles';
import { ShareCardInfo } from './ShareCardInfo';
import { ShareCardFooter } from './ShareCardFooter';
import type { ShareFormat, GradientPreset } from '../ShareCardGenerator.types';

interface ShareCardProps {
  habitName: string;
  emoji: string;
  milestoneLabel: string;
  strengthPercentage: number;
  personalMessage?: string;
  showUserName: boolean;
  userName?: string;
  format: ShareFormat;
  gradient: GradientPreset;
}

export const ShareCard = forwardRef<ViewShotRef, ShareCardProps>((props, ref) => {
  const { format, gradient, emoji, showUserName, userName } = props;
  const gradientColors = gradient.colors as unknown as readonly [
    string,
    string,
    ...string[],
  ];

  return (
    <ViewShot
      ref={ref}
      options={{
        format: 'png',
        height: format.height,
        quality: 1,
        width: format.width,
      }}
      style={[
        contentStyles.cardContainer,
        {
          aspectRatio: format.aspectRatio,
          height: format.height,
          width: format.width,
        },
      ]}
    >
      <LinearGradient
        colors={gradientColors}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={StyleSheet.absoluteFill}
      >
        <View style={contentStyles.cardContent}>
          <View style={contentStyles.emojiContainer}>
            <Text style={contentStyles.emoji}>{emoji}</Text>
          </View>

          <ShareCardInfo
            habitName={props.habitName}
            milestoneLabel={props.milestoneLabel}
            personalMessage={props.personalMessage}
            strengthPercentage={props.strengthPercentage}
          />

          <ShareCardFooter showUserName={showUserName} userName={userName} />
        </View>
      </LinearGradient>
    </ViewShot>
  );
});

ShareCard.displayName = 'ShareCard';
