/** Mini rising strength curve for the sheet preview CTA card. */
import Svg, { Circle, Path } from 'react-native-svg';

const CURVE_PATH = 'M2 28 C 14 27, 18 22, 26 16 S 44 5, 54 4';
const DIP_PATH = 'M30 13 l3 4 -2 -1.5';

interface Props {
  color: string;
}

export function StrengthCurveCtaSparkline({ color }: Props) {
  return (
    <Svg height={32} viewBox='0 0 56 32' width={56}>
      <Path
        d={CURVE_PATH}
        fill='none'
        stroke={color}
        strokeLinecap='round'
        strokeWidth={2.5}
      />
      <Path
        d={DIP_PATH}
        fill='none'
        opacity={0.7}
        stroke='#C84A4A'
        strokeLinecap='round'
        strokeWidth={2}
      />
      <Circle cx={54} cy={4} fill={color} r={3} />
    </Svg>
  );
}
