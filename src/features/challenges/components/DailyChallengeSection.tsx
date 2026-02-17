/**
 * DailyChallengeSection - Container that manages challenge state
 * and renders the DailyChallengeCard when appropriate.
 *
 * Drop this into any list header/footer to show daily challenges.
 */

import { View } from 'react-native';
import { DailyChallengeCard } from './DailyChallengeCard';
import { useDailyChallenges } from '../useDailyChallenges';

interface DailyChallengeSectionProps {
  isPremiumUser: boolean;
  reduceMotion: boolean;
}

export function DailyChallengeSection({
  isPremiumUser,
  reduceMotion,
}: DailyChallengeSectionProps) {
  const {
    activeChallenge,
    isLoading,
    completeChallenge,
    dismissChallenge,
  } = useDailyChallenges(isPremiumUser);

  if (
    isLoading ||
    !activeChallenge ||
    activeChallenge.dismissed ||
    activeChallenge.completed
  ) {
    return null;
  }

  return (
    <View style={{ paddingHorizontal: 0, marginTop: 4 }}>
      <DailyChallengeCard
        challenge={activeChallenge}
        isPremiumUser={isPremiumUser}
        reduceMotion={reduceMotion}
        onComplete={completeChallenge}
        onDismiss={dismissChallenge}
      />
    </View>
  );
}
