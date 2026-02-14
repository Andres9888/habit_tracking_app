/**
 * Search bar component for templates
 */

import { TextInput, View } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { styles } from '../../templates/templatesScreenStyles';

interface SearchBarProps {
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
  value: string;
}

export function SearchBar({
  onChangeText,
  onClear,
  placeholder = 'Search habits...',
  value,
}: SearchBarProps) {
  return (
    <View style={styles.searchBar}>
      <Search color='#a8a29e' size={18} strokeWidth={2.25} />
      <TextInput
        accessibilityLabel='Search habits'
        placeholder={placeholder}
        placeholderTextColor='#a8a29e'
        returnKeyType='search'
        style={styles.searchInput}
        value={value}
        onChangeText={onChangeText}
      />
      {value ? (
        <AnimatedPressable
          accessibilityLabel='Clear search'
          accessibilityRole='button'
          onPress={onClear}
        >
          <X color='#a8a29e' size={18} strokeWidth={2.25} />
        </AnimatedPressable>
      ) : null}
    </View>
  );
}
