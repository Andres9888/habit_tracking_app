/** ConsequenceList — bulleted list of what deletion permanently destroys */
import { Text, View } from 'react-native';
import { typography } from '../../../theme/typography';
import { useThemeColors } from '../../../theme/ThemeContext';
import { DELETE_ACCOUNT_CONSEQUENCES } from '../constants';

export function ConsequenceList() {
  const { colors: themeColors } = useThemeColors();

  return (
    <View
      className='mb-4 gap-2 rounded-2xl border p-3.5'
      style={{
        backgroundColor: themeColors.status.errorLight,
        borderColor: themeColors.status.error,
      }}
    >
      {DELETE_ACCOUNT_CONSEQUENCES.map((line) => (
        <View className='flex-row gap-2.5' key={line}>
          <View
            className='mt-2 h-1.5 w-1.5 rounded-full'
            style={{ backgroundColor: themeColors.status.error }}
          />
          <Text
            className='flex-1'
            style={{ ...typography.bodySmall, color: themeColors.text.primary }}
          >
            {line}
          </Text>
        </View>
      ))}
    </View>
  );
}
