/**
 * HeaderButton - Animated button with scale + haptic feedback.
 *
 * Built on `ui/AnimatedPressable`, which owns the press scale and the web focus
 * ring. An earlier revision hand-rolled `createAnimatedComponent` + `withSpring`
 * and silently lost the focus ring.
 */
import React from 'react';
import { Text, View } from 'react-native';
import { AnimatedPressable } from '../../../components/ui';
import { useThemeColors } from '../../../theme/ThemeContext';
import { fontWeights } from '../../../theme/typography';
import { OPACITY } from '../../../constants/ui-values';
import { s } from './HeaderButton.styles';
import { toneColors, type HeaderButtonTone } from './HeaderButton.tones';

interface HeaderButtonProps {
  onPress: () => void;
  icon?: React.ReactNode;
  label: string;
  text?: string;
  tone?: HeaderButtonTone;
  /** Icon-only layout — frees header space when the title pins on scroll. */
  compact?: boolean;
}

export function HeaderButton({
  onPress,
  icon,
  label,
  text,
  tone = 'subtle',
  compact = false,
}: HeaderButtonProps) {
  const { colors, isDark } = useThemeColors();
  const { bg, border, fg } = toneColors(tone, isDark, colors);
  const showText = Boolean(text) && !compact;

  return (
    <AnimatedPressable
      accessibilityLabel={label}
      accessibilityRole='button'
      animationConfig={{ pressScale: 0.92 }}
      style={[
        showText ? s.textButton : s.compactButton,
        showText ? { backgroundColor: bg, borderColor: border } : undefined,
      ]}
      onPress={onPress}
    >
      {compact ? (
        <View
          style={[
            s.compactCircle,
            { backgroundColor: bg, borderColor: border },
          ]}
        >
          {icon ? (
            <View style={{ opacity: tone === 'subtle' ? OPACITY.high : 1 }}>
              {React.cloneElement(
                icon as React.ReactElement<{ color: string }>,
                {
                  color: fg,
                }
              )}
            </View>
          ) : null}
        </View>
      ) : icon ? (
        <View style={{ opacity: tone === 'subtle' ? OPACITY.high : 1 }}>
          {React.cloneElement(icon as React.ReactElement<{ color: string }>, {
            color: fg,
          })}
        </View>
      ) : null}
      {showText ? (
        <Text
          style={[
            s.textLabel,
            {
              color: fg,
              fontWeight:
                tone === 'subtle' ? fontWeights.medium : fontWeights.semibold,
            },
          ]}
        >
          {text}
        </Text>
      ) : null}
    </AnimatedPressable>
  );
}
