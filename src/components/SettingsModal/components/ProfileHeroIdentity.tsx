/** ProfileHeroIdentity — name + plan badge + account-entry subtitle column */
import { Text, View } from 'react-native';
import { usePremium } from '@/hooks/usePremium';
import { useThemeColors } from '../../../theme/ThemeContext';
import { typography, fontWeights } from '../../../theme/typography';
import { ProfilePremiumBadge } from '../ProfilePremiumBadge';

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
  const { status } = usePremium();
  const badgeLabel = planBadgeLabel(status, isPremium);

  return (
    <View className='flex-1'>
      <View className='flex-row items-center' style={{ gap: 6 }}>
        <Text
          numberOfLines={1}
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
      <Text
        className='mt-1'
        numberOfLines={1}
        style={{
          ...typography.bodySmall,
          color: themeColors.text.secondary,
        }}
      >
        Manage account & subscription
      </Text>
    </View>
  );
}
