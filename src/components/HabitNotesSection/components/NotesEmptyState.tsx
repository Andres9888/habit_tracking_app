/** NotesEmptyState - Dark mode aware via useThemeColors */
import React from 'react';
import { Text, View } from 'react-native';
import { StickyNote, Plus } from 'lucide-react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '../../../theme';

interface NotesEmptyStateProps {
  onAddNote: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(View);

export function NotesEmptyState({ onAddNote }: NotesEmptyStateProps) {
  const { colors, isDark } = useThemeColors();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onAddNote();
  };

  return (
    <Animated.View entering={FadeIn.duration(250)}>
      <AnimatedPressable
        accessibilityLabel='Add your first note'
        accessibilityRole='button'
        style={[
          animatedStyle,
          {
            alignItems: 'center',
            borderRadius: 16,
            backgroundColor: isDark ? '#422006' : '#FFFBEB',
            paddingVertical: 32,
            borderWidth: 1,
            borderColor: isDark ? '#92400E' : 'transparent',
            shadowColor: isDark ? '#000' : '#1c1917',
            shadowOffset: { height: 4, width: 0 },
            shadowOpacity: isDark ? 0.3 : 0.08,
            shadowRadius: 16,
          },
        ]}
        onTouchCancel={handlePressOut}
        onTouchEnd={() => {
          handlePressOut();
          handlePress();
        }}
        onTouchStart={handlePressIn}
      >
        {/* Icon */}
        <View style={{
          marginBottom: 12,
          height: 56,
          width: 56,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 12,
          backgroundColor: isDark ? '#78350F' : '#FEF3C7',
        }}>
          <StickyNote color={isDark ? '#FBBF24' : '#D97706'} size={28} strokeWidth={1.5} />
        </View>

        {/* Text */}
        <Text style={{ marginBottom: 4, textAlign: 'center', fontSize: 17, color: colors.text.secondary }}>
          Record insights to learn what works best
        </Text>

        {/* CTA */}
        <View style={{
          marginTop: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          borderRadius: 999,
          backgroundColor: isDark ? '#D97706' : '#F59E0B',
          paddingHorizontal: 16,
          paddingVertical: 8,
        }}>
          <Plus color='#ffffff' size={16} strokeWidth={2.5} />
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#ffffff' }}>Add Note</Text>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}
