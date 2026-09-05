/**
 * Caps section label with an optional right-hand slot: either a pressable caps
 * action (e.g. "BROWSE ALL") or plain secondary text (e.g. "Optional").
 * Spec §4 · SectionLabel.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { usePanelTokens } from './panelTokens';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontFamilies } from '@/theme/typography';

export type SectionLabelAction =
  | { label: string; onPress: () => void; caps?: boolean }
  | { text: string };

interface SectionLabelProps {
  label: string;
  action?: SectionLabelAction;
  testID?: string;
}

function ActionText({ action }: { action: SectionLabelAction }) {
  const { colors } = useThemeColors();
  const tokens = usePanelTokens();

  if ('text' in action) {
    return (
      <Text style={[styles.plain, { color: tokens.textSecondary }]}>
        {action.text}
      </Text>
    );
  }

  const caps = action.caps !== false;
  return (
    <AnimatedPressable
      accessibilityRole="button"
      hitSlop={12}
      style={styles.actionHit}
      onPress={action.onPress}
    >
      <Text
        style={[
          styles.action,
          caps ? styles.caps : null,
          { color: colors.primary[700] },
        ]}
      >
        {caps ? action.label.toUpperCase() : action.label}
      </Text>
    </AnimatedPressable>
  );
}

export function SectionLabel({ action, label, testID }: SectionLabelProps) {
  const tokens = usePanelTokens();
  return (
    <View style={styles.row} testID={testID}>
      <Text style={[styles.label, { color: tokens.labelCaps }]}>
        {label.toUpperCase()}
      </Text>
      {action ? <ActionText action={action} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  action: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 12,
    fontWeight: '700',
  },
  actionHit: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    // Real 44pt target, but only 24pt of it counts toward the label row height.
    marginVertical: -10,
    minHeight: 44,
    minWidth: 44,
  },
  caps: { letterSpacing: 0.8 },
  label: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  plain: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 12,
    fontWeight: '600',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
});
