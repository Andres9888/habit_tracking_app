/** Sticky translucent header for the Strength Curve picker — back-only, auto-save. */
import { ChevronLeft } from 'lucide-react-native';
import { View } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { borderRadius } from '@/theme/spacing';
import { triggerHaptic } from '@/utils/haptics';
import { useThemeColors } from '@/theme/ThemeContext';

interface Props {
  topInset: number;
  onClose: () => void;
}

export function StrengthCurvePickerHeader({ topInset, onClose }: Props) {
  const { colors } = useThemeColors();
  const handlePress = () => {
    void triggerHaptic('tap');
    onClose();
  };
  return (
    <View style={{ paddingTop: topInset }}>
      <View className='flex-row items-center px-4 pb-2'>
        <AnimatedPressable
          accessibilityLabel='Back'
          accessibilityRole='button'
          style={{
            alignItems: 'center',
            backgroundColor: colors.surface,
            borderRadius: borderRadius.full,
            height: 44,
            justifyContent: 'center',
            width: 44,
          }}
          onPress={handlePress}
        >
          <ChevronLeft color={colors.text.secondary} size={24} strokeWidth={2.5} />
        </AnimatedPressable>
      </View>
    </View>
  );
}
