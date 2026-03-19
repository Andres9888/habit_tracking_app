/** SignOutCard — Apple-style centered red Sign Out card */
import { Text, View } from 'react-native';
import { AnimatedPressable } from '../../ui/AnimatedPressable';
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
  const { colors: themeColors, isDark } = useThemeColors();

  const cardBg = highContrastMode ? '#111111' : themeColors.card;
  const borderColor = highContrastMode ? '#2f2f2f' : undefined;

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
          borderWidth: highContrastMode ? 1 : 0,
          elevation: highContrastMode ? 0 : 3,
          shadowColor: isDark ? '#000' : '#1c1917',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: highContrastMode ? 0 : 0.08,
          shadowRadius: 16,
        }}
      >
        <View className='items-center py-4'>
          <Text className='text-[16px] font-semibold' style={{ color: '#ef4444' }}>
            {isLoading ? 'Signing out...' : 'Sign Out'}
          </Text>
        </View>
      </View>
    </AnimatedPressable>
  );
}
