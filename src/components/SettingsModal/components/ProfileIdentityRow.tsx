/** ProfileIdentityRow — compact account row (avatar · name · plan badge · chevron) */
import { Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { usePremium } from '@/hooks/usePremium';
import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { useThemeColors } from '../../../theme/ThemeContext';
import { typography, fontWeights } from '../../../theme/typography';
import { UserAvatar } from '../UserAvatar';
import { ProfilePremiumBadge } from '../ProfilePremiumBadge';
import { useProfileDisplayImage } from '../useProfileDisplayImage';
import { useProfileDisplayName } from '../useProfileDisplayName';
import { FreePlanBadge } from './FreePlanBadge';

interface ProfileIdentityRowProps {
  isPremium: boolean;
  onPress: () => void;
}

function planBadge(status: string, isPremium: boolean) {
  if (status === 'trialing')
    return <ProfilePremiumBadge label='Trial' variant='compact' />;
  if (isPremium) return <ProfilePremiumBadge label='PRO' variant='compact' />;
  return <FreePlanBadge />;
}

export function ProfileIdentityRow({
  isPremium,
  onPress,
}: ProfileIdentityRowProps) {
  const { colors: themeColors } = useThemeColors();
  const { initial, name } = useProfileDisplayName();
  const { imageUrl } = useProfileDisplayImage();
  const { status } = usePremium();

  return (
    <AnimatedPressable
      accessibilityHint='Opens your account and email settings'
      accessibilityLabel={`Account for ${name}`}
      accessibilityRole='button'
      animationConfig={{ hapticStyle: 'light' }}
      onPress={onPress}
    >
      <View
        className='flex-row items-center px-3.5'
        style={{ gap: 12, minHeight: 72 }}
      >
        <UserAvatar
          imageUrl={imageUrl}
          initial={initial}
          palette={{
            avatarBg: themeColors.primary[100],
            avatarBorderColor: 'transparent',
            avatarBorderWidth: 0,
            avatarTextColor: themeColors.primary[700],
            gradientColors: [themeColors.primary[700], themeColors.primary[600]],
          }}
          size={48}
          useGradient
        />
        <View className='flex-1'>
          <Text
            numberOfLines={1}
            style={{
              ...typography.body,
              fontWeight: fontWeights.semibold,
              color: themeColors.text.primary,
            }}
          >
            {name}
          </Text>
          <Text
            style={{
              ...typography.bodySmall,
              color: themeColors.text.secondary,
            }}
          >
            Account &amp; email
          </Text>
        </View>
        {planBadge(status, isPremium)}
        <ChevronRight
          color={themeColors.text.tertiary}
          size={iconSizes.medium}
        />
      </View>
    </AnimatedPressable>
  );
}
