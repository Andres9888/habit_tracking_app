import { Text, View } from 'react-native';
import { RotateCcw, Check, Lock } from 'lucide-react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontWeights } from '@/theme/typography';
import { AnimatedPressable } from '../../ui';

export function ResumeButton({
  chipBg,
  chipFg,
  habitName,
  isRestoring,
  showSuccess,
  successIconStyle,
  onRestorePress,
}: {
  chipBg: string;
  chipFg: string;
  habitName: string;
  isRestoring: boolean;
  showSuccess: boolean;
  successIconStyle: AnimatedStyle;
  onRestorePress: () => void;
}) {
  const { colors: c } = useThemeColors();
  return (
    <AnimatedPressable
      accessibilityLabel={`Resume ${habitName}`}
      accessibilityRole='button'
      className='mt-3 flex-row items-center justify-center gap-2 self-start'
      disabled={isRestoring}
      style={{
        height: 34,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: chipBg,
        opacity: isRestoring && !showSuccess ? 0.7 : 1,
      }}
      onPress={onRestorePress}
    >
      {showSuccess ? (
        <Animated.View
          className='flex-row items-center gap-2'
          style={successIconStyle}
        >
          <View
            className='h-4 w-4 items-center justify-center rounded-full'
            style={{ backgroundColor: c.primary[400] }}
          >
            <Check color={c.text.inverse} size={12} strokeWidth={3} />
          </View>
          <Text
            style={{
              fontSize: 14,
              fontWeight: fontWeights.bold,
              color: chipFg,
            }}
          >
            Restored!
          </Text>
        </Animated.View>
      ) : (
        <>
          <RotateCcw color={chipFg} size={15} strokeWidth={2.5} />
          <Text
            style={{
              fontSize: 14,
              fontWeight: fontWeights.bold,
              color: chipFg,
              letterSpacing: -0.1,
            }}
          >
            {isRestoring ? 'Restoring…' : 'Resume'}
          </Text>
        </>
      )}
    </AnimatedPressable>
  );
}

export function LimitReachedResume({
  onUpgradePress,
}: {
  onUpgradePress?: () => void;
}) {
  const { colors: c } = useThemeColors();
  const bg = c.gray[200];
  const fg = c.text.tertiary;
  return (
    <AnimatedPressable
      accessibilityLabel='Upgrade to resume this habit'
      accessibilityRole='button'
      className='mt-3 flex-row items-center justify-center gap-2 self-start'
      style={{
        height: 34,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: bg,
      }}
      onPress={onUpgradePress}
    >
      <Lock color={fg} size={15} strokeWidth={2.5} />
      <Text
        style={{
          fontSize: 14,
          fontWeight: fontWeights.semibold,
          color: fg,
          letterSpacing: -0.1,
        }}
      >
        Upgrade to restore
      </Text>
    </AnimatedPressable>
  );
}
