import React from 'react';
import { Pressable, Text } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { Trash2 } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { colors } from '@/theme';
import { typography, fontWeights, fontFamilies } from '@/theme/typography';

interface DeleteActionProps {
  dragX: SharedValue<number>;
  onPress: () => void;
}

export function DeleteAction({ dragX, onPress }: DeleteActionProps) {
  const iconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      dragX.value,
      [-160, -80, 0],
      [1, 0.85, 0.6],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        scale: interpolate(
          dragX.value,
          [-160, -100, -60, 0],
          [1.1, 1, 0.85, 0.8],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  return (
    <Pressable
      accessibilityLabel="Delete habit"
      accessibilityRole="button"
      testID="delete-habit-action"
      onPress={onPress}
      style={{
        alignItems: 'center',
        backgroundColor: colors.error,
        height: '100%',
        justifyContent: 'center',
        width: 80,
      }}
    >
      <Animated.View
        style={[
          {
            alignItems: 'center',
            justifyContent: 'center',
          },
          iconStyle,
        ]}
      >
        <Trash2 color="white" size={iconSizes.large} strokeWidth={2} />
        <Text
          style={{
            color: 'white',
            fontFamily: fontFamilies.primary.text,
            fontSize: typography.tabBar.fontSize,
            fontWeight: fontWeights.semibold,
            letterSpacing: 0.2,
            marginTop: 4,
          }}
        >
          Delete
        </Text>
      </Animated.View>
    </Pressable>
  );
}
