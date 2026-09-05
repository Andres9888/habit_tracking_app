/**
 * "Browse more emojis →" link under the legacy triangle layout.
 */
import { Pressable, Text } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

export function BrowseMoreLink({ onPress }: { onPress: () => void }) {
  const { colors } = useThemeColors();
  return (
    <Pressable
      accessibilityHint='Opens full emoji picker with hundreds of options'
      accessibilityLabel='Browse more emojis'
      accessibilityRole='button'
      className='mt-3 flex-row items-center justify-center'
      style={{ minHeight: 44 }}
      onPress={onPress}
    >
      <Text className='text-sm font-medium' style={{ color: colors.primary[600] }}>
        Browse more emojis →
      </Text>
    </Pressable>
  );
}
