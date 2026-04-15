import { Animated, Pressable, Text } from 'react-native';
import { Award } from 'lucide-react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import { borderRadius } from '../../theme/spacing';
import { typography, fontFamilies } from '@/theme/typography';

interface FormedActionProps {
  dragX: Animated.AnimatedInterpolation<number>;
  onPress: () => void;
}

export function FormedAction({ dragX, onPress }: FormedActionProps) {
  const { isDark } = useThemeColors();

  const iconScale = dragX.interpolate({
    extrapolate: 'clamp',
    inputRange: [-240, -180, -120, 0],
    outputRange: [1.1, 1, 0.85, 0.8],
  });

  const iconOpacity = dragX.interpolate({
    extrapolate: 'clamp',
    inputRange: [-240, -120, 0],
    outputRange: [1, 0.85, 0.6],
  });

  return (
    <Pressable
      accessibilityLabel="Mark habit as formed"
      accessibilityRole="button"
      onPress={onPress}
      style={{
        alignItems: 'center',
        backgroundColor: isDark ? '#8b5cf6' : '#7c3aed',
        height: '100%',
        justifyContent: 'center',
        width: 80,
      }}
    >
      <Animated.View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          opacity: iconOpacity,
          transform: [{ scale: iconScale }],
        }}
      >
        <Award color="white" size={22} strokeWidth={2} />
        <Text
          style={{
            color: 'white',
            fontFamily: fontFamilies.primary.text,
            fontSize: typography.tabBar.fontSize,
            fontWeight: '600',
            letterSpacing: 0.2,
            marginTop: 4,
          }}
        >
          Formed
        </Text>
      </Animated.View>
    </Pressable>
  );
}
