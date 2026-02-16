/**
 * StrengthTooltip Component
 * Explains the habit strength system to users.
 * Shows tier breakdown and how strength is calculated.
 */

import React, { memo } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useThemeColors } from '@/theme/ThemeContext';
import { LEVELS } from './StrengthProgressBar.constants';
import { styles } from './StrengthProgressBar.styles';

interface StrengthTooltipProps {
  visible: boolean;
  onClose: () => void;
  currentStrength: number;
}

export const StrengthTooltip = memo(function StrengthTooltip({
  visible,
  onClose,
  currentStrength,
}: StrengthTooltipProps) {
  const { colors, isDark } = useThemeColors();

  if (!visible) return null;

  const bgColor = isDark ? colors.gray[100] : '#FFFFFF';
  const textColor = colors.text.primary;
  const subtextColor = colors.text.secondary;
  const arrowColor = bgColor;

  return (
    <Modal animationType='fade' onRequestClose={onClose} transparent visible>
      <Pressable
        onPress={onClose}
        style={{
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.3)',
          flex: 1,
          justifyContent: 'center',
          padding: 32,
        }}
      >
        <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)}>
          <View style={[styles.tooltipArrow, { borderTopColor: arrowColor }]} />
          <View style={[styles.tooltipContainer, { backgroundColor: bgColor }]}>
            <Text style={[styles.tooltipTitle, { color: textColor }]}>
              Habit Strength
            </Text>

            {LEVELS.map((level) => {
              const isActive =
                currentStrength >= level.threshold &&
                (level.threshold === 80 || currentStrength < level.threshold + 20);
              return (
                <View
                  key={level.label}
                  style={[
                    styles.tooltipRow,
                    isActive && {
                      backgroundColor: isDark
                        ? 'rgba(255,255,255,0.06)'
                        : 'rgba(0,0,0,0.04)',
                      borderRadius: 8,
                      paddingHorizontal: 6,
                      paddingVertical: 4,
                    },
                  ]}
                >
                  <Text style={{ fontSize: 18 }}>{level.emoji}</Text>
                  <Text
                    style={{
                      color: isActive ? level.color : subtextColor,
                      flex: 1,
                      fontSize: 13,
                      fontWeight: isActive ? '700' : '500',
                    }}
                  >
                    {level.label} ({level.threshold}%+)
                  </Text>
                </View>
              );
            })}

            <Text style={[styles.tooltipSubtext, { color: subtextColor }]}>
              Strength grows each day you complete a habit and decays when you
              miss days. Stay consistent to reach ⚡ Automatic!
            </Text>
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
});
