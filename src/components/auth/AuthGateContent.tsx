import type { ReactNode } from 'react';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';

import HabitsApp from '../../features/habits/HabitsApp';
import { OnboardingFlowV2 } from '../../screens/onboarding-v2';
import WelcomeScreen from '../../screens/auth/WelcomeScreen';
import { enterEasing } from '../../theme/animations';
import { RevenueCatPaywall } from '../RevenueCatPaywall';
import { BrandedLoadingScreen } from './BrandedLoadingScreen';

export type AuthScreenKey = 'welcome' | 'onboarding' | 'paywall' | 'app';

const ENTER = FadeInDown.duration(280).easing(enterEasing);
const EXIT = FadeOut.duration(300);

function ScreenShell({
  children,
  screenKey,
  withExit = true,
}: {
  children: ReactNode;
  screenKey: AuthScreenKey;
  withExit?: boolean;
}) {
  return (
    <Animated.View
      key={screenKey}
      entering={ENTER}
      exiting={withExit ? EXIT : undefined}
      style={{ flex: 1 }}
    >
      {children}
    </Animated.View>
  );
}

export function AuthGateContent({
  markComplete,
  onPaywallDismiss,
  screenKey,
}: {
  markComplete: () => void;
  onPaywallDismiss: () => void;
  screenKey: AuthScreenKey;
}) {
  if (screenKey === 'welcome') {
    return (
      <ScreenShell screenKey='welcome'>
        <WelcomeScreen />
      </ScreenShell>
    );
  }
  if (screenKey === 'onboarding') {
    return (
      <ScreenShell screenKey='onboarding'>
        <OnboardingFlowV2 onComplete={markComplete} />
      </ScreenShell>
    );
  }
  if (screenKey === 'paywall') {
    return (
      <ScreenShell screenKey='paywall'>
        <BrandedLoadingScreen />
        <RevenueCatPaywall visible onClose={onPaywallDismiss} />
      </ScreenShell>
    );
  }
  return (
    <ScreenShell screenKey='app' withExit={false}>
      <HabitsApp />
    </ScreenShell>
  );
}
