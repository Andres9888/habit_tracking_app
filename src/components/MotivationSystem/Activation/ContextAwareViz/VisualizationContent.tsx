/**
 * VisualizationContent - The actual visualization display
 */

import React from 'react';
import Animated from 'react-native-reanimated';

import type { VizType } from './types';
import { useContentAnimation } from './useContentAnimation';
import { VizFields } from './VizFields';
import { EmptyVizState } from './EmptyVizState';
import { FeelItPrompt } from './FeelItPrompt';

interface VisualizationContentProps {
  type: VizType;
  body?: string;
  mind?: string;
  emotion?: string;
  reduceMotion: boolean;
  compact: boolean;
}

export function VisualizationContent({
  type,
  body,
  mind,
  emotion,
  reduceMotion,
  compact,
}: VisualizationContentProps) {
  const { animatedStyle } = useContentAnimation({ reduceMotion, type });

  const hasAnyField = body || mind || emotion;

  if (!hasAnyField) {
    return <EmptyVizState compact={compact} type={type} />;
  }

  return (
    <Animated.View style={animatedStyle}>
      <VizFields
        body={body}
        compact={compact}
        emotion={emotion}
        mind={mind}
        type={type}
      />

      {!compact && <FeelItPrompt type={type} />}
    </Animated.View>
  );
}
