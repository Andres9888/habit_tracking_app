/** Shared option chip for Streak / Curve / Growth / Reminder row bodies. */
import type { ReactNode } from 'react';
import { Keyboard, Pressable, View } from 'react-native';
import { triggerHaptic } from '@/utils/haptics';
import { OptionChipBody } from './OptionChipBody';
import { useChipPressScale } from './useChipPressScale';

export interface OptionChipProps {
  label: string;
  value: string;
  selected: boolean;
  suggested?: boolean;
  glyph?: ReactNode;
  valueSize?: 17 | 15;
  onPress?: () => void;
  accessibilityLabel: string;
  disabled?: boolean;
  /** Renders as a static tile (growth stage preview) — no press handling. */
  readOnly?: boolean;
  testID?: string;
}

export function OptionChip({
  label,
  value,
  selected,
  suggested = false,
  glyph,
  valueSize = 17,
  onPress,
  accessibilityLabel,
  disabled = false,
  readOnly = false,
  testID,
}: OptionChipProps) {
  const { animatedStyle, pressProps } = useChipPressScale();
  const body = (
    <OptionChipBody
      animatedStyle={readOnly ? null : animatedStyle}
      disabled={disabled}
      glyph={glyph}
      label={label}
      selected={selected}
      suggested={suggested}
      value={value}
      valueSize={valueSize}
    />
  );

  if (readOnly) {
    return (
      <View accessibilityLabel={accessibilityLabel} style={{ flex: 1 }}>
        {body}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='button'
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      style={{ flex: 1, minWidth: 0 }}
      testID={testID}
      onPress={() => {
        Keyboard.dismiss();
        void triggerHaptic('selection');
        onPress?.();
      }}
      {...pressProps}
    >
      {body}
    </Pressable>
  );
}
