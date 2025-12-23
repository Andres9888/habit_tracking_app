import { useCallback, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { Motion } from '../../../constants/motion';
import useHapticFeedback from '../../../hooks/useHapticFeedback';

interface SuggestionChip {
  name: string;
  emoji: string;
  color: string;
}

interface SuggestionChipsProps {
  onSelect: (chip: SuggestionChip) => void;
  visible: boolean;
}

const SUGGESTION_CHIPS: SuggestionChip[] = [
  { name: 'Drink water', emoji: '💧', color: '#3B82F6' },
  { name: 'Read 10 min', emoji: '📖', color: '#8B5CF6' },
  { name: 'Meditate', emoji: '🧘', color: '#22C55E' },
  { name: 'Exercise', emoji: '🏃', color: '#F97316' },
  { name: 'Journal', emoji: '✍️', color: '#EC4899' },
  { name: 'Sleep 8h', emoji: '😴', color: '#1E293B' },
];

interface ChipButtonProps {
  chip: SuggestionChip;
  onPress: () => void;
}

const ChipButton = ({ chip, onPress }: ChipButtonProps) => {
  const scale = useRef(new Animated.Value(1)).current;
  const { triggerSelection } = useHapticFeedback();

  const handlePressIn = useCallback(() => {
    Animated.timing(scale, {
      duration: Motion.duration.fast,
      easing: Motion.easing.inEase,
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      damping: 12,
      stiffness: 200,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const handlePress = useCallback(() => {
    triggerSelection();
    onPress();
  }, [triggerSelection, onPress]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityLabel={`Quick add ${chip.name} habit`}
        accessibilityRole="button"
        className="mr-2 mb-2 flex-row items-center rounded-full bg-white px-3 py-2"
        style={{
          borderWidth: 1,
          borderColor: '#e7e5e4',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
        }}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text className="mr-1.5 text-base">{chip.emoji}</Text>
        <Text className="text-sm font-medium text-stone-700">{chip.name}</Text>
      </Pressable>
    </Animated.View>
  );
};

export const SuggestionChips = ({ onSelect, visible }: SuggestionChipsProps) => {
  if (!visible) return null;

  return (
    <View className="mb-3">
      <Text className="mb-2 text-xs font-medium text-stone-500">
        QUICK START
      </Text>
      <View className="flex-row flex-wrap">
        {SUGGESTION_CHIPS.map((chip) => (
          <ChipButton
            key={chip.name}
            chip={chip}
            onPress={() => onSelect(chip)}
          />
        ))}
      </View>
    </View>
  );
};

export default SuggestionChips;
export type { SuggestionChip };
