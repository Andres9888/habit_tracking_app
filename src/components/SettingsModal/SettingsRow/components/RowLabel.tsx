/** RowLabel — settings-row label, optional (?) help affordance, and subtitle */
import { View, Text } from 'react-native';
import { typography, fontWeights } from '@/theme/typography';
import type { SettingsRowProps } from '../SettingsRow.types';

interface RowLabelProps {
  label: SettingsRowProps['label'];
  subtitle?: SettingsRowProps['subtitle'];
  /** Emphasised tail of the subtitle — "Every day at **8:00 PM**". */
  subtitleStrong?: SettingsRowProps['subtitleStrong'];
  isInteractiveInfo: boolean;
  labelColor: string;
  /** Primary text tint for the emphasised subtitle span. */
  primaryTextColor: string;
  secondaryTextColor: string;
  type: SettingsRowProps['type'];
}

export function RowLabel({
  label,
  subtitle,
  subtitleStrong,
  isInteractiveInfo,
  labelColor,
  primaryTextColor,
  secondaryTextColor,
  type,
}: RowLabelProps) {
  return (
    <View accessible={isInteractiveInfo ? false : undefined} className='flex-1'>
      <View className='flex-row items-center' style={{ gap: 6 }}>
        <Text
          accessibilityRole={isInteractiveInfo ? 'header' : undefined}
          numberOfLines={type === 'toggle' || type === 'navigation' ? 2 : 1}
          ellipsizeMode='tail'
          style={{
            ...typography.body,
            flexShrink: 1,
            fontWeight: fontWeights.semibold,
            color: labelColor,
          }}
        >
          {label}
        </Text>
      </View>
      {subtitle ? (
        <Text
          numberOfLines={2}
          style={{
            ...typography.caption,
            color: secondaryTextColor,
            marginTop: 2,
          }}
        >
          {subtitle}
          {subtitleStrong ? (
            <Text
              style={{
                color: primaryTextColor,
                fontWeight: fontWeights.semibold,
              }}
            >
              {subtitleStrong}
            </Text>
          ) : null}
        </Text>
      ) : null}
    </View>
  );
}
