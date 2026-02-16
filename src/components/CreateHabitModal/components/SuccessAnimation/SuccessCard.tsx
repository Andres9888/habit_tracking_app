/**
 * SuccessCard Component
 *
 * The celebration card shown after habit creation
 */

import { Animated, Pressable, Text } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';

interface SuccessCardProps {
  cardOpacity: Animated.Value;
  cardScale: Animated.Value;
  iconScale: Animated.Value;
  textOpacity: Animated.Value;
  buttonOpacity: Animated.Value;
  buttonTranslateY: Animated.Value;
  selectedColor: string;
  selectedEmoji: string | null;
  habitName: string;
  onComplete: () => void;
}

export const SuccessCard = ({
  cardOpacity,
  cardScale,
  iconScale,
  textOpacity,
  buttonOpacity,
  buttonTranslateY,
  selectedColor,
  selectedEmoji,
  habitName,
  onComplete,
}: SuccessCardProps) => {
  const { colors } = useThemeColors();

  return (
    <Animated.View
      style={{
        alignItems: 'center',
        backgroundColor: colors.card,
        borderRadius: 24,
        marginHorizontal: 32,
        opacity: cardOpacity,
        paddingHorizontal: 32,
        paddingVertical: 40,
        shadowColor: colors.text.primary,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        transform: [{ scale: cardScale }],
      }}
    >
      {/* Animated Icon */}
      <Animated.View
        style={{
          alignItems: 'center',
          backgroundColor: selectedColor || colors.info[100],
          borderRadius: 24,
          height: 96,
          justifyContent: 'center',
          marginBottom: 24,
          transform: [{ scale: iconScale }],
          width: 96,
        }}
      >
        <Text style={{ fontSize: 48 }}>{selectedEmoji || '🎯'}</Text>
      </Animated.View>

      {/* Success Text */}
      <Animated.View style={{ alignItems: 'center', opacity: textOpacity }}>
        <Text
          style={{
            color: colors.text.primary,
            fontSize: 24,
            fontWeight: '700',
            letterSpacing: -0.5,
            marginBottom: 8,
            textAlign: 'center',
          }}
        >
          {habitName}
        </Text>
        <Text style={{ color: colors.text.secondary, fontSize: 18, textAlign: 'center' }}>
          created! 🎉
        </Text>
        <Text
          style={{
            color: colors.text.tertiary,
            fontSize: 14,
            marginTop: 16,
            textAlign: 'center',
          }}
        >
          Your streak starts now
        </Text>
      </Animated.View>

      {/* CTA Button */}
      <Animated.View
        style={{
          marginTop: 32,
          opacity: buttonOpacity,
          transform: [{ translateY: buttonTranslateY }],
          width: '100%',
        }}
      >
        <Pressable
          accessibilityLabel='Start tracking habit'
          accessibilityRole='button'
          style={{
            alignItems: 'center',
            backgroundColor: colors.gray[900],
            borderRadius: 16,
            paddingVertical: 16,
          }}
          onPress={onComplete}
        >
          <Text style={{ color: colors.text.inverse, fontSize: 16, fontWeight: '600' }}>
            Let's get started! →
          </Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
};
