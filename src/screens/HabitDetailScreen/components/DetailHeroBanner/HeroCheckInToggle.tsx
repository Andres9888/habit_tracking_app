/**
 * HeroCheckInToggle — one button, both states. The circle fills, the label
 * flips to "Logged today", the hint word becomes "Undo", and re-tapping unlogs,
 * so the control is never swapped for another affordance mid-interaction.
 *
 * Role is `checkbox`, not `button`: RN only forwards `accessibilityState`'s
 * `checked` for checkbox/switch/radio, so on `button` VoiceOver dropped it.
 */
import { Pressable, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { usePressed } from '../../../../components/AdvancedOptions/usePressed';
import { withAlpha } from '../../../../theme/colors';
import { BAND_FG, useInsightPalette } from '../../insightPalette';

interface HeroCheckInToggleProps {
  checked: boolean;
  disabled: boolean;
  onPress: () => void;
}

export function HeroCheckInToggle({
  checked,
  disabled,
  onPress,
}: HeroCheckInToggleProps) {
  const palette = useInsightPalette();
  const { pressed, pressProps } = usePressed();
  const ink = checked ? palette.ctaGreen : BAND_FG;

  return (
    <Pressable
      accessibilityHint={
        checked ? 'Tap the button again to unlog today.' : undefined
      }
      accessibilityLabel={
        checked
          ? 'Logged today. Tap to undo.'
          : 'Complete today. Tap to log today.'
      }
      accessibilityRole='checkbox'
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      style={{
        alignItems: 'center',
        backgroundColor: checked ? palette.greenWash : palette.green,
        borderColor: checked ? palette.greenTint : palette.green,
        borderRadius: 17,
        borderWidth: 1.5,
        flexDirection: 'row',
        gap: 12,
        height: 56,
        opacity: disabled ? 0.6 : 1,
        paddingHorizontal: 18,
        ...(checked
          ? null
          : {
              shadowColor: palette.green,
              shadowOffset: { height: 10, width: 0 },
              shadowOpacity: 0.38,
              shadowRadius: 12,
            }),
        ...(pressed ? { transform: [{ scale: 0.985 }] } : null),
      }}
      onPress={onPress}
      {...pressProps}
    >
      <View
        style={{
          alignItems: 'center',
          backgroundColor: checked ? palette.green : 'transparent',
          borderColor: checked ? palette.green : withAlpha(BAND_FG, 0.6),
          borderRadius: 11,
          borderWidth: 2,
          height: 22,
          justifyContent: 'center',
          width: 22,
        }}
      >
        {checked ? <Check color={BAND_FG} size={13} strokeWidth={3} /> : null}
      </View>
      <Text
        style={{
          color: ink,
          flex: 1,
          fontSize: 17,
          fontWeight: '600',
          letterSpacing: -0.1,
        }}
      >
        {checked ? 'Logged today' : 'Complete today'}
      </Text>
      <Text
        style={{
          // Full-opacity cream, not alpha-dimmed: at 70% this hint sat at
          // 3.07:1 on the green fill, below AA. It de-emphasizes by size and
          // letterspacing instead, which costs no contrast.
          color: checked ? palette.amber : BAND_FG,
          fontSize: 13,
          fontWeight: '700',
          letterSpacing: 0.3,
        }}
      >
        {checked ? 'Undo' : 'Tap'}
      </Text>
    </Pressable>
  );
}
