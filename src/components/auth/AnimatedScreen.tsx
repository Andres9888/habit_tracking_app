import type { ReactNode } from 'react';

import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface AnimatedScreenProps {
  children: ReactNode;
  /** Omit exit animation for the final app screen (it never exits). */
  noExit?: boolean;
}

/**
 * Wrapper that applies a consistent fade transition to each auth screen.
 * Used by AuthGate to animate between welcome → onboarding → app.
 */
export function AnimatedScreen({ children, noExit }: AnimatedScreenProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={noExit ? undefined : FadeOut.duration(300)}
      style={{ flex: 1 }}
    >
      {children}
    </Animated.View>
  );
}
