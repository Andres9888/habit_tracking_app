import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { fontFamilies } from '../../../theme/typography';

const SIZE = 44;
const CENTER = SIZE / 2;
const RADIUS = 17;
const STROKE = 5;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface StrengthDialProps {
  percent: number;
  progressColor: string;
  textColor: string;
  trackColor: string;
}

export function StrengthDial({
  percent,
  progressColor,
  textColor,
  trackColor,
}: StrengthDialProps) {
  return (
    <View style={{ height: SIZE, justifyContent: 'center', width: SIZE }}>
      <Svg height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE}>
        <Circle
          cx={CENTER}
          cy={CENTER}
          fill='none'
          r={RADIUS}
          stroke={trackColor}
          strokeWidth={STROKE}
        />
        <Circle
          cx={CENTER}
          cy={CENTER}
          fill='none'
          r={RADIUS}
          rotation={-90}
          stroke={progressColor}
          strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          strokeDashoffset={CIRCUMFERENCE * (1 - percent / 100)}
          strokeLinecap='round'
          strokeWidth={STROKE}
          origin={`${CENTER}, ${CENTER}`}
        />
      </Svg>
      <Text
        style={{
          color: textColor,
          fontFamily: fontFamilies.primary.display,
          fontSize: 13,
          left: 0,
          position: 'absolute',
          right: 0,
          textAlign: 'center',
        }}
      >
        {percent}
      </Text>
    </View>
  );
}
