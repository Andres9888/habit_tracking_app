/**
 * Search bar component for templates
 */

import { TextInput, TouchableOpacity, View } from 'react-native';
import { Search, X } from 'lucide-react-native';
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
        placeholder={placeholder}
        placeholderTextColor='#a8a29e'
        style={styles.searchInput}
        value={value}
        onChangeText={onChangeText}
      />
      {value ? (
        <TouchableOpacity accessibilityLabel='Clear search' onPress={onClear}>
          <X color='#a8a29e' size={18} strokeWidth={2.25} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
