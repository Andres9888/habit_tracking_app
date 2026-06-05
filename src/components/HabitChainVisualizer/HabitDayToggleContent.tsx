import { StyleSheet, View } from 'react-native';
import { Unlink } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import type { Animated as AnimatedType } from 'react-native';

import { AnimatedCompletionIcon } from './AnimatedCompletionIcon';
import type { CompletionIcon } from './types';

const MISSED_BORDER = '#DC2626';

interface Props {
  missed: boolean;
  completed: boolean;
  completion: AnimatedType.Value;
  completionIcon: CompletionIcon | undefined;
  iconColor: string;
}

export function HabitDayToggleContent({
  missed,
  completed,
  completion,
  completionIcon,
  iconColor,
}: Props) {
  return missed ? (
    <View
      pointerEvents='none'
      style={StyleSheet.absoluteFillObject}
      className='items-center justify-center'
    >
      <Unlink color={MISSED_BORDER} size={iconSizes.medium} strokeWidth={2.5} />
    </View>
  ) : (
    <AnimatedCompletionIcon
      completed={completed}
      completion={completion}
      completionIcon={completionIcon ?? 'chain'}
      iconColor={iconColor}
    />
  );
}
