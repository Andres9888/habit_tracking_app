/**
 * SelectionActionBar — Floating glass capsule shown during selection mode.
 * Layout: [Cancel] "N selected" [Archive] [Delete]
 * Mirrors BottomActionBar's visual style.
 */

import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Archive, Trash2, X } from 'lucide-react-native';
import { colors as palette } from '../../../../theme/colors';
import { useThemeColors } from '../../../../theme/ThemeContext';
import {
  BLUR_INTENSITY,
  BORDER_DARK,
  BORDER_LIGHT,
  CAPSULE_SHADOW,
} from '../BottomActionBar/BottomActionBar.styles';

const ENTERING = FadeInUp.duration(280).springify().damping(18);
const CAPSULE_RADIUS = 32;
const HIT_SLOP = { bottom: 18, left: 18, right: 18, top: 18 };

interface SelectionActionBarProps {
  selectedCount: number;
  onCancel: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

function SelectionActionBarComponent({
  selectedCount,
  onCancel,
  onArchive,
  onDelete,
}: SelectionActionBarProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useThemeColors();
  const borderColor = isDark ? BORDER_DARK : BORDER_LIGHT;
  const disabled = selectedCount === 0;

  return (
    <Animated.View
      entering={ENTERING}
      style={[
        s.wrapper,
        CAPSULE_SHADOW,
        { marginBottom: Math.max(insets.bottom, 16) },
      ]}
    >
      <View style={s.glassBg} pointerEvents='none'>
        <BlurView
          intensity={BLUR_INTENSITY}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
      </View>
      <View style={[s.capsuleBorder, { borderColor }]} pointerEvents='none' />

      <View style={s.row}>
        <Pressable
          accessibilityLabel='Cancel selection'
          hitSlop={HIT_SLOP}
          style={s.btn}
          onPress={onCancel}
        >
          <X color={colors.text.secondary} size={20} strokeWidth={2} />
        </Pressable>

        <Text style={[s.count, { color: colors.text.primary }]}>
          {selectedCount} selected
        </Text>

        <Pressable
          accessibilityLabel='Archive selected habits'
          disabled={disabled}
          hitSlop={HIT_SLOP}
          style={[s.btn, disabled && s.disabled]}
          onPress={onArchive}
        >
          <Archive
            color={isDark ? palette.streak[300] : palette.streak[500]}
            size={20}
            strokeWidth={2}
          />
        </Pressable>

        <Pressable
          accessibilityLabel='Delete selected habits'
          disabled={disabled}
          hitSlop={HIT_SLOP}
          style={[s.btn, disabled && s.disabled]}
          onPress={onDelete}
        >
          <Trash2 color={palette.error} size={20} strokeWidth={2} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  btn: {
    alignItems: 'center',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  capsuleBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: CAPSULE_RADIUS,
    borderWidth: 1,
  },
  count: { fontSize: 13, fontWeight: '600', paddingHorizontal: 12 },
  disabled: { opacity: 0.35 },
  glassBg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: CAPSULE_RADIUS,
    overflow: 'hidden',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  wrapper: { marginHorizontal: 20, overflow: 'visible' },
});

export const SelectionActionBar = memo(SelectionActionBarComponent);
