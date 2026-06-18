/** ProfilePremiumBadge — PRO label beside display name (amber crown, "Depth" style) */
import { Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../theme/ThemeContext';
import { typography, fontWeights } from '../../theme/typography';

interface ProfilePremiumBadgeProps {
  variant?: 'compact' | 'standard';
}

/** Warm top-light amber gradient — lifts the pill off the card. */
const GRADIENT = {
  light: ['#FFF6DC', '#FCEBB6'] as const,
  dark: ['rgba(245,158,11,0.24)', 'rgba(245,158,11,0.13)'] as const,
};
const BORDER = { light: 'rgba(180,83,9,0.22)', dark: 'rgba(253,230,138,0.24)' };

export function ProfilePremiumBadge({
  variant = 'standard',
}: ProfilePremiumBadgeProps) {
  const { colors: themeColors, isDark } = useThemeColors();
  const isCompact = variant === 'compact';
  const tint = themeColors.status.warningText;

  return (
    <LinearGradient
      colors={isDark ? GRADIENT.dark : GRADIENT.light}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: isCompact ? 3 : 4,
        marginTop: isCompact ? 0 : 6,
        borderRadius: isCompact ? 6 : 8,
        paddingHorizontal: isCompact ? 6 : 8,
        paddingVertical: 2,
        borderWidth: 1,
        borderColor: isDark ? BORDER.dark : BORDER.light,
        shadowColor: '#B45309',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0 : 0.28,
        shadowRadius: 3,
        elevation: isDark ? 0 : 1,
      }}
    >
      <Crown color={tint} size={iconSizes.micro} />
      <Text
        className={isCompact ? undefined : 'text-xs font-bold'}
        style={{
          ...(isCompact ? typography.tabBar : {}),
          color: tint,
          fontWeight: fontWeights.bold,
        }}
      >
        PRO
      </Text>
    </LinearGradient>
  );
}
