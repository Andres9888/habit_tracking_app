/** AccountGroupCard — optional uppercase eyebrow + raised rounded card of rows */
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { shadows } from '@/theme';
import { typography, fontWeights } from '../../theme/typography';
import { useThemeColors } from '../../theme/ThemeContext';
import { getRaisedSurface } from './raisedSurface';
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
          className='px-1'
          style={{
            ...typography.caption,
            fontWeight: fontWeights.semibold,
            textTransform: 'uppercase',
            letterSpacing: 0.7,
            color: themeColors.text.secondary,
          }}
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
          ...shadows.card,
        }}
      >
        <SettingsRowDividerProvider>{children}</SettingsRowDividerProvider>
      </View>
    </View>
  );
}
