/** SignOutCard — Apple-style centered red Sign Out card */
import { Text, View } from 'react-native';
import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { shadows } from '../../../theme';
import { typography, fontWeights } from '../../../theme/typography';
import { useThemeColors } from '../../../theme/ThemeContext';

interface SignOutCardProps {
  isLoading: boolean;
  highContrastMode: boolean;
  onSignOut: () => void;
}

export function SignOutCard({
  isLoading,
  highContrastMode,
  onSignOut,
}: SignOutCardProps) {
  const { colors: themeColors } = useThemeColors();

  const cardBg = highContrastMode ? themeColors.gray[900] : themeColors.card;
  const borderColor = highContrastMode
    ? themeColors.gray[700]
    : themeColors.border;

  return (
    <AnimatedPressable
      accessibilityLabel='Sign Out'
      accessibilityRole='button'
      onPress={onSignOut}
    >
      <View
        className='overflow-hidden rounded-2xl'
        style={{
          backgroundColor: cardBg,
          borderColor,
          borderWidth: 1,
          ...(highContrastMode
            ? { elevation: 0, shadowColor: 'transparent' }
            : shadows.card),
        }}
      >
        <View className='items-center py-4'>
          <Text
            style={{ ...typography.body, fontWeight: fontWeights.semibold, color: themeColors.status.error }}
          >
            {isLoading ? 'Signing out...' : 'Sign Out'}
          </Text>
        </View>
      </View>
    </AnimatedPressable>
  );
}
