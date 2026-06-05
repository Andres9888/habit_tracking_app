/** AccountRow — Brand gradient hero card that opens the Account sub-page */
import { useUser } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import { useThemeColors } from '../../theme/ThemeContext';
import { borderRadius, shadows } from '../../theme/spacing';
import { AccountRowContent, type AccountRowPalette } from './AccountRowContent';
import { HighContrastAccountRow } from './HighContrastAccountRow';

interface AccountRowProps {
  highContrastMode: boolean;
  isPremium: boolean;
  onPress: () => void;
}

/** Fixed forest-green gradient (independent of the inverted dark scale) */
const LIGHT_GRADIENT = ['#047857', '#059669', '#10B981'] as const;
const DARK_GRADIENT = ['#065F46', '#047857', '#059669'] as const;

const GRADIENT_PALETTE: AccountRowPalette = {
  avatarBg: 'rgba(255,255,255,0.18)',
  avatarBorderColor: 'rgba(255,255,255,0.35)',
  avatarBorderWidth: 1.5,
  avatarTextColor: '#FFFFFF',
  textColor: '#FFFFFF',
  subColor: 'rgba(255,255,255,0.82)',
  chevronColor: 'rgba(255,255,255,0.85)',
  badgeBg: 'rgba(255,255,255,0.22)',
  badgeFg: '#FFFFFF',
};

export function AccountRow({
  highContrastMode,
  isPremium,
  onPress,
}: AccountRowProps) {
  const { user } = useUser();
  const { isDark } = useThemeColors();

  const name = user?.firstName ?? user?.username ?? 'User';
  const email = user?.primaryEmailAddress?.emailAddress;
  const imageUrl = user?.imageUrl;
  const initial = name.charAt(0).toUpperCase();

  if (highContrastMode) {
    return (
      <HighContrastAccountRow
        email={email}
        imageUrl={imageUrl}
        initial={initial}
        isPremium={isPremium}
        name={name}
        onPress={onPress}
      />
    );
  }

  return (
    <AnimatedPressable
      accessibilityLabel='Account settings'
      accessibilityRole='button'
      onPress={onPress}
    >
      <LinearGradient
        colors={isDark ? DARK_GRADIENT : LIGHT_GRADIENT}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={{
          // Softer card shadow (not the heavy FAB glow) so the hero sits
          // calmly above the green-tinted rows instead of competing with them
          borderRadius: borderRadius.large,
          ...shadows.card,
          shadowColor: '#047857',
        }}
      >
        <AccountRowContent
          avatarSize={48}
          email={email}
          imageUrl={imageUrl}
          initial={initial}
          isPremium={isPremium}
          name={name}
          nameSize={18}
          palette={GRADIENT_PALETTE}
        />
      </LinearGradient>
    </AnimatedPressable>
  );
}
