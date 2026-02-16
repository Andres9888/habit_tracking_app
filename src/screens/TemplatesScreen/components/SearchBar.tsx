/**
 * Search bar component for templates
 */

import { TextInput, View } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useThemeColors } from '../../../theme/ThemeContext';
import { styles } from '../../templates/templatesScreenStyles';
import { sanitizeSearchQuery } from '../../../utils/inputSanitization';

interface SearchBarProps {
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
  value: string;
}

export function SearchBar({
  onChangeText,
  onClear,
  placeholder = 'Search for habits...',
  value,
}: SearchBarProps) {
  const { colors, isDark } = useThemeColors();
  const placeholderColor = colors.text.tertiary;

  const handleTextChange = (text: string) => {
    const sanitized = sanitizeSearchQuery(text);
    onChangeText(sanitized);
  };

  return (
    <View
      style={[
        styles.searchBar,
        isDark && { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Search color={placeholderColor} size={18} strokeWidth={2.25} />
      <TextInput
        accessibilityLabel='Search habits'
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        returnKeyType='search'
        style={[styles.searchInput, { color: colors.text.primary }]}
        value={value}
        onChangeText={handleTextChange}
      />
      {value ? (
        <AnimatedPressable
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
