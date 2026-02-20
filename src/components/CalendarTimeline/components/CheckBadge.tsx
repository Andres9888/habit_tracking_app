import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { Check } from 'lucide-react-native';

interface CheckBadgeProps {
  reduceMotion: boolean;
}

const BADGE_SIZE = 14;

/** White circle with green checkmark at bottom-right of a day cell */
export const CheckBadge: React.FC<CheckBadgeProps> = ({ reduceMotion }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion) {
      scaleAnim.setValue(1);
      return;
    }

    Animated.spring(scaleAnim, {
      friction: 5,
      tension: 200,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim, reduceMotion]);

  return (
    <Animated.View
      style={{
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: BADGE_SIZE / 2,
        bottom: -2,
        elevation: 2,
        height: BADGE_SIZE,
        justifyContent: 'center',
        position: 'absolute',
        right: -2,
        shadowColor: '#000000',
        shadowOffset: { height: 1, width: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        transform: [{ scale: scaleAnim }],
        width: BADGE_SIZE,
        zIndex: 1,
      }}
    >
      <Check color='#10b981' size={8} strokeWidth={2.5} />
    </Animated.View>
  );
};
