import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Unlink } from 'lucide-react-native';
import type { SharedValue } from 'react-native-reanimated';

import { iconSizes } from '@/theme/iconSizes';
import { AnimatedCompletionIcon } from './AnimatedCompletionIcon';
import { MISSED_BORDER } from './habitDayToggleStyles';
import type { CompletionIcon } from './types';

interface Props {
  completion: SharedValue<number>;
  completionIcon: CompletionIcon;
  completionIconMounted: boolean;
  iconColor: string;
  missed: boolean;
}

export const HabitDayToggleContent: React.FC<Props> = ({
  completion,
  completionIcon,
  completionIconMounted,
  iconColor,
  missed,
}) =>
  missed ? (
    <View
      pointerEvents='none'
      style={StyleSheet.absoluteFill}
      className='items-center justify-center'
    >
      <Unlink color={MISSED_BORDER} size={iconSizes.medium} strokeWidth={2.5} />
    </View>
  ) : (
    <AnimatedCompletionIcon
      completion={completion}
      completionIcon={completionIcon}
      iconColor={iconColor}
      mounted={completionIconMounted}
    />
  );
