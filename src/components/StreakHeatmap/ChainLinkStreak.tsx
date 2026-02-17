/**
 * ChainLinkStreak Component
 *
 * Animated chain links that grow with the streak count.
 * Each link appears with a staggered spring animation,
 * giving a satisfying visual of the chain building up.
 *
 * Design system: springify().damping(18), 60ms stagger
 */

import React, { memo } from 'react';
import { View } from 'react-native';
import Animated, {
  FadeInRight,
  ZoomIn,
} from 'react-native-reanimated';
import { ChainLinkIcon } from '../ChainLinkIcon/ChainLinkIcon';
import { useThemeColors } from '../../theme/ThemeContext';

interface ChainLinkStreakProps {
  /** Number of chain links to display (capped visually at 7) */
  count: number;
  /** Color for the chain links */
  color: string;
  /** Reduce motion for accessibility */
  reduceMotion?: boolean;
}

const LINK_SIZE = 16;
const LINK_OVERLAP = -4; // Overlap links slightly for chain effect
const STAGGER_MS = 60;
const ANIMATION_DURATION = 280;

const ChainLinkStreakComponent: React.FC<ChainLinkStreakProps> = ({
  count,
  color,
  reduceMotion = false,
}) => {
  const { isDark } = useThemeColors();
  const linkColor = isDark ? `${color}CC` : color;

  const links = Array.from({ length: Math.min(count, 7) }, (_, i) => i);

  return (
    <View className='flex-row items-center'>
      {links.map((i) => (
        <Animated.View
          key={i}
          entering={
            reduceMotion
              ? undefined
              : ZoomIn.delay(i * STAGGER_MS)
                  .duration(ANIMATION_DURATION)
                  .springify()
                  .damping(18)
          }
          style={{ marginLeft: i === 0 ? 0 : LINK_OVERLAP }}
        >
          <ChainLinkIcon
            color={linkColor}
            size={LINK_SIZE}
            variant='filled'
          />
        </Animated.View>
      ))}
    </View>
  );
};

export const ChainLinkStreak = memo(ChainLinkStreakComponent);
