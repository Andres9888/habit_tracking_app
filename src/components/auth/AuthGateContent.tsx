import { lazy, Suspense, type ReactNode } from 'react';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';

import HabitsApp from '../../features/habits/HabitsApp';
import WelcomeScreen from '../../screens/auth/WelcomeScreen';
import { enterEasing } from '../../theme/animations';
import { BrandedLoadingScreen } from './BrandedLoadingScreen';

const OnboardingFlowV2 = lazy(() =>
  import('../../screens/onboarding-v2').then((module) => ({
    default: module.OnboardingFlowV2,
  }))
);
const RevenueCatPaywall = lazy(() =>
  import('../RevenueCatPaywall').then((module) => ({
    default: module.RevenueCatPaywall,
  }))
);

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
  let content: ReactNode;

  switch (screenKey) {
    case 'welcome': {
      content = (
        <ScreenShell screenKey='welcome'>
          <WelcomeScreen />
        </ScreenShell>
      );
      break;
    }
    case 'onboarding': {
      content = (
        <ScreenShell screenKey='onboarding'>
          <OnboardingFlowV2 onComplete={markComplete} />
        </ScreenShell>
      );
      break;
    }
    case 'paywall': {
      content = (
        <ScreenShell screenKey='paywall'>
          <BrandedLoadingScreen />
          <RevenueCatPaywall visible onClose={onPaywallDismiss} />
        </ScreenShell>
      );
      break;
    }
    default: {
      content = (
        <ScreenShell screenKey='app' withExit={false}>
          <HabitsApp />
        </ScreenShell>
      );
    }
  }

  return <Suspense fallback={<BrandedLoadingScreen />}>{content}</Suspense>;
}
