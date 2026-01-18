import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { SuggestionChips } from './SuggestionChips';
import type { SuggestionChip } from './types';

interface ChipsSectionProps {
  isKeyboardVisible: boolean;
  chipsAnimatedStyle: AnimatedStyle;
  selectedIndex: number | null;
  onSelect: (index: number, chip: SuggestionChip) => void;
}

export function ChipsSection({
  isKeyboardVisible,
  chipsAnimatedStyle,
  selectedIndex,
  onSelect,
}: ChipsSectionProps) {
  return (
    <Animated.View
      accessibilityElementsHidden={isKeyboardVisible}
      importantForAccessibility={
        isKeyboardVisible ? 'no-hide-descendants' : 'auto'
      }
      style={[{ maxWidth: 343, width: '100%' }, chipsAnimatedStyle]}
    >
      <SuggestionChips selectedIndex={selectedIndex} onSelect={onSelect} />
    </Animated.View>
  );
}
