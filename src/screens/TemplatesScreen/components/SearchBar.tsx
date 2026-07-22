/**
 * Search bar component for templates
 */

import { useRef } from 'react';
import { Keyboard, TextInput, View } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { buildTextInputHintProps } from '@/utils/textInputHintProps';
import { shadows } from '../../../theme/spacing';
import { styles } from '../../templates/templatesScreenStyles';
import { browserPalette } from '../browserPalette';
import { iconSizes } from '@/theme/iconSizes';

interface SearchBarProps {
  autoFocus?: boolean;
  onChangeText: (text: string) => void;
  onClear: () => void;
  inputHint?: string;
  value: string;
}

export function SearchBar({
  autoFocus,
  onChangeText,
  onClear,
  inputHint = 'Search habits',
  value,
}: SearchBarProps) {
  const placeholderColor = browserPalette.textTertiary;
  const inputRef = useRef<TextInput>(null);

  const handleClear = () => {
    inputRef.current?.blur();
    onClear();
  };

  return (
    <View
      testID='templates-search-bar'
      style={[
        styles.searchBar,
        shadows.subtle,
        {
          backgroundColor: browserPalette.chipIdle,
          borderColor: browserPalette.border,
        },
      ]}
    >
      <Search
        color={placeholderColor}
        size={iconSizes.medium}
        strokeWidth={2.5}
      />
      <TextInput
        ref={inputRef}
        autoFocus={autoFocus}
        accessibilityLabel='Search habit library'
        returnKeyType='search'
        style={[
          styles.searchInput,
          {
            color: browserPalette.textPrimary,
            outlineWidth: 0,
            outlineStyle: 'none',
            outlineColor: 'transparent',
          } as unknown as object,
        ]}
        value={value}
        {...buildTextInputHintProps(inputHint, placeholderColor)}
        onChangeText={onChangeText}
        onSubmitEditing={() => Keyboard.dismiss()}
      />
      {value ? (
        <AnimatedPressable
          testID='templates-search-clear'
          accessibilityLabel='Clear search'
          accessibilityRole='button'
          onPress={handleClear}
        >
          <X
            color={placeholderColor}
            size={iconSizes.medium}
            strokeWidth={2.5}
          />
        </AnimatedPressable>
      ) : null}
    </View>
  );
}
