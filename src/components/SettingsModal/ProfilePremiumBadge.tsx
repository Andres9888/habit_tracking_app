/** ProfilePremiumBadge — PRO label beside display name */
import { Text, View } from 'react-native';
import { Crown } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../theme/ThemeContext';
import { typography, fontWeights } from '../../theme/typography';

interface ProfilePremiumBadgeProps {
  variant?: 'compact' | 'standard';
  /** Badge text — 'PRO' for an active subscription, 'Trial' during a free trial. */
  label?: string;
}

export function ProfilePremiumBadge({
  variant = 'standard',
  label = 'PRO',
}: ProfilePremiumBadgeProps) {
  const { colors: themeColors } = useThemeColors();
  const isCompact = variant === 'compact';

  return (
    <View
      className={`flex-row items-center ${isCompact ? 'rounded-md px-1.5 py-0.5' : 'mt-1.5 rounded-lg px-2 py-0.5'}`}
      style={{
        backgroundColor: themeColors.status.warningLight,
        gap: isCompact ? 3 : 4,
      }}
    >
      <Crown color={themeColors.status.warningText} size={iconSizes.micro} />
      <Text
        className={isCompact ? undefined : 'text-xs font-bold'}
        style={{
          ...(isCompact ? typography.tabBar : {}),
          color: themeColors.status.warningText,
          fontWeight: fontWeights.bold,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
