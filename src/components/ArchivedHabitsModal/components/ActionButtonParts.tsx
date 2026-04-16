import { Text, View } from 'react-native';
import { RotateCcw, Check, Lock, Trash2 } from 'lucide-react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '@/theme/ThemeContext';
import { typography, fontWeights } from '@/theme/typography';
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
        <Text style={{ fontSize: 15, fontWeight: fontWeights.semibold, color: greenColor, letterSpacing: -0.1 }}>{isRestoring ? 'Restoring...' : 'Resume'}</Text>
      </>)}
    </AnimatedPressable>
  );
}

export function DeleteIconButton({ habitName, onPress }: { habitName: string; onPress: () => void }) {
  const { colors, isDark } = useThemeColors();
  return (
    <AnimatedPressable
      accessibilityLabel={`Delete ${habitName}`} accessibilityRole='button'
      style={{
        width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
        borderWidth: 1.5, borderColor: isDark ? colors.status.error + '40' : colors.status.error + '20',
      }}
      onPress={onPress}
    >
      <Trash2 color={colors.status.error} size={iconSizes.small} strokeWidth={2.5} />
    </AnimatedPressable>
  );
}

export function LimitReachedButtons({ onDeletePress, onUpgradePress }: {
  onDeletePress: () => void; onUpgradePress?: () => void;
}) {
  const { colors: c } = useThemeColors();
  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <AnimatedPressable
        accessibilityLabel='Upgrade to resume habits' accessibilityRole='button'
        className='flex-1 flex-row items-center justify-center gap-2'
        style={{ height: 48, borderRadius: 14, backgroundColor: c.status.success }}
        onPress={onUpgradePress}
      >
        <Lock color={c.text.inverse} size={iconSizes.small} strokeWidth={2.5} />
        <Text style={{ fontSize: 15, fontWeight: fontWeights.semibold, color: c.text.inverse, letterSpacing: -0.1 }}>Upgrade</Text>
      </AnimatedPressable>
      <DeleteIconButton habitName='archived habit' onPress={onDeletePress} />
    </View>
  );
}

export function DeleteConfirmRow({ onCancel, onDelete }: { onCancel: () => void; onDelete: () => void }) {
  const { colors: c, isDark } = useThemeColors();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <Text style={{ ...typography.caption, color: c.text.secondary }}>Are you sure?</Text>
      <AnimatedPressable style={{ backgroundColor: c.status.error, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 6 }} onPress={onDelete}>
        <Text style={{ ...typography.caption, fontWeight: fontWeights.semibold, color: '#FFFFFF' }}>Delete</Text>
      </AnimatedPressable>
      <AnimatedPressable style={{ backgroundColor: isDark ? c.gray[200] : c.gray[50], borderRadius: 10, paddingHorizontal: 14, paddingVertical: 6 }} onPress={onCancel}>
        <Text style={{ ...typography.caption, fontWeight: fontWeights.semibold, color: c.text.secondary }}>Cancel</Text>
      </AnimatedPressable>
    </View>
  );
}
