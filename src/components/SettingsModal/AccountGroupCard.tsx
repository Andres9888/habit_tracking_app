/** AccountGroupCard — optional serif heading + raised rounded card of rows.
 *  Shares `settingsSectionTitle` with the main settings page: drilling into
 *  Account shouldn't leave the design system behind. */
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import { getRaisedSurface, settingsCardShadow } from './raisedSurface';
import { settingsSectionTitle } from './settingsSectionTitleStyle';
import { SettingsRowDividerProvider } from './SettingsRow/SettingsRowDivider.provider';

interface Props {
  title?: string;
  children: ReactNode;
}

export function AccountGroupCard({ title, children }: Props) {
  const { colors: themeColors, isDark } = useThemeColors();

  return (
    <View className='gap-2'>
      {title ? (
        <Text
          style={{ ...settingsSectionTitle, color: themeColors.text.primary }}
        >
          {title}
        </Text>
      ) : null}
      <View
        className='overflow-hidden rounded-2xl'
        style={{
          backgroundColor: getRaisedSurface(isDark),
          borderColor: themeColors.border,
          borderWidth: 1,
          ...settingsCardShadow,
        }}
      >
        <SettingsRowDividerProvider>{children}</SettingsRowDividerProvider>
      </View>
    </View>
  );
}
