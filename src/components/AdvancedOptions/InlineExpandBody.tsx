/** Animated wrapper for a pop-mounted inline body driven by useInlineExpand. */
import type { ReactNode } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import type { useInlineExpand } from './useInlineExpand';

interface Props {
  open: boolean;
  expand: ReturnType<typeof useInlineExpand>;
  children: ReactNode;
}

export function InlineExpandBody({ open, expand, children }: Props) {
  return (
    <Animated.View
      accessibilityElementsHidden={!open}
      importantForAccessibility={open ? 'auto' : 'no-hide-descendants'}
      pointerEvents={open ? 'auto' : 'none'}
      style={expand.contentAnimatedStyle}
    >
      <View onLayout={expand.onContentLayout}>{children}</View>
    </Animated.View>
  );
}
