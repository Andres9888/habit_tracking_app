/**
 * ShareCardPreview Component
 * Renders a scaled-down preview of the ShareCard for display
 */

import React, { RefObject } from 'react';
import { View, Dimensions } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { ShareCard } from './ShareCard';
import { containerStyles } from '../styles';
import type { ShareFormat, GradientPreset } from '../ShareCardGenerator.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ShareCardPreviewProps {
  viewShotRef: RefObject<ViewShot>;
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

export function ShareCardPreview({
  viewShotRef,
  habitName,
  emoji,
  milestoneLabel,
  strengthPercentage,
  personalMessage,
  showUserName,
  userName,
  format,
  gradient,
}: ShareCardPreviewProps) {
  const previewWidth = SCREEN_WIDTH - 48;
  const previewHeight = previewWidth / format.aspectRatio;

  return (
    <View
      style={[
        containerStyles.previewContainer,
        {
          height: previewHeight,
          width: previewWidth,
        },
      ]}
    >
      <View
        style={{
          transform: [{ scale: previewWidth / format.width }],
          transformOrigin: 'top left',
        }}
      >
        <ShareCard
          ref={viewShotRef}
          emoji={emoji}
          format={format}
          gradient={gradient}
          habitName={habitName}
          milestoneLabel={milestoneLabel}
          personalMessage={personalMessage}
          showUserName={showUserName}
          strengthPercentage={strengthPercentage}
          userName={userName}
        />
      </View>
    </View>
  );
}
