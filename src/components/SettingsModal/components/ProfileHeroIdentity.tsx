/** ProfileHeroIdentity — name + plan badge + streak headline column */
import { Text, View } from 'react-native';
import { usePremium } from '@/hooks/usePremium';
import { useThemeColors } from '../../../theme/ThemeContext';
import { typography, fontWeights } from '../../../theme/typography';
import { ProfilePremiumBadge } from '../ProfilePremiumBadge';

interface ProfileHeroIdentityProps {
  isPremium: boolean;
  name: string;
  currentStreak: number;
}

function planBadgeLabel(status: string, isPremium: boolean): string | null {
  if (status === 'trialing') return 'Trial';
  if (isPremium) return 'PRO';
  return null;
}

export function ProfileHeroIdentity({
  isPremium,
  name,
  currentStreak,
}: ProfileHeroIdentityProps) {
  const { colors: themeColors } = useThemeColors();
  const { status } = usePremium();
  const badgeLabel = planBadgeLabel(status, isPremium);

  return (
    <View className='flex-1'>
      <View className='flex-row items-center' style={{ gap: 6 }}>
        <Text
          style={{
            ...typography.heading3,
            color: themeColors.text.primary,
            fontWeight: fontWeights.bold,
          }}
        >
          {name}
        </Text>
        {badgeLabel ? (
          <ProfilePremiumBadge label={badgeLabel} variant='compact' />
        ) : null}
      </View>
      <View className='mt-1 flex-row items-baseline' style={{ gap: 5 }}>
        <Text
          style={{
            ...typography.displayLarge,
            fontSize: 30,
            lineHeight: 32,
            color: themeColors.status.streakText,
          }}
        >
          {currentStreak}
        </Text>
        <Text
          style={{
            ...typography.bodySmall,
            fontWeight: fontWeights.semibold,
            color: themeColors.text.secondary,
          }}
        >
          day streak
        </Text>
        <Text style={{ fontSize: 15 }}>🔥</Text>
      </View>
    </View>
  );
}
