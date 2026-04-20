/**
 * AuthGate Component
 *
 * Authentication boundary that controls app access.
 * Pre-auth users land in the onboarding questionnaire; existing
 * signed-in users skip straight to the app.
 * Syncs user to Convex database on sign-in.
 */

import { useAuth } from '@clerk/clerk-expo';
import { useMutation } from 'convex/react';
import { useEffect, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';

import { api } from '../../../convex/_generated/api';
import HabitsApp from '../../features/habits/HabitsApp';
import { useConvexAuthReady } from '../../providers';
import { BrandedLoadingScreen } from './BrandedLoadingScreen';
import { useOnboardingStatus } from '../../screens/onboarding/useOnboardingStatus';
import { QuestionnaireFlow } from '../../screens/questionnaire/QuestionnaireFlow';
import { useQuestionnaireComplete } from '../../screens/questionnaire/useQuestionnaireComplete';
import WelcomeScreen from '../../screens/auth/WelcomeScreen';

const ENTER = FadeInDown.duration(280).springify().damping(18);
const EXIT = FadeOut.duration(300);

type ScreenKey = 'questionnaire' | 'welcome' | 'app';

function getScreenKey(
  isSignedIn: boolean,
  questionnaireComplete: boolean,
  legacyOnboardingComplete: boolean
): ScreenKey {
  if (isSignedIn && (legacyOnboardingComplete || questionnaireComplete)) {
    return 'app';
  }
  if (questionnaireComplete) return 'welcome';
  return 'questionnaire';
}

export function AuthGate() {
  const { isLoaded, isSignedIn } = useAuth();
  const isConvexReady = useConvexAuthReady();
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);
  const { complete: legacyOnboardingComplete } = useOnboardingStatus(
    isSignedIn ?? false
  );
  const { complete: questionnaireComplete, markComplete } =
    useQuestionnaireComplete();

  const getOrCreateUserRef = useRef(getOrCreateUser);
  getOrCreateUserRef.current = getOrCreateUser;

  useEffect(() => {
    if (isSignedIn && isConvexReady) {
      void getOrCreateUserRef.current().catch((error_: unknown) => {
        if (__DEV__) console.error('Failed to sync user:', error_);
      });
    }
  }, [isSignedIn, isConvexReady]);

  const questionnaireHydrated = questionnaireComplete !== null;
  const legacyHydrated = !isSignedIn || legacyOnboardingComplete !== null;
  if (!isLoaded || !questionnaireHydrated || !legacyHydrated) {
    return <BrandedLoadingScreen />;
  }

  const screenKey = getScreenKey(
    isSignedIn ?? false,
    questionnaireComplete ?? false,
    legacyOnboardingComplete ?? false
  );

  return (
    <GestureHandlerRootView className='flex-1'>
      {screenKey === 'questionnaire' ? (
        <Animated.View
          key='questionnaire'
          entering={ENTER}
          exiting={EXIT}
          style={{ flex: 1 }}
        >
          <QuestionnaireFlow onComplete={markComplete} />
        </Animated.View>
      ) : null}
      {screenKey === 'welcome' ? (
        <Animated.View
          key='welcome'
          entering={ENTER}
          exiting={EXIT}
          style={{ flex: 1 }}
        >
          <WelcomeScreen />
        </Animated.View>
      ) : null}
      {screenKey === 'app' ? (
        <Animated.View key='app' entering={ENTER} style={{ flex: 1 }}>
          <HabitsApp />
        </Animated.View>
      ) : null}
    </GestureHandlerRootView>
  );
}
