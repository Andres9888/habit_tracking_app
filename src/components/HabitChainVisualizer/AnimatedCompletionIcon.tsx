import React from 'react';
import { StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import Animated, {
  type SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { iconSizes } from '@/theme/iconSizes';
import { colors } from '@/theme/colors';
import { ChainLinkIcon } from '../ChainLinkIcon/ChainLinkIcon';

interface Props {
  completion: SharedValue<number>;
  completionIcon: 'checkbox' | 'chain';
  iconColor?: string;
  mounted: boolean;
}

export function AnimatedCompletionIcon({
  completion,
  completionIcon,
  iconColor,
  mounted,
}: Props) {
  const iconStyle = useAnimatedStyle(() => ({ opacity: completion.value }));
  if (!mounted) return null;
  const resolvedColor = iconColor ?? colors.text.inverse;
  const icon =
    completionIcon === 'checkbox' ? (
      <Check color={resolvedColor} size={iconSizes.medium} strokeWidth={2.5} />
    ) : (
      <ChainLinkIcon
        color={resolvedColor}
        size={iconSizes.medium}
        variant='stroke'
      />
    );
  return (
    <Animated.View
      pointerEvents='none'
      style={[StyleSheet.absoluteFill, styles.center, iconStyle]}
    >
      {icon}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
});
