import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Unlink } from 'lucide-react-native';
import type { Animated as AnimatedType } from 'react-native';

import { AnimatedCompletionIcon } from './AnimatedCompletionIcon';
import type { CompletionIcon } from './types';

const FORGE_FLASH_COLOR = '#FBBF24';
const MISSED_BORDER = '#DC2626';

interface Props {
  missed: boolean;
  forgeFlash: AnimatedType.Value;
  completion: AnimatedType.Value;
  completionIcon: CompletionIcon | undefined;
  iconColor: string;
}

export const HabitDayToggleContent: React.FC<Props> = ({
  missed,
  forgeFlash,
  completion,
  completionIcon,
  iconColor,
}) => (
  <>
    <Animated.View
      pointerEvents='none'
      style={[
        StyleSheet.absoluteFillObject,
        { backgroundColor: FORGE_FLASH_COLOR, opacity: forgeFlash },
      ]}
    />
    {missed ? (
      <View
        pointerEvents='none'
        style={StyleSheet.absoluteFillObject}
        className='items-center justify-center'
      >
        <Unlink color={MISSED_BORDER} size={18} strokeWidth={2.5} />
      </View>
    ) : (
      <AnimatedCompletionIcon
        completion={completion}
        completionIcon={completionIcon}
        iconColor={iconColor}
      />
    )}
  </>
);
