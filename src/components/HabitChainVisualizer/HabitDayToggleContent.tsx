import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Unlink } from 'lucide-react-native';

import { iconSizes } from '@/theme/iconSizes';
import { AnimatedCompletionIcon } from './AnimatedCompletionIcon';
import { MISSED_BORDER } from './habitDayToggleStyles';
import type { CompletionIcon } from './types';

interface Props {
  completed: boolean;
  completionIcon: CompletionIcon;
  iconColor: string;
  missed: boolean;
  reduceMotion: boolean;
}

export const HabitDayToggleContent: React.FC<Props> = ({
  completed,
  completionIcon,
  iconColor,
  missed,
  reduceMotion,
}) => {
  if (missed) {
    return (
      <View
        pointerEvents='none'
        style={StyleSheet.absoluteFill}
        className='items-center justify-center'
      >
        <Unlink
          color={MISSED_BORDER}
          size={iconSizes.medium}
          strokeWidth={2.5}
        />
      </View>
    );
  }
  return completed ? (
    <AnimatedCompletionIcon
      completionIcon={completionIcon}
      iconColor={iconColor}
      reduceMotion={reduceMotion}
    />
  ) : null;
};
