/** Sticky translucent header for the Strength Curve picker. */
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { STRENGTH_CURVE_PICKER_COPY } from './StrengthCurvePicker.copy';

interface Props {
  topInset: number;
  onClose: () => void;
}

export function StrengthCurvePickerHeader({ topInset, onClose }: Props) {
  const { colors } = useThemeColors();
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderBottomColor: colors.cardBorder,
        borderBottomWidth: 1,
        paddingTop: topInset,
      }}
    >
      <View className='flex-row items-center justify-between px-5 py-3'>
        <Pressable
          accessibilityLabel='Close'
          accessibilityRole='button'
          className='h-9 w-9 items-center justify-center rounded-full'
          style={{ backgroundColor: colors.gray[100], borderColor: colors.border, borderWidth: 1 }}
          onPress={onClose}
        >
          <ChevronLeft color={colors.text.primary} size={20} strokeWidth={2} />
        </Pressable>
        <Text
          className='text-[15px] font-semibold'
          style={{ color: colors.text.primary }}
        >
          {STRENGTH_CURVE_PICKER_COPY.headerTitle}
        </Text>
        <Pressable
          accessibilityLabel={STRENGTH_CURVE_PICKER_COPY.doneLabel}
          accessibilityRole='button'
          className='rounded-full px-4 py-1.5'
          style={{ backgroundColor: colors.primary[600] }}
          onPress={onClose}
        >
          <Text className='text-[13px] font-semibold' style={{ color: colors.text.inverse }}>
            {STRENGTH_CURVE_PICKER_COPY.doneLabel}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
