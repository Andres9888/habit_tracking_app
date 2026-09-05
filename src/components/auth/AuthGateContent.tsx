import { lazy, Suspense, type ReactElement, type ReactNode } from 'react';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';

import HabitsApp from '../../features/habits/HabitsApp';
import WelcomeScreen from '../../screens/auth/WelcomeScreen';
import { durations, enterEasing } from '../../theme/animations';
import type { AuthScreenKey } from './resolveAuthDestination';
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

const ENTER = FadeInDown.duration(durations.enter).easing(enterEasing);
const EXIT = FadeOut.duration(durations.moderate);

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

interface AuthGateContentProps {
  markComplete: () => void;
  onPaywallDismiss: () => void;
  screenKey: AuthScreenKey;
}

function renderAuthScreen({
  markComplete,
  onPaywallDismiss,
  screenKey,
}: AuthGateContentProps): ReactElement {
  switch (screenKey) {
    case 'welcome': {
      return (
        <ScreenShell screenKey='welcome'>
          <WelcomeScreen />
        </ScreenShell>
      );
    }
    case 'onboarding': {
      return (
        <ScreenShell screenKey='onboarding'>
          <OnboardingFlowV2 onComplete={markComplete} />
        </ScreenShell>
      );
    }
    case 'paywall': {
      return (
        <ScreenShell screenKey='paywall'>
          <BrandedLoadingScreen />
          <RevenueCatPaywall visible onClose={onPaywallDismiss} />
        </ScreenShell>
      );
    }
    case 'app': {
      return (
        <ScreenShell screenKey='app' withExit={false}>
          <HabitsApp />
        </ScreenShell>
      );
    }
  }
}

export function AuthGateContent(props: AuthGateContentProps) {
  return (
    <Suspense fallback={<BrandedLoadingScreen />}>
      {renderAuthScreen(props)}
    </Suspense>
  );
}
