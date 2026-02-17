/**
 * Apple Health Icon
 * Created by: Sonnet (Claude Sonnet 4.5)
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface AppleHealthIconProps {
  size?: number;
  color?: string;
}

export function AppleHealthIcon({ size = 24, color = '#FF2D55' }: AppleHealthIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Apple Health heart icon */}
      <Path
        d="M12 21C12 21 3 14.5 3 8.5C3 5.5 5.5 3 8.5 3C10.5 3 12 4.5 12 4.5C12 4.5 13.5 3 15.5 3C18.5 3 21 5.5 21 8.5C21 14.5 12 21 12 21Z"
        fill={color}
      />
      <Path
        d="M12 8V14M9 11H15"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}
