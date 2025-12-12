import { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { Sparkles, Lock } from 'lucide-react-native';
import { Motion } from '../../../constants/motion';
import useHapticFeedback from '../../../hooks/useHapticFeedback';

interface PremiumTeaserProps {
  habitName: string;
  onUpgrade: () => void;
}

// Mock AI suggestions based on habit name
const getAISuggestions = (name: string): string[] => {
  const q = name.toLowerCase();

  if (q.includes('read')) {
    return ['Best time: 9 PM before bed', 'Pair with: Evening tea ☕'];
  }
  if (q.includes('meditat') || q.includes('mindful')) {
    return ['Best time: 7 AM after waking', 'Pair with: Morning stretch 🧘'];
  }
  if (q.includes('run') || q.includes('jog') || q.includes('walk')) {
    return ['Best time: 6:30 AM', 'Pair with: Drink water 💧'];
  }
  if (q.includes('water') || q.includes('drink')) {
    return ['Best time: Every 2 hours', 'Start with: After each meal'];
  }
  if (q.includes('journal') || q.includes('write')) {
    return ['Best time: Before bed', 'Pair with: Gratitude practice 🙏'];
  }
  if (q.includes('workout') || q.includes('gym') || q.includes('exercise')) {
    return ['Best time: 5 PM after work', 'Pair with: Protein shake 🥤'];
  }

  return ['Personalized timing suggestions', 'Smart habit pairing recommendations'];
};

export const PremiumTeaser = ({ habitName, onUpgrade }: PremiumTeaserProps) => {
  const { triggerSelection } = useHapticFeedback();
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const suggestions = getAISuggestions(habitName);

  // Entrance animation
  useEffect(() => {
    if (habitName.trim().length >= 3) {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          delay: 500,
          duration: Motion.duration.enter,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          damping: 15,
          delay: 500,
          stiffness: 150,
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [habitName, opacityAnim, slideAnim]);

  // Shimmer animation loop
  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          duration: 1500,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          duration: 1500,
          toValue: 0,
          useNativeDriver: true,
        }),
      ])
    );
    shimmer.start();
    return () => shimmer.stop();
  }, [shimmerAnim]);

  if (habitName.trim().length < 3) {
    return null;
  }

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.6, 0.3],
  });

  return (
    <Animated.View
      className="mb-6"
      style={{
        opacity: opacityAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <Pressable
        accessibilityLabel="Unlock AI suggestions with Premium"
        accessibilityRole="button"
        className="overflow-hidden rounded-2xl"
        onPress={() => {
          triggerSelection();
          onUpgrade();
        }}
      >
        {/* Background with gradient effect */}
        <View className="bg-gradient-to-r from-amber-50 to-orange-50 p-4">
          {/* Shimmer overlay */}
          <Animated.View
            className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/30 to-transparent"
            style={{ opacity: shimmerOpacity }}
          />

          {/* Content */}
          <View className="relative">
            {/* Header */}
            <View className="mb-3 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Sparkles color="#f59e0b" size={18} />
                <Text className="ml-2 text-sm font-bold text-amber-700">
                  AI Suggestions
                </Text>
              </View>
              <View className="flex-row items-center rounded-full bg-amber-100 px-2 py-1">
                <Lock color="#b45309" size={12} />
                <Text className="ml-1 text-[10px] font-bold text-amber-700">PRO</Text>
              </View>
            </View>

            {/* Blurred suggestions preview */}
            <View className="mb-3">
              {suggestions.map((suggestion, index) => (
                <View
                  key={index}
                  className="mb-1 flex-row items-center"
                  style={{ opacity: 0.7 }}
                >
                  <Text className="mr-2 text-amber-500">•</Text>
                  <Text
                    className="text-sm text-amber-800"
                    style={{
                      textShadowColor: 'rgba(245, 158, 11, 0.5)',
                      textShadowOffset: { height: 0, width: 0 },
                      textShadowRadius: 4,
                    }}
                  >
                    {suggestion}
                  </Text>
                </View>
              ))}
            </View>

            {/* CTA */}
            <View className="flex-row items-center justify-between rounded-xl bg-amber-500/20 px-3 py-2">
              <Text className="text-xs font-medium text-amber-700">
                Unlock personalized insights
              </Text>
              <Text className="text-xs font-bold text-amber-600">Try Premium →</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default PremiumTeaser;
