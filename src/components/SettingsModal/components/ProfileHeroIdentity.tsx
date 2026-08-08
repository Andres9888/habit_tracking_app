/** ProfileHeroIdentity — name + plan badge + "edit account" affordance line.
 *  Spec 4a moved streak/stat surfacing out of Settings entirely. */
import { Text, View } from 'react-native';
import { usePremium } from '@/hooks/usePremium';
import { useThemeColors } from '../../../theme/ThemeContext';
import {
  fontFamilies,
  typography,
  fontWeights,
} from '../../../theme/typography';
import { ProfilePremiumBadge } from '../ProfilePremiumBadge';
import { daysLeftUntil } from '../sections/trialDaysLeft';

interface ProfileHeroIdentityProps {
  isPremium: boolean;
  name: string;
}

function planBadgeLabel(status: string, isPremium: boolean): string | null {
  if (status === 'trialing') return 'Trial';
  if (isPremium) return 'PRO';
  return null;
}

export function ProfileHeroIdentity({
  isPremium,
  name,
}: ProfileHeroIdentityProps) {
  const { colors: themeColors } = useThemeColors();
  const { status, expirationDate } = usePremium();
  const badgeLabel = planBadgeLabel(status, isPremium);
  const trialDays = daysLeftUntil(expirationDate);
  const planLine =
    status === 'trialing'
      ? `Trial (${trialDays} ${trialDays === 1 ? 'day' : 'days'} left)`
      : isPremium
        ? 'Plan: Pro'
        : 'Plan: Free';

  return (
    <View className='min-w-0 flex-1'>
      <View className='flex-row items-center' style={{ gap: 6 }}>
        <Text
          numberOfLines={1}
          style={{
            // Serif name, like the Habit Browser card title.
            fontFamily: fontFamilies.serif,
            flexShrink: 1,
            fontSize: 19,
            fontWeight: fontWeights.bold,
            letterSpacing: -0.2,
            color: themeColors.text.primary,
          }}
        >
          {name}
        </Text>
        {badgeLabel ? (
          <ProfilePremiumBadge label={badgeLabel} variant='compact' />
        ) : null}
      </View>
      <Text
        numberOfLines={1}
        style={{
          ...typography.caption,
          marginTop: 2,
          color: themeColors.text.secondary,
        }}
      >
        {planLine}. Plan, billing, email &amp; sign out
      </Text>
    </View>
  );
}
