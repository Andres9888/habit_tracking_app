/** SignOutCard — Apple-style centered red Sign Out card */
import { Text, View } from 'react-native';
import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { shadows } from '../../../theme';
import { typography, fontWeights } from '../../../theme/typography';
import { useThemeColors } from '../../../theme/ThemeContext';

interface SignOutCardProps {
  isLoading: boolean;
  onSignOut: () => void;
}

export function SignOutCard({ isLoading, onSignOut }: SignOutCardProps) {
  const { colors: themeColors } = useThemeColors();

  return (
    <AnimatedPressable
      accessibilityLabel='Sign Out'
      accessibilityRole='button'
      onPress={onSignOut}
    >
      <View
        className='overflow-hidden rounded-2xl'
        style={{
          backgroundColor: themeColors.card,
          borderColor: themeColors.border,
          borderWidth: 1,
          ...shadows.card,
        }}
      >
        <View className='items-center py-4'>
          <Text
            style={{
              ...typography.body,
              fontWeight: fontWeights.semibold,
              color: themeColors.status.error,
            }}
          >
            {isLoading ? 'Signing out...' : 'Sign Out'}
          </Text>
        </View>
      </View>
    </AnimatedPressable>
  );
}
