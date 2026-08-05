import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Unlink } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import type { Animated as AnimatedType } from 'react-native';

import { AnimatedCompletionIcon } from './AnimatedCompletionIcon';
import type { CompletionIcon } from './types';

const FORGE_FLASH_COLOR = '#FBBF24';
const MISSED_BORDER = '#DC2626';

interface Props {
  missed: boolean;
  completed: boolean;
  forgeFlash: AnimatedType.Value;
  /** Only true while a flash is running. The overlay is unmounted otherwise:
   * its opacity is natively driven, and a dropped native update would leave
   * the cell painted amber with no further value change to repaint it. */
  flashActive: boolean;
  completion: AnimatedType.Value;
  completionIcon: CompletionIcon;
  iconColor: string;
}

export const HabitDayToggleContent: React.FC<Props> = ({
  missed,
  completed,
  forgeFlash,
  flashActive,
  completion,
  completionIcon,
  iconColor,
}) => (
  <>
    {flashActive ? (
      <Animated.View
        pointerEvents='none'
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: FORGE_FLASH_COLOR, opacity: forgeFlash },
        ]}
      />
    ) : null}
    {missed ? (
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
    ) : (
      <AnimatedCompletionIcon
        completed={completed}
        completion={completion}
        completionIcon={completionIcon}
        iconColor={iconColor}
      />
    )}
  </>
);
