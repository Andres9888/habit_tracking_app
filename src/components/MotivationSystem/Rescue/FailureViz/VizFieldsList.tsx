/**
 * VizFieldsList Component
 * Renders the list of visualization fields (body, mind, emotion)
 */

import React from 'react';
import { View } from 'react-native';
import { Brain, Heart, User } from 'lucide-react-native';
import { VizField } from './VizField';
import { EmptyVizState } from './EmptyVizState';

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
  const hasAnyField = failureBody || failureMind || failureEmotion;

  if (!hasAnyField) {
    return <EmptyVizState />;
  }

  return (
    <View className='gap-1'>
      {failureBody && (
        <VizField
          icon={<User className='text-rose-500' size={16} />}
          index={0}
          label='Body'
          reduceMotion={reduceMotion}
          value={failureBody}
        />
      )}
      {failureMind && (
        <VizField
          icon={<Brain className='text-rose-500' size={16} />}
          index={1}
          label='Mind'
          reduceMotion={reduceMotion}
          value={failureMind}
        />
      )}
      {failureEmotion && (
        <VizField
          icon={<Heart className='text-rose-500' size={16} />}
          index={2}
          label='Emotion'
          reduceMotion={reduceMotion}
          value={failureEmotion}
        />
      )}
    </View>
  );
}
