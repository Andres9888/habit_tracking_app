/**
 * VizFieldsList Component
 * Renders the list of visualization fields (body, mind, emotion)
 */

import React from 'react';
import { View } from 'react-native';
import { Brain, Heart, User } from 'lucide-react-native';
import { VizField } from './VizField';
import { EmptyVizState } from './EmptyVizState';
import { useThemeColors } from '../../../../theme/ThemeContext';

export interface VizFieldsListProps {
  failureBody?: string;
  failureMind?: string;
  failureEmotion?: string;
  reduceMotion: boolean;
}

export function VizFieldsList({
  failureBody,
  failureMind,
  failureEmotion,
  reduceMotion,
}: VizFieldsListProps) {
  const { colors } = useThemeColors();
  const hasAnyField = failureBody || failureMind || failureEmotion;

  if (!hasAnyField) {
    return <EmptyVizState />;
  }

  return (
    <View className='gap-1'>
      {failureBody ? <VizField
          icon={<User color={colors.status.error} size={16} />}
          index={0}
          label='Body'
          reduceMotion={reduceMotion}
          value={failureBody}
        /> : null}
      {failureMind ? <VizField
          icon={<Brain color={colors.status.error} size={16} />}
          index={1}
          label='Mind'
          reduceMotion={reduceMotion}
          value={failureMind}
        /> : null}
      {failureEmotion ? <VizField
          icon={<Heart color={colors.status.error} size={16} />}
          index={2}
          label='Emotion'
          reduceMotion={reduceMotion}
          value={failureEmotion}
        /> : null}
    </View>
  );
}
