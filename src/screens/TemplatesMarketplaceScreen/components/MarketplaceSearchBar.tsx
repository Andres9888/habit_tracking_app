/**
 * Marketplace Search Bar Component
 */

import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Search, X } from 'lucide-react-native';
import { useThemeColors } from '@/theme/ThemeContext';

const AnimatedView = Animated.createAnimatedComponent(View);

interface MarketplaceSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
}

export function MarketplaceSearchBar({
  value,
  onChangeText,
  onClear,
}: MarketplaceSearchBarProps) {
  const colors = useThemeColors();

  return (
    <AnimatedView
      entering={FadeInDown.duration(280)}
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Search size={18} color={colors.text.secondary} />
      <TextInput
        style={[styles.input, { color: colors.text.primary }]}
        placeholder="Search templates..."
        placeholderTextColor={colors.text.tertiary}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && onClear && (
        <Pressable
          onPress={onClear}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <X size={18} color={colors.text.secondary} />
        </Pressable>
      )}
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
  },
});
