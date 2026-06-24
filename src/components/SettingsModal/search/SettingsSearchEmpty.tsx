/** Shown in the settings list when an active search matches no rows */
import { Text, View } from 'react-native';
import { SearchX } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { typography, fontWeights } from '@/theme/typography';
import { useThemeColors } from '../../../theme/ThemeContext';

interface Props {
  query: string;
}

export function SettingsSearchEmpty({ query }: Props) {
  const { colors: themeColors } = useThemeColors();

  return (
    <View className='items-center' style={{ gap: 8, paddingVertical: 32 }}>
      <SearchX color={themeColors.text.tertiary} size={iconSizes.large} />
      <Text
        style={{
          ...typography.body,
          color: themeColors.text.primary,
          fontWeight: fontWeights.semibold,
        }}
      >
        No settings found
      </Text>
      <Text
        className='text-center'
        style={{ ...typography.caption, color: themeColors.text.secondary }}
      >
        Nothing matches “{query.trim()}”. Try a different term.
      </Text>
    </View>
  );
}
