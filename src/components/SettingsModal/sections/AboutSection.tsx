import React from 'react';
import { Text, View } from 'react-native';
import { Info } from 'lucide-react-native';
import { SettingsSection } from '../SettingsSection';
import { SettingsRow } from '../SettingsRow';
import { useThemeColors } from '../../../theme/ThemeContext';

interface Props {
  highContrast: boolean;
  version: string;
  buildNumber: string;
}

export function AboutSection({ highContrast, version, buildNumber }: Props) {
  const { colors: themeColors, settings } = useThemeColors();

  return (
    <View>
      <SettingsSection highContrastMode={highContrast} title='About'>
        <SettingsRow
          highContrastMode={highContrast}
          icon={<Info color={settings.info.icon} size={16} />}
          iconBackgroundColor={settings.info.bg}
          label='Version'
          showBorder={false}
          type='info'
          value={`${version} (${buildNumber})`}
        />
      </SettingsSection>
      <View className='px-4 pb-3 pt-3'>
        <Text
          className='text-center text-[13px]'
          style={{ color: themeColors.text.secondary }}
        >
          Made with ❤️ for better habits
        </Text>
      </View>
    </View>
  );
}
