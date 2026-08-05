/** StrengthCurvePickerModal — full-screen picker (V5 Giant Bar Hero). */
import { Text, useWindowDimensions, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Modal from '@/components/Modal';
import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useThemeColors } from '@/theme/ThemeContext';
import { MechanicStatRow } from './MechanicStatRow';
import { STRENGTH_CURVE_PICKER_COPY } from './StrengthCurvePicker.copy';
import { StrengthBarHero } from './StrengthBarHero';
import { StrengthCurvePickerHeader } from './StrengthCurvePickerHeader';
import { TierDetailCard } from './TierDetailCard';
import { TierPickerRow } from './TierPickerRow';

const SCALE_BASE = 600;
const SCALE_MAX = 850;
const SCALE_RANGE = 0.3;

function computeScale(usableHeight: number): number {
  const t = Math.max(
    0,
    Math.min(1, (usableHeight - SCALE_BASE) / (SCALE_MAX - SCALE_BASE))
  );
  return 1 + t * SCALE_RANGE;
}

interface Props {
  visible: boolean;
  selected: AlgorithmMode;
  onSelect: (mode: AlgorithmMode) => void;
  onClose: () => void;
}

export function StrengthCurvePickerModal({
  visible,
  selected,
  onSelect,
  onClose,
}: Props) {
  const insets = useSafeAreaInsets();
  const { colors } = useThemeColors();
  const reduceMotion = useReduceMotion();
  const { height: windowHeight } = useWindowDimensions();
  const scale = computeScale(windowHeight - insets.top - insets.bottom - 56);

  return (
    <Modal variant='fullScreen' visible={visible} onClose={onClose}>
      <View className='flex-1' style={{ backgroundColor: colors.background }}>
        <StrengthCurvePickerHeader topInset={insets.top} onClose={onClose} />
        <Animated.View
          className='items-center'
          entering={reduceMotion ? undefined : FadeInDown.duration(280)}
          style={{
            paddingHorizontal: 20,
            paddingTop: 12 * scale,
            paddingBottom: 4 * scale,
          }}
        >
          <Text
            className='text-center font-extrabold leading-tight'
            style={{ color: colors.text.primary, fontSize: 24 * scale }}
          >
            {STRENGTH_CURVE_PICKER_COPY.heroTitle}
          </Text>
          <Text
            className='text-center'
            style={{
              color: colors.text.secondary,
              fontSize: 13 * scale,
              marginTop: 4 * scale,
            }}
          >
            {STRENGTH_CURVE_PICKER_COPY.heroSubtitle}
          </Text>
        </Animated.View>
        <StrengthBarHero mode={selected} scale={scale} />
        <MechanicStatRow mode={selected} scale={scale} />
        <Animated.View
          className='flex-row items-center justify-center gap-2 px-6'
          entering={
            reduceMotion ? undefined : FadeInDown.delay(180).duration(260)
          }
          style={{ marginTop: 14 * scale, marginBottom: 8 * scale }}
        >
          <View
            className='h-px flex-1'
            style={{ backgroundColor: colors.border }}
          />
          <Text
            className='font-semibold tracking-wider'
            style={{ color: colors.text.tertiary, fontSize: 13 * scale }}
          >
            {STRENGTH_CURVE_PICKER_COPY.pickerSectionLabel.toUpperCase()}
          </Text>
          <View
            className='h-px flex-1'
            style={{ backgroundColor: colors.border }}
          />
        </Animated.View>
        <TierPickerRow scale={scale} selected={selected} onSelect={onSelect} />
        <View style={{ marginBottom: insets.bottom + 16 }}>
          <TierDetailCard mode={selected} scale={scale} />
        </View>
      </View>
    </Modal>
  );
}
