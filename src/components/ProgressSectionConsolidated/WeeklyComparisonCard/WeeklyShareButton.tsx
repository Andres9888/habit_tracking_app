/**
 * WeeklyShareButton Component
 * Displays a share button when weekly trend is positive
 * Encourages social sharing after successful weeks
 */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Share2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '../../../theme/ThemeContext';

interface WeeklyShareButtonProps {
  rateChange: number;
  onPress: () => void;
}

export function WeeklyShareButton({
  rateChange,
  onPress,
}: WeeklyShareButtonProps) {
  const { colors } = useThemeColors();

  // Only show for positive trends (improvement of 10% or more)
  if (rateChange < 10) {
    return null;
  }

  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(300).delay(200)}
      style={{ marginTop: 12 }}
    >
      <Pressable
        accessibilityHint='Share your weekly improvement'
        accessibilityLabel='Share progress'
        accessibilityRole='button'
        onPress={handlePress}
        style={({ pressed }) => [
          {
            backgroundColor: colors.primary,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
            paddingHorizontal: 16,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <Share2 color='#FFFFFF' size={16} />
        <Text
          style={{
            color: '#FFFFFF',
            fontSize: 13,
            fontWeight: '600',
            marginLeft: 6,
          }}
        >
          Share This Week's Progress
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export default WeeklyShareButton;
