/** PickerStackRow — settings row whose picker sits stacked beneath the label
 *  rather than beside it. Shares SettingsRow's tile, padding and divider
 *  bookkeeping so a card can mix both shapes without the rules drifting. */
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { airy } from '@/theme/airyScale';
import { typography, fontWeights } from '@/theme/typography';
import { useThemeColors } from '../../theme/ThemeContext';
import { getSettingsRowColors } from './SettingsRow';
import { useSettingsRowDivider } from './SettingsRow/SettingsRowDivider.provider';

interface PickerStackRowProps {
  icon: ReactNode;
  iconBackgroundColor: string;
  label: string;
  subtitle?: string;
  children: ReactNode;
}

export function PickerStackRow({
  icon,
  iconBackgroundColor,
  label,
  subtitle,
  children,
}: PickerStackRowProps) {
  const { colors: themeColors, isDark } = useThemeColors();
  const colors = getSettingsRowColors(isDark);
  const showTopBorder = useSettingsRowDivider(true);

  return (
    <View
      className={`px-4 ${showTopBorder ? 'border-t' : ''}`}
      style={{
        backgroundColor: colors.background,
        borderColor: showTopBorder ? colors.border : undefined,
        paddingVertical: airy.rowPaddingV,
      }}
    >
      <View className='flex-row items-center'>
        <View
          className='mr-4 items-center justify-center'
          style={{
            backgroundColor: iconBackgroundColor,
            width: airy.tileSize,
            height: airy.tileSize,
            borderRadius: airy.tileRadius,
          }}
        >
          {icon}
        </View>
        <View className='flex-1'>
          <Text
            numberOfLines={1}
            style={{
              ...typography.body,
              fontWeight: fontWeights.semibold,
              color: colors.label,
            }}
          >
            {label}
          </Text>
          {subtitle ? (
            <Text
              className='mt-1'
              numberOfLines={2}
              style={{
                ...typography.caption,
                color: themeColors.text.secondary,
              }}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
      <View className='mt-3'>{children}</View>
    </View>
  );
}
