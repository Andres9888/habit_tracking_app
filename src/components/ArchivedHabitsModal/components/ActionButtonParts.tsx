import { Text, View } from 'react-native';
import { RotateCcw, Check, Lock } from 'lucide-react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontWeights } from '@/theme/typography';
import { AnimatedPressable } from '../../ui';

export function ResumeButton({ btnBg, greenColor, habitName, isRestoring, showSuccess, successIconStyle, onRestorePress }: {
  btnBg: string; greenColor: string; habitName: string; isRestoring: boolean;
  showSuccess: boolean; successIconStyle: AnimatedStyle; onRestorePress: () => void;
}) {
  const { colors: c } = useThemeColors();
  return (
    <AnimatedPressable
      accessibilityLabel={`Resume ${habitName}`} accessibilityRole='button'
      className='flex-row items-center justify-center gap-2'
      disabled={isRestoring}
      style={{ height: 48, borderRadius: 14, backgroundColor: btnBg, opacity: isRestoring && !showSuccess ? 0.7 : 1 }}
      onPress={onRestorePress}
    >
      {showSuccess ? (
        <Animated.View className='flex-row items-center gap-2' style={successIconStyle}>
          <View className='h-5 w-5 items-center justify-center rounded-full' style={{ backgroundColor: c.primary[400] }}>
            <Check color={c.text.inverse} size={iconSizes.small} strokeWidth={3} />
          </View>
          <Text style={{ fontSize: 15, fontWeight: fontWeights.semibold, color: greenColor }}>Restored!</Text>
        </Animated.View>
      ) : (<>
        <RotateCcw color={greenColor} size={iconSizes.small} strokeWidth={2.5} />
        <Text style={{ fontSize: 15, fontWeight: fontWeights.semibold, color: greenColor, letterSpacing: -0.1 }}>{isRestoring ? 'Restoring...' : 'Resume habit'}</Text>
      </>)}
    </AnimatedPressable>
  );
}

export function LimitReachedResume({ onUpgradePress }: { onUpgradePress?: () => void }) {
  const { colors: c } = useThemeColors();
  const bg = c.gray[200];
  const fg = c.text.tertiary;
  return (
    <AnimatedPressable
      accessibilityLabel='Upgrade to resume this habit' accessibilityRole='button'
      className='flex-row items-center justify-center gap-2'
      style={{ height: 48, borderRadius: 14, backgroundColor: bg }}
      onPress={onUpgradePress}
    >
      <Lock color={fg} size={iconSizes.small} strokeWidth={2.5} />
      <Text style={{ fontSize: 15, fontWeight: fontWeights.semibold, color: fg, letterSpacing: -0.1 }}>Upgrade to restore</Text>
    </AnimatedPressable>
  );
}
