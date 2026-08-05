/** ProfileHeroIdentity — name + plan badge + "edit account" affordance line.
 *  Spec 4a moved streak/stat surfacing out of Settings entirely. */
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
    <View className='min-w-0 flex-1'>
      <View className='flex-row items-center' style={{ gap: 6 }}>
        <Text
          numberOfLines={1}
          style={{
            ...typography.body,
            flexShrink: 1,
            fontSize: 16.5,
            fontWeight: fontWeights.semibold,
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
        Edit name, photo &amp; account
      </Text>
    </View>
  );
}
