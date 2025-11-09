import { useMemo, useRef } from 'react';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';
import { Motion } from '../../../constants/motion';
import useHapticFeedback from '../../../hooks/useHapticFeedback';

interface NameSuggestionsProps {
  query: string;
  onPick: (emoji: string | null, name: string, color?: string) => void;
}

const SUGGESTIONS: { emoji: string | null; name: string; color: string }[] = [
  { emoji: '💧', name: 'Drink water', color: '#60a5fa' },
  { emoji: '📖', name: 'Read 10 minutes', color: '#f59e0b' },
  { emoji: '🚶', name: 'Walk 15 minutes', color: '#10b981' },
  { emoji: '🧘', name: 'Meditate 5 minutes', color: '#a78bfa' },
  { emoji: '🍎', name: 'Eat a healthy snack', color: '#ef4444' },
  { emoji: '📝', name: 'Journal 3 lines', color: '#f97316' },
];

export const NameSuggestions = ({ query, onPick }: NameSuggestionsProps) => {
  const { triggerSelection } = useHapticFeedback();
  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return SUGGESTIONS.slice(0, 4);
    return SUGGESTIONS.filter(({ name }) => name.toLowerCase().includes(q)).slice(0, 6);
  }, [query]);

  if (items.length === 0) return null;

  return (
    <View className='mb-6'>
      <Text className='mb-2 text-xs font-semibold uppercase tracking-wide text-[#64748b]'>💡 Tap to use</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName='gap-2'>
        {items.map(({ emoji, name, color }) => {
          const scale = useRef(new Animated.Value(1)).current;
          return (
            <Animated.View key={`${emoji ?? 'none'}-${name}`} style={{ transform: [{ scale }] }}>
              <Pressable
                accessibilityRole='button'
                accessibilityLabel={`Use template ${name}`}
                className='flex-row items-center rounded-full bg-white px-3 py-2'
                style={{ borderColor: '#cbd5e1', borderWidth: 1 }}
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
                <Text className='text-sm font-medium text-[#0f172a]'>{name}</Text>
                <Text className='ml-1 text-xs'>✨</Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default NameSuggestions;

