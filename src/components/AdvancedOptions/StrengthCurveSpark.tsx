/** Area-filled growth sparkline for a Strength Curve card — emerald only. */
import Svg, { Path } from 'react-native-svg';

interface Props {
  path: string;
  fillPath: string;
  stroke: string;
}

export function StrengthCurveSpark({ path, fillPath, stroke }: Props) {
  return (
    <Svg height={36} viewBox='0 0 100 36' width='100%'>
      <Path d={fillPath} fill={stroke} fillOpacity={0.12} />
      <Path
        d={path}
        fill='none'
        stroke={stroke}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2.2}
      />
    </Svg>
  );
}
