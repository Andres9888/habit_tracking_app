import React from 'react';
import { View } from 'react-native';
import { Link2 } from 'lucide-react-native';
import Svg, { G, Rect } from 'react-native-svg';
import { colors } from '../../theme/colors';

interface ChainLinkIconProps {
  color?: string;
  size?: number;
  variant?: 'stroke' | 'filled';
  angleDeg?: number;
}

export const ChainLinkIcon: React.FC<ChainLinkIconProps> = ({
  color = colors.text.inverse,
  size = 20,
  variant = 'stroke',
  angleDeg = 0,
}) => {
  if (variant === 'stroke') {
    return (
      <View
        className='items-center justify-center'
        style={{ transform: [{ rotate: `${angleDeg}deg` }] }}
      >
        <Link2
          color={color}
          size={size}
          strokeWidth={3}
          // lucide already uses round caps/joins; ensure consistency
        />
      </View>
    );
  }

  const width = size;
  const height = Math.round((size * 16) / 20);

  return (
    <View
      className='items-center justify-center'
      style={{ transform: [{ rotate: `${angleDeg}deg` }] }}
    >
      <Svg fill='none' height={height} viewBox='0 0 20 16' width={width}>
        <G fill={color}>
          <Rect
            height={3.2}
            rx={1.6}
            transform='rotate(-30 1.6 7)'
            width={8}
            x={1.6}
            y={7}
          />
          <Rect
            height={3.2}
            rx={1.6}
            transform='rotate(30 10.4 5.8)'
            width={8}
            x={10.4}
            y={5.8}
          />
          <Rect height={1.6} rx={0.8} width={2.4} x={8.8} y={7.2} />
        </G>
      </Svg>
    </View>
  );
};
