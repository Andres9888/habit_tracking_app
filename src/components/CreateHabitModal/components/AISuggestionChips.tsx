import { useCallback, useMemo, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { Motion } from '../../../constants/motion';
import useHapticFeedback from '../../../hooks/useHapticFeedback';

interface AISuggestionChipsProps {
  input: string;
  onAppend: (suggestion: string) => void;
  visible: boolean;
}

// AI-like suggestions based on input patterns
const getAISuggestions = (input: string): string[] => {
  const q = input.toLowerCase().trim();

  if (q.length < 3) return [];

  if (q.includes('meditat')) return ['5 minutes', 'morning', 'before bed'];
  if (q.includes('read')) return ['10 minutes', '20 pages', 'before sleep'];
  if (q.includes('exercise') || q.includes('workout')) return ['30 minutes', 'morning', '3x week'];
  if (q.includes('run') || q.includes('jog')) return ['20 minutes', '2 miles', 'every day'];
  if (q.includes('water') || q.includes('drink')) return ['8 glasses', 'hourly', 'before meals'];
  if (q.includes('walk') || q.includes('step')) return ['10,000 steps', '30 minutes', 'after lunch'];
  if (q.includes('sleep')) return ['8 hours', 'by 10pm', 'no screens'];
  if (q.includes('journal') || q.includes('write')) return ['10 minutes', 'morning', 'gratitude'];
  if (q.includes('stretch') || q.includes('yoga')) return ['15 minutes', 'morning', 'evening'];
  if (q.includes('learn') || q.includes('study')) return ['30 minutes', 'new skill', 'daily'];
  if (q.includes('clean') || q.includes('tidy')) return ['15 minutes', 'morning', 'before bed'];
  if (q.includes('call') || q.includes('phone')) return ['weekly', 'parents', 'friends'];
  if (q.includes('grateful') || q.includes('gratitude')) return ['3 things', 'morning', 'evening'];
  if (q.includes('vitamin') || q.includes('supplement')) return ['morning', 'with food', 'daily'];
  if (q.includes('breakfast') || q.includes('meal')) return ['healthy', '7am', 'no skip'];
  if (q.includes('practice') || q.includes('music')) return ['30 minutes', 'scales', 'daily'];
  if (q.includes('floss') || q.includes('teeth')) return ['after meals', 'before bed', 'morning'];

  // Generic time-based suggestions if nothing specific matches
  if (q.length >= 5) return ['daily', 'morning', 'evening'];

  return [];
};

interface SuggestionButtonProps {
  suggestion: string;
  onPress: () => void;
}

const SuggestionButton = ({ suggestion, onPress }: SuggestionButtonProps) => {
  const scale = useRef(new Animated.Value(1)).current;
  const { triggerLightImpact } = useHapticFeedback();

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
    triggerLightImpact();
    onPress();
  }, [triggerLightImpact, onPress]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityLabel={`Add ${suggestion} to habit name`}
        accessibilityRole="button"
        className="mr-2 mb-2 flex-row items-center rounded-full px-3 py-1.5"
        style={{
          backgroundColor: '#EDE9FE', // Light purple/violet
          borderWidth: 1,
          borderColor: '#C4B5FD',
        }}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text className="mr-1 text-xs text-violet-600">+</Text>
        <Text className="text-sm font-medium text-violet-700">{suggestion}</Text>
      </Pressable>
    </Animated.View>
  );
};

export const AISuggestionChips = ({ input, onAppend, visible }: AISuggestionChipsProps) => {
  const suggestions = useMemo(() => getAISuggestions(input), [input]);

  if (!visible || suggestions.length === 0) return null;

  return (
    <View className="mb-3">
      <Text className="mb-2 text-xs font-medium text-violet-500">
        ✨ SUGGESTIONS
      </Text>
      <View className="flex-row flex-wrap">
        {suggestions.map((suggestion) => (
          <SuggestionButton
            key={suggestion}
            suggestion={suggestion}
            onPress={() => onAppend(suggestion)}
          />
        ))}
      </View>
    </View>
  );
};

export default AISuggestionChips;
