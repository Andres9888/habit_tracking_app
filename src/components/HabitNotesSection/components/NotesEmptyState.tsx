/* eslint-disable max-lines */
/** NotesEmptyState - OPTIMIZED: Better animation, haptics, dark mode, Pressable for a11y */
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { StickyNote, Plus } from 'lucide-react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '../../../theme/ThemeContext';

interface NotesEmptyStateProps {
  onAddNote: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function NotesEmptyState({ onAddNote }: NotesEmptyStateProps) {
  const { colors, isDark } = useThemeColors();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 18, stiffness: 240 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 18, stiffness: 240 });
  };

  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onAddNote();
  };

  return (
    <Animated.View entering={FadeIn.duration(250)}>
      <AnimatedPressable
        accessible
        accessibilityLabel='Add your first note — record insights to learn what works best'
        accessibilityRole='button'
        style={[
          animatedStyle,
          {
            alignItems: 'center',
            backgroundColor: isDark ? '#451A03' : '#FFFBEB',
            borderRadius: 16,
            paddingVertical: 32,
            shadowColor: colors.text.primary,
            shadowOffset: { height: 4, width: 0 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
          },
        ]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {/* Icon */}
        <View
          style={{
            alignItems: 'center',
            backgroundColor: isDark ? '#78350F' : '#FDE68A',
            borderRadius: 12,
            height: 56,
            justifyContent: 'center',
            marginBottom: 12,
            width: 56,
          }}
        >
          <StickyNote color={isDark ? '#FCD34D' : '#D97706'} size={28} strokeWidth={1.5} />
        </View>

        {/* Text */}
        <Text
          style={{
            color: colors.text.primary,
            fontSize: 17,
            marginBottom: 4,
            textAlign: 'center',
          }}
        >
          Record insights to learn what works best
        </Text>

        {/* CTA */}
        <View
          style={{
            alignItems: 'center',
            backgroundColor: isDark ? '#D97706' : '#F59E0B',
            borderRadius: 20,
            flexDirection: 'row',
            gap: 6,
            marginTop: 12,
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}
        >
          <Plus color='#ffffff' size={16} strokeWidth={2.5} />
          <Text style={{ color: '#ffffff', fontSize: 13, fontWeight: '600' }}>
            Add Note
          </Text>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}
