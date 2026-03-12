/**
 * ContextAwareViz Component
 * Context-aware visualization display based on motivation level
 *
 * Scientific Basis: Andrew Huberman's Dual Visualization Protocol
 * - Show FAILURE viz when unmotivated (loss aversion drives action 2x)
 *
 * Logic:
 * - motivated (ready) → Show SUCCESS visualization
 * - unmotivated (not_motivated, meh) → Show FAILURE visualization
 */

import React from 'react';
import { View, Text } from 'react-native';
import { clsx } from 'clsx';

import type { ContextAwareVizProps } from './types';
import { useVizData } from './useVizData';
import { useIconAnimation } from './useIconAnimation';
import { VizHeader } from './VizHeader';
import { VisualizationContent } from './VisualizationContent';

export function ContextAwareViz({
  motivationLevel,
  visualization,
  reduceMotion = false,
  className,
  compact = false,
  forceType,
}: ContextAwareVizProps) {
  const { vizType, isSuccess, body, mind, emotion } = useVizData({
    forceType,
    motivationLevel,
    visualization,
  });

  const { iconAnimatedStyle } = useIconAnimation({ reduceMotion, vizType });

  if (compact) {
    return (
      <View
        className={clsx(
          'rounded-2xl p-4',
          isSuccess ? 'bg-emerald-50' : 'bg-rose-50',
          className
        )}
      >
        <VisualizationContent
          compact
          body={body}
          emotion={emotion}
          mind={mind}
          reduceMotion={reduceMotion}
          type={vizType}
        />
      </View>
    );
  }

  return (
    <View
      className={clsx(
        'rounded-2xl border-l-4 p-4',
        isSuccess
          ? 'border-l-emerald-400 bg-emerald-50/50'
          : 'border-l-rose-400 bg-rose-50/50',
        className
      )}
    >
      <VizHeader iconAnimatedStyle={iconAnimatedStyle} vizType={vizType} />

      <VisualizationContent
        body={body}
        compact={false}
        emotion={emotion}
        mind={mind}
        reduceMotion={reduceMotion}
        type={vizType}
      />

      {!isSuccess && body ? <View className='mt-3 rounded-lg bg-rose-100/50 px-3 py-2'>
          <Text className='text-center text-xs text-rose-600'>
            💡 Loss aversion: This feeling moves you 2x more effectively
          </Text>
        </View> : null}
    </View>
  );
}

export default ContextAwareViz;
