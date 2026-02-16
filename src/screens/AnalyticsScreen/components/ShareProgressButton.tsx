/**
 * ShareProgressButton Component
 * Allows users to share their analytics/progress at any time
 * Drives organic growth through social sharing
 */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Share2 } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '../../../theme/ThemeContext';

interface ShareProgressButtonProps {
  onPress: () => void;
}

export function ShareProgressButton({ onPress }: ShareProgressButtonProps) {
  const { colors } = useThemeColors();

  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(580).springify().damping(18)}
      style={{ marginTop: 16, marginBottom: 24 }}
    >
      <Pressable
        accessibilityHint='Share your habit progress on social media'
        accessibilityLabel='Share your progress'
        accessibilityRole='button'
        onPress={handlePress}
        style={({ pressed }) => [
          {
            backgroundColor: colors.primary,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 16,
            paddingHorizontal: 24,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <Share2 color='#FFFFFF' size={20} />
        <Text
          style={{
            color: '#FFFFFF',
            fontSize: 17,
            fontWeight: '600',
            marginLeft: 8,
          }}
        >
          Share Your Progress
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export default ShareProgressButton;
