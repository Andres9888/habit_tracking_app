import React from 'react';
import { Animated, Text, Pressable } from 'react-native';
import { Pause, Play } from 'lucide-react-native';
import { colors } from '@/theme';
import { borderRadius } from '../../theme/spacing';
import { typography, fontFamilies} from '@/theme/typography';

interface PauseActionProps {
  dragX: Animated.AnimatedInterpolation<number>;
  isPaused: boolean;
  onPause?: () => void;
  onResume?: () => void;
}

export function PauseAction({
  dragX,
  isPaused,
  onPause,
  onResume,
}: PauseActionProps) {
  const trans = dragX.interpolate({
    extrapolate: 'clamp',
    inputRange: [-100, 0],
    outputRange: [0, 100],
  });

  const iconScale = dragX.interpolate({
    extrapolate: 'clamp',
    inputRange: [-100, -60, -30, 0],
    outputRange: [1.1, 1, 0.85, 0.8],
  });

  const iconOpacity = dragX.interpolate({
    extrapolate: 'clamp',
    inputRange: [-100, -40, 0],
    outputRange: [1, 0.85, 0.6],
  });

  const actionColor = isPaused ? colors.primary[500] : colors.premium[400]; // green for resume, purple for pause
  const actionLabel = isPaused ? 'Resume' : 'Pause';

  const handlePress = () => {
    if (isPaused && onResume) {
      onResume();
    } else if (!isPaused && onPause) {
      onPause();
    }
  };

  return (
    <Animated.View
      className='flex-row items-center justify-end'
      style={{ transform: [{ translateX: trans }] }}
    >
      <Pressable
        accessibilityLabel={actionLabel}
        accessibilityRole='button'
        onPress={handlePress}
        style={{
          alignItems: 'center',
          backgroundColor: actionColor,
          borderBottomRightRadius: borderRadius.xl,
          borderTopRightRadius: borderRadius.xl,
          height: '100%',
          justifyContent: 'center',
          width: 100,
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
          {isPaused ? (
            <Play color='white' size={22} strokeWidth={2} />
          ) : (
            <Pause color='white' size={22} strokeWidth={2} />
          )}
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
            {actionLabel}
          </Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}
