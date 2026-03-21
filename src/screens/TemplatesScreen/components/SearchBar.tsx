/**
 * Search bar component for templates
 */

import { TextInput, View } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { buildTextInputHintProps } from '@/utils/textInputHintProps';
import { useThemeColors } from '../../../theme/ThemeContext';
import { styles } from '../../templates/templatesScreenStyles';

interface SearchBarProps {
  onChangeText: (text: string) => void;
  onClear: () => void;
  inputHint?: string;
  value: string;
}

export function SearchBar({
  onChangeText,
  onClear,
  inputHint = 'Search for habits...',
  value,
}: SearchBarProps) {
  const { colors } = useThemeColors();
  const placeholderColor = colors.text.tertiary;

  return (
    <View
      testID="templates-search-bar"
      style={[
        styles.searchBar,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Search color={placeholderColor} size={18} strokeWidth={2.25} />
      <TextInput
        accessibilityLabel='Search habits'
        returnKeyType='search'
        style={[styles.searchInput, { color: colors.text.primary }]}
        value={value}
        {...buildTextInputHintProps(inputHint, placeholderColor)}
        onChangeText={onChangeText}
      />
      {value ? (
        <AnimatedPressable
          testID="templates-search-clear"
          accessibilityLabel='Clear search'
          accessibilityRole='button'
          onPress={onClear}
        >
          <X color={placeholderColor} size={18} strokeWidth={2.25} />
        </AnimatedPressable>
      ) : null}
    </View>
  );
}
