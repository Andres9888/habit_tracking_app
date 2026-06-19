/** SettingsSearchField — quiet search input with leading icon and clear button */
import { Pressable, TextInput, View } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../../theme/ThemeContext';

interface SettingsSearchFieldProps {
  value: string;
  onChangeText: (t: string) => void;
}

export function SettingsSearchField({
  value,
  onChangeText,
}: SettingsSearchFieldProps) {
  const { colors, isDark } = useThemeColors();

  const fillColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(45,42,38,0.045)';

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: fillColor,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 9,
        marginHorizontal: 16,
        marginBottom: 8,
        gap: 8,
      }}
    >
      <Search
        color={colors.text.secondary}
        size={iconSizes.small}
        strokeWidth={2}
      />
      <TextInput
        accessible
        accessibilityLabel='Search settings'
        placeholder='Search settings'
        placeholderTextColor={colors.text.secondary}
        returnKeyType='search'
        value={value}
        style={{
          flex: 1,
          fontSize: 16,
          color: colors.text.primary,
          padding: 0,
        }}
        onChangeText={onChangeText}
      />
      {value.length > 0 ? (
        <Pressable
          accessibilityLabel='Clear search'
          accessibilityRole='button'
          hitSlop={8}
          style={{ padding: 2 }}
          onPress={() => onChangeText('')}
        >
          <X
            color={colors.text.secondary}
            size={iconSizes.small}
            strokeWidth={2}
          />
        </Pressable>
      ) : null}
    </View>
  );
}
