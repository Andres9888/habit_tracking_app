import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';
import { Motion } from '../../../constants/motion';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import { SkeletonButton } from './SkeletonLoader';

interface NameSuggestionsProps {
  query: string;
  onPick: (emoji: string | null, name: string, color?: string) => void;
}

const SUGGESTIONS: { emoji: string | null; name: string; color: string }[] = [
  // Health & Fitness
  { emoji: '💧', name: 'Drink water', color: '#60a5fa' },
  { emoji: '🚶', name: 'Walk 15 minutes', color: '#10b981' },
  { emoji: '🏃', name: 'Run 20 minutes', color: '#22c55e' },
  { emoji: '💪', name: 'Workout 30 minutes', color: '#14b8a6' },
  { emoji: '🧘', name: 'Meditate 5 minutes', color: '#a78bfa' },
  { emoji: '🚴', name: 'Bike ride', color: '#06b6d4' },
  { emoji: '🤸', name: 'Stretch 10 minutes', color: '#8b5cf6' },
  { emoji: '😴', name: 'Sleep 8 hours', color: '#6366f1' },
  { emoji: '🌅', name: 'Wake up early', color: '#f59e0b' },

  // Nutrition
  { emoji: '🍎', name: 'Eat a healthy snack', color: '#ef4444' },
  { emoji: '🥗', name: 'Eat vegetables', color: '#84cc16' },
  { emoji: '🍊', name: 'Take vitamins', color: '#fb923c' },
  { emoji: '☕', name: 'No coffee after 2pm', color: '#78716c' },
  { emoji: '🥤', name: 'No soda today', color: '#78716c' },

  // Mental & Learning
  { emoji: '📖', name: 'Read 10 minutes', color: '#f59e0b' },
  { emoji: '📝', name: 'Journal 3 lines', color: '#f97316' },
  { emoji: '🙏', name: 'Practice gratitude', color: '#ec4899' },
  { emoji: '🧠', name: 'Learn something new', color: '#3b82f6' },
  { emoji: '📚', name: 'Study 30 minutes', color: '#eab308' },
  { emoji: '✍️', name: 'Write 100 words', color: '#a855f7' },

  // Productivity & Focus
  { emoji: '📱', name: 'No phone for 1 hour', color: '#78716c' },
  { emoji: '🎯', name: 'Complete daily goal', color: '#dc2626' },
  { emoji: '📅', name: 'Plan tomorrow', color: '#0891b2' },
  { emoji: '🧹', name: 'Clean for 10 minutes', color: '#06b6d4' },
  { emoji: '✅', name: 'Make my bed', color: '#10b981' },
  { emoji: '⏰', name: 'Time block work', color: '#7c3aed' },

  // Social & Creative
  { emoji: '👨‍👩‍👧‍👦', name: 'Call family', color: '#f472b6' },
  { emoji: '💌', name: 'Text a friend', color: '#fb7185' },
  { emoji: '🎨', name: 'Creative time', color: '#ec4899' },
  { emoji: '🎸', name: 'Practice instrument', color: '#a855f7' },
  { emoji: '📷', name: 'Take a photo', color: '#6366f1' },
  { emoji: '🌱', name: 'Tend to plants', color: '#22c55e' },
];

// Separate component to fix Rules of Hooks
interface SuggestionChipProps {
  emoji: string | null;
  name: string;
  color: string;
  onPick: (emoji: string | null, name: string, color: string) => void;
}

const SuggestionChip = ({ emoji, name, color, onPick }: SuggestionChipProps) => {
  const scale = useRef(new Animated.Value(1)).current;
  const { triggerSelection } = useHapticFeedback();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityRole='button'
        accessibilityLabel={`Use template ${name}`}
        className='flex-row items-center rounded-full bg-white px-3 py-2'
        style={{ borderColor: '#d6d3d1', borderWidth: 1 }}
        onPressIn={() => {
          Animated.timing(scale, {
            duration: Motion.duration.fast,
            easing: Motion.easing.inEase,
            toValue: 0.96,
            useNativeDriver: true,
          }).start();
        }}
        onPressOut={() => {
          Animated.timing(scale, {
            duration: Motion.duration.base,
            easing: Motion.easing.outEase,
            toValue: 1,
            useNativeDriver: true,
          }).start();
        }}
        onPress={() => {
          triggerSelection();
          onPick(emoji, name, color);
        }}
      >
        {emoji && <Text className='mr-2 text-base'>{emoji}</Text>}
        <Text className='text-sm font-medium text-[#1c1917]'>{name}</Text>
        <Text className='ml-1 text-xs'>✨</Text>
      </Pressable>
    </Animated.View>
  );
};

export const NameSuggestions = ({ query, onPick }: NameSuggestionsProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return SUGGESTIONS.slice(0, 4);
    return SUGGESTIONS.filter(({ name }) => name.toLowerCase().includes(q)).slice(0, 6);
  }, [query]);

  // Simulate brief loading for polish
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [query]);

  if (items.length === 0) return null;

  return (
    <View className='mb-6'>
      <Text className='mb-2 text-xs font-semibold uppercase tracking-wide text-[#78716c]'>💡 Tap to use</Text>
      {isLoading ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName='gap-2'>
          {[1, 2, 3, 4].map((i) => (
            <SkeletonButton key={i} />
          ))}
        </ScrollView>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName='gap-2'>
          {items.map(({ emoji, name, color }) => (
            <SuggestionChip
              key={`${emoji ?? 'none'}-${name}`}
              emoji={emoji}
              name={name}
              color={color}
              onPick={onPick}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default NameSuggestions;

