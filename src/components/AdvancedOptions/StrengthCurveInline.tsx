/** Inline Strength Curve — v3 contract: type bar + collapsible trigger + expand. */
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import { iconSizes } from '@/theme/iconSizes';
import type { GrowthType } from '@/utils/growthTypeMeta';
import { CURVE_MOCK_COPY } from './mockTokens';
import { StrengthCurveExpand } from './StrengthCurveExpand';
import { StrengthCurveToggleRow } from './StrengthCurveToggleRow';
import { StrengthCurveTypeBar } from './StrengthCurveTypeBar';
import { useAdvancedTokens } from './useAdvancedTokens';
import { useStrengthCurveInline } from './useStrengthCurveInline';

interface Props {
  strengthAlgorithm: AlgorithmMode;
  AlgoIcon: React.ComponentType<{
    color: string;
    size: number;
    strokeWidth: number;
  }>;
  growthType?: GrowthType;
  /** True on create flows (untouched defaults follow the suggestion). */
  isNewHabit: boolean;
  onSelect: (mode: AlgorithmMode) => void;
}

export function StrengthCurveInline({
  strengthAlgorithm,
  AlgoIcon,
  growthType,
  isNewHabit,
  onSelect,
}: Props) {
  const t = useAdvancedTokens();
  const {
    open,
    setOpen,
    chevronAnimatedStyle,
    contentAnimatedStyle,
    handleContentLayout,
    suggested,
    handleSelect,
  } = useStrengthCurveInline({
    strengthAlgorithm,
    growthType,
    isNewHabit,
    onSelect,
  });

  const curve = CURVE_MOCK_COPY[strengthAlgorithm];

  return (
    <View>
      {growthType ? <StrengthCurveTypeBar growthType={growthType} /> : null}
      <StrengthCurveToggleRow
        announceValue={curve.value}
        chevronAnimatedStyle={chevronAnimatedStyle}
        collapsedValue={curve.short}
        expanded={open}
        icon={
          <AlgoIcon
            color={t.accentTileIcon}
            size={iconSizes.small}
            strokeWidth={2}
          />
        }
        onToggle={() => setOpen((v) => !v)}
      />
      <Animated.View
        accessibilityElementsHidden={!open}
        importantForAccessibility={open ? 'auto' : 'no-hide-descendants'}
        pointerEvents={open ? 'auto' : 'none'}
        style={contentAnimatedStyle}
      >
        <View onLayout={handleContentLayout}>
          <StrengthCurveExpand
            selected={strengthAlgorithm}
            suggested={suggested}
            onSelect={handleSelect}
          />
        </View>
      </Animated.View>
    </View>
  );
}
