/**
 * Dashed "+" tile that closes the 5-column icon grid and opens the full
 * emoji sheet. Spec §2 — tenth tile, 1px dashed neutral.
 */
import { Plus } from 'lucide-react-native';
import { memo } from 'react';
import { Pressable, View } from 'react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '@/theme/ThemeContext';

interface BrowseTileProps {
  size: number;
  onPress: () => void;
}

function BrowseTileComponent({ size, onPress }: BrowseTileProps) {
  const { colors } = useThemeColors();
  return (
    <View
      style={{
        alignItems: 'center',
        height: size,
        justifyContent: 'center',
        width: size,
      }}
    >
      <Pressable
        accessibilityHint='Opens the full emoji picker'
        accessibilityLabel='Browse all emojis'
        accessibilityRole='button'
        style={{
          alignItems: 'center',
          borderColor: colors.gray[300],
          borderRadius: 16,
          borderStyle: 'dashed',
          borderWidth: 1,
          height: size,
          justifyContent: 'center',
          width: size,
        }}
        testID='emoji-browse-tile'
        onPress={onPress}
      >
        <Plus color={colors.gray[300]} size={iconSizes.large} />
      </Pressable>
    </View>
  );
}

export const BrowseTile = memo(BrowseTileComponent);
