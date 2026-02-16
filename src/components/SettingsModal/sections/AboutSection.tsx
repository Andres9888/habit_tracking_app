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
  const { colors: themeColors } = useThemeColors();

  return (
    <SettingsSection highContrastMode={highContrast} title='About'>
      <SettingsRow
        highContrastMode={highContrast}
        icon={<Info color='#6366f1' size={16} />}
        iconBackgroundColor='#e0e7ff'
        label='Version'
        showBorder={false}
        type='info'
        value={`${version} (${buildNumber})`}
      />
      <View className='px-4 pb-3 pt-1'>
        <Text
          className='text-center text-[13px]'
          style={{ color: themeColors.text.secondary }}
        >
          Made with ❤️ for better habits
        </Text>
      </View>
    </SettingsSection>
  );
}
