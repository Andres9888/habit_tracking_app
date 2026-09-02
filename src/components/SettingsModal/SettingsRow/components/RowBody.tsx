/** RowBody — the icon tile + label region of a settings row.
 *  Toggle rows can make this region its own pressable (`onBodyPress`) so the
 *  switch stays a sibling accessibility node instead of a control nested inside
 *  a button — tap the body to open a detail sheet, flip the switch to toggle. */
import { View } from 'react-native';
import { airy } from '@/theme/airyScale';
import { AnimatedPressable } from '../../../ui/AnimatedPressable';
import { RowLabel } from './RowLabel';
import type { SettingsRowProps } from '../SettingsRow.types';

interface RowBodyProps {
  icon: SettingsRowProps['icon'];
  iconBackgroundColor: SettingsRowProps['iconBackgroundColor'];
  isInteractiveInfo: boolean;
  label: SettingsRowProps['label'];
  labelColor: string;
  primaryTextColor: string;
  secondaryTextColor: string;
  subtitle?: SettingsRowProps['subtitle'];
  subtitleStrong?: SettingsRowProps['subtitleStrong'];
  type: SettingsRowProps['type'];
  /** Screen-reader guidance for the pressable body region. */
  bodyAccessibilityHint?: string;
  onBodyPress?: () => void;
}

export function RowBody({
  icon,
  iconBackgroundColor,
  isInteractiveInfo,
  label,
  labelColor,
  primaryTextColor,
  secondaryTextColor,
  subtitle,
  subtitleStrong,
  type,
  bodyAccessibilityHint,
  onBodyPress,
}: RowBodyProps) {
  const body = (
    <>
      <View
        accessible={isInteractiveInfo ? false : undefined}
        className='items-center justify-center'
        importantForAccessibility={
          isInteractiveInfo ? 'no-hide-descendants' : undefined
        }
        style={{
          backgroundColor: iconBackgroundColor,
          borderRadius: airy.tileRadius,
          height: airy.tileSize,
          marginRight: 14,
          width: airy.tileSize,
        }}
      >
        {icon}
      </View>
      <RowLabel
        isInteractiveInfo={isInteractiveInfo}
        label={label}
        labelColor={labelColor}
        primaryTextColor={primaryTextColor}
        secondaryTextColor={secondaryTextColor}
        subtitle={subtitle}
        subtitleStrong={subtitleStrong}
        type={type}
      />
    </>
  );

  if (type === 'toggle' && onBodyPress) {
    return (
      <AnimatedPressable
        accessibilityHint={bodyAccessibilityHint}
        accessibilityLabel={label}
        accessibilityRole='button'
        style={{ alignItems: 'center', flex: 1, flexDirection: 'row' }}
        onPress={onBodyPress}
      >
        {body}
      </AnimatedPressable>
    );
  }

  return body;
}
