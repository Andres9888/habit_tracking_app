import { useMemo } from 'react';

interface PremiumCTA {
  text: string;
  benefit: string;
}

export function useRewardToastContent(streak: number | undefined) {
  const title = useMemo(() => {
    if (typeof streak === 'number' && streak > 0) {
      return `🔥 ${streak} day streak unlocked`;
    }
    return 'Momentum boost unlocked';
  }, [streak]);

  const premiumCTA = useMemo((): PremiumCTA => {
    if (!streak || streak < 7) {
      return {
        benefit: 'Science-backed habits from experts',
        text: 'Get Premium Habits',
      };
    }
    if (streak < 14) {
      return {
        benefit: 'Never lose progress on rest days',
        text: 'Unlock Streak Protection',
      };
    }
    if (streak < 30) {
      return {
        benefit: 'See your trends & insights',
        text: 'Get Advanced Analytics',
      };
    }
    return {
      benefit: 'Connect with 10k+ habit builders',
      text: 'Join Premium Community',
    };
  }, [streak]);

  return { premiumCTA, title };
}
