import { borderRadius } from '@/theme/spacing';
import { LinearGradient } from 'expo-linear-gradient';
import type { ViewStyle } from 'react-native';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import type { AnimatedStyle } from 'react-native-reanimated';

export function StrengthBarTrack({
  accent,
  empty,
  scale,
  fillStyle,
}: {
  accent: string;
  empty: string;
  scale: number;
  fillStyle: AnimatedStyle<ViewStyle>;
}) {
  return (
    <View
      style={{
        height: 28 * scale,
        backgroundColor: empty,
        borderRadius: borderRadius.full,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            borderRadius: borderRadius.full,
            overflow: 'hidden',
          },
          fillStyle,
        ]}
      >
        <LinearGradient
          colors={[accent, accent]}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
}
