/** SettingsSearchField — live filter for the settings list (sits below the hero) */
import { Pressable, View } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { typography } from '@/theme/typography';
import { useThemeColors } from '../../../theme/ThemeContext';
import { ThemedTextInput } from '../../ui/TextInput';
import { getRaisedSurface } from '../raisedSurface';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
}

export function SettingsSearchField({ value, onChangeText, onClear }: Props) {
  const { colors: themeColors, isDark } = useThemeColors();

  return (
    <View
      className='flex-row items-center'
      // -8 tightens the gap to the profile hero above (see design handoff)
      style={{
        backgroundColor: getRaisedSurface(isDark),
        borderColor: themeColors.border,
        borderRadius: 12,
        borderWidth: 1,
        gap: 8,
        marginTop: -8,
        paddingHorizontal: 12,
        paddingVertical: 10,
      }}
    >
      <Search color={themeColors.text.tertiary} size={iconSizes.medium} />
      <ThemedTextInput
        accessibilityHint='Filters settings as you type'
        accessibilityLabel='Search settings'
        clearButtonMode='never'
        placeholder='Search settings'
        returnKeyType='search'
        style={{
          ...typography.body,
          color: themeColors.text.primary,
          flex: 1,
          padding: 0,
        }}
        value={value}
        onChangeText={onChangeText}
      />
      {value.length > 0 ? (
        <Pressable
          accessibilityLabel='Clear search'
          accessibilityRole='button'
          hitSlop={8}
          onPress={onClear}
        >
          <X color={themeColors.text.tertiary} size={iconSizes.medium} />
        </Pressable>
      ) : null}
    </View>
  );
}
