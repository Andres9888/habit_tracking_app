import { useCallback, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
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
  { color: colors.secondary[500], emoji: '💧', name: 'Drink water' },
  { color: '#8B5CF6', emoji: '📖', name: 'Read 10 min' },
  { color: '#22C55E', emoji: '🧘', name: 'Meditate' },
  { color: '#F97316', emoji: '🏃', name: 'Exercise' },
  { color: '#EC4899', emoji: '✍️', name: 'Journal' },
  { color: '#1E293B', emoji: '😴', name: 'Sleep 8h' },
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
      damping: 12,
      stiffness: 200,
      toValue: 1,
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
        accessibilityRole='button'
        className='mb-2 mr-2 flex-row items-center rounded-full bg-white px-3 py-2'
        style={{
          borderColor: '#e7e5e4',
          borderWidth: 1, // stone-200
          shadowColor: '#000',
          shadowOffset: { height: 1, width: 0 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
        }}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text className='mr-1.5 text-base'>{chip.emoji}</Text>
        <Text className='text-sm font-medium text-stone-700'>{chip.name}</Text>
      </Pressable>
    </Animated.View>
  );
};

export const SuggestionChips = ({
  onSelect,
  visible,
}: SuggestionChipsProps) => {
  if (!visible) return null;

  return (
    <View className='mb-3'>
      <Text className='mb-2 text-xs font-medium text-stone-500'>
        QUICK START
      </Text>
      <View className='flex-row flex-wrap'>
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
