import { useState } from 'react';
import { Text, View } from 'react-native';
import { RotateCcw, Check, Lock } from 'lucide-react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { AnimatedPressable } from '../../ui';

interface ActionButtonsProps {
  habitName: string;
  isRestoring: boolean;
  showSuccess: boolean;
  hasReachedLimit?: boolean;
  successIconStyle: AnimatedStyle;
  onRestorePress: () => void;
  onDeletePress: () => void;
  onUpgradePress?: () => void;
}

export function ActionButtons({
  habitName,
  isRestoring,
  showSuccess,
  hasReachedLimit,
  successIconStyle,
  onRestorePress,
  onDeletePress,
  onUpgradePress,
}: ActionButtonsProps) {
  const { colors, isDark } = useThemeColors();
  const [showConfirm, setShowConfirm] = useState(false);

  const greenColor = colors.text.inverse;
  const btnBg = showSuccess
    ? colors.primary[700]
    : colors.status.success;

  return (
    <View>
      {hasReachedLimit ? (
        <LimitReachedButtons isDark={isDark} onDeletePress={() => setShowConfirm(true)} onUpgradePress={onUpgradePress} />
      ) : (
        <ResumeButton
          btnBg={btnBg} greenColor={greenColor} habitName={habitName}
          isRestoring={isRestoring} showSuccess={showSuccess}
          successIconStyle={successIconStyle} onRestorePress={onRestorePress}
        />
      )}

      <View className='mt-3 min-h-[20px] items-center'>
        {hasReachedLimit ? null : !showConfirm ? (
          <AnimatedPressable accessibilityLabel={`Delete ${habitName}`} onPress={() => setShowConfirm(true)}>
            <Text className='text-[13px]' style={{ color: colors.text.tertiary }}>
              or delete permanently
            </Text>
          </AnimatedPressable>
        ) : (
          <DeleteConfirmRow isDark={isDark} onCancel={() => setShowConfirm(false)} onDelete={onDeletePress} />
        )}
      </View>
    </View>
  );
}

function ResumeButton({ btnBg, greenColor, habitName, isRestoring, showSuccess, successIconStyle, onRestorePress }: {
  btnBg: string; greenColor: string; habitName: string;
  isRestoring: boolean; showSuccess: boolean;
  successIconStyle: AnimatedStyle; onRestorePress: () => void;
}) {
  const { colors: themeColors } = useThemeColors();
  return (
    <AnimatedPressable
      accessibilityLabel={`Resume ${habitName}`} accessibilityRole='button'
      className='h-11 flex-row items-center justify-center gap-2 rounded-xl'
      disabled={isRestoring}
      style={{ backgroundColor: btnBg, opacity: isRestoring && !showSuccess ? 0.7 : 1 }}
      onPress={onRestorePress}
    >
      {showSuccess ? (
        <Animated.View className='flex-row items-center gap-2' style={successIconStyle}>
          <View className='h-5 w-5 items-center justify-center rounded-full' style={{ backgroundColor: themeColors.primary[400] }}>
            <Check color={themeColors.text.inverse} size={14} strokeWidth={3} />
          </View>
          <Text style={{ color: greenColor, fontSize: 15, fontWeight: '600' }}>Restored!</Text>
        </Animated.View>
      ) : (
        <>
          <RotateCcw color={greenColor} size={16} strokeWidth={2.5} />
          <Text style={{ color: greenColor, fontSize: 15, fontWeight: '600' }}>
            {isRestoring ? 'Restoring...' : 'Resume This Habit'}
          </Text>
        </>
      )}
    </AnimatedPressable>
  );
}

function LimitReachedButtons({ isDark, onDeletePress, onUpgradePress }: {
  isDark: boolean; onDeletePress: () => void; onUpgradePress?: () => void;
}) {
  const { colors: themeColors } = useThemeColors();
  return (
    <View className='gap-2'>
      <AnimatedPressable
        accessibilityLabel='Upgrade to resume habits' accessibilityRole='button'
        className='h-11 flex-row items-center justify-center gap-2 rounded-xl'
        style={{ backgroundColor: themeColors.status.success }}
        onPress={onUpgradePress}
      >
        <Lock color={themeColors.text.inverse} size={15} strokeWidth={2.5} />
        <Text style={{ color: themeColors.text.inverse, fontSize: 15, fontWeight: '600' }}>
          Upgrade to Resume
        </Text>
      </AnimatedPressable>
      <AnimatedPressable
        accessibilityLabel='Delete habit permanently' accessibilityRole='button'
        className='h-11 flex-row items-center justify-center rounded-xl border'
        style={{ borderColor: themeColors.status.error }}
        onPress={onDeletePress}
      >
        <Text style={{ color: themeColors.status.error, fontSize: 14, fontWeight: '600' }}>
          Delete Permanently
        </Text>
      </AnimatedPressable>
    </View>
  );
}

function DeleteConfirmRow({ isDark, onCancel, onDelete }: {
  isDark: boolean; onCancel: () => void; onDelete: () => void;
}) {
  const { colors: themeColors } = useThemeColors();
  return (
    <View className='flex-row items-center gap-3'>
      <Text className='text-[13px] font-medium' style={{ color: themeColors.text.secondary }}>
        Are you sure?
      </Text>
      <AnimatedPressable className='rounded-lg px-3 py-1' style={{ backgroundColor: themeColors.status.error }} onPress={onDelete}>
        <Text className='text-[13px] font-semibold text-white'>Delete</Text>
      </AnimatedPressable>
      <AnimatedPressable
        className='rounded-lg px-3 py-1' style={{ backgroundColor: isDark ? themeColors.gray[200] : themeColors.gray[50] }} onPress={onCancel}
      >
        <Text className='text-[13px] font-semibold' style={{ color: themeColors.text.secondary }}>Cancel</Text>
      </AnimatedPressable>
    </View>
  );
}
