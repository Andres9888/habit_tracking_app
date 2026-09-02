import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { fontFamilies, fontWeights } from '../../../theme/typography';

const SIZE = 50;
const CENTER = SIZE / 2;
const RADIUS = 20;
const STROKE = 5;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface StrengthDialProps {
  percent: number;
  progressColor: string;
  textColor: string;
  trackColor: string;
  /** Ink for the "/100" caption; the number keeps `textColor`. */
  unitColor: string;
}

export function StrengthDial({
  percent,
  progressColor,
  textColor,
  trackColor,
  unitColor,
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
      {/* The bare numeral read as a rank with no unit. "/100" is the cheapest
          way to say what scale it is on, and it fits inside the ring. */}
      <View
        style={{
          alignItems: 'center',
          bottom: 0,
          justifyContent: 'center',
          left: 0,
          position: 'absolute',
          right: 0,
          top: 0,
        }}
      >
        <Text
          style={{
            color: textColor,
            fontFamily: fontFamilies.primary.display,
            fontSize: 13,
            lineHeight: 16,
            textAlign: 'center',
          }}
        >
          {percent}
        </Text>
        <Text
          style={{
            color: unitColor,
            fontFamily: fontFamilies.primary.text,
            fontSize: 8.5,
            fontWeight: fontWeights.semibold,
            lineHeight: 10,
            textAlign: 'center',
          }}
        >
          /100
        </Text>
      </View>
    </View>
  );
}
