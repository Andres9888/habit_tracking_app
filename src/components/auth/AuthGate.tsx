/**
 * AuthGate Component
 *
 * Authentication boundary that controls app access.
 * Pre-auth users land in the onboarding questionnaire; mid-flow signed-in
 * users finish the paywall step, and existing users skip straight to the
 * app. Syncs user to Convex database on sign-in.
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
import { QuestionnaireFlow } from '../../screens/questionnaire/QuestionnaireFlow';
import { useQuestionnaireComplete } from '../../screens/questionnaire/useQuestionnaireComplete';
import WelcomeScreen from '../../screens/auth/WelcomeScreen';

const ENTER = FadeInDown.duration(280).springify().damping(18);
const EXIT = FadeOut.duration(300);

type ScreenKey = 'questionnaire' | 'welcome' | 'app';

interface RouteArgs {
  isSignedIn: boolean;
  questionnaireComplete: boolean;
  questionnaireInProgress: boolean;
}

function getScreenKey({
  isSignedIn,
  questionnaireComplete,
  questionnaireInProgress,
}: RouteArgs): ScreenKey {
  if (!isSignedIn) return questionnaireComplete ? 'welcome' : 'questionnaire';
  if (questionnaireComplete) return 'app';
  if (questionnaireInProgress) return 'questionnaire';
  return 'app';
}

export function AuthGate() {
  const { isLoaded, isSignedIn } = useAuth();
  const isConvexReady = useConvexAuthReady();
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);
  const {
    complete: questionnaireComplete,
    inProgress: questionnaireInProgress,
    markComplete,
  } = useQuestionnaireComplete();

  const getOrCreateUserRef = useRef(getOrCreateUser);
  getOrCreateUserRef.current = getOrCreateUser;

  useEffect(() => {
    if (isSignedIn && isConvexReady) {
      void getOrCreateUserRef.current().catch((error_: unknown) => {
        if (__DEV__) console.error('Failed to sync user:', error_);
      });
    }
  }, [isSignedIn, isConvexReady]);

  if (!isLoaded || questionnaireComplete === null) {
    return <BrandedLoadingScreen />;
  }

  const screenKey = getScreenKey({
    isSignedIn: isSignedIn ?? false,
    questionnaireComplete: questionnaireComplete ?? false,
    questionnaireInProgress,
  });

  return (
    <GestureHandlerRootView className='flex-1'>
      {screenKey === 'questionnaire' ? (
        <Animated.View
          key='questionnaire'
          entering={ENTER}
          exiting={EXIT}
          style={{ flex: 1 }}
        >
          <QuestionnaireFlow
            isSignedIn={isSignedIn ?? false}
            onComplete={markComplete}
          />
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
