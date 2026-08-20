import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import type { Habit } from '../../../features/habits/types';
import { borderRadius, shadows } from '../../../theme/spacing';
import { fontFamilies, fontWeights } from '../../../theme/typography';
import { useInsightPalette } from '../insightPalette';
import {
  strengthLabel,
  strengthPercent,
} from './DetailHeroBanner/DetailHeroBanner.utils';

const SIZE = 44;
const CENTER = SIZE / 2;
const RADIUS = 17;
const STROKE = 5;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface StrengthSnapshotProps {
  habit: Habit;
}

export function StrengthSnapshot({ habit }: StrengthSnapshotProps) {
  const palette = useInsightPalette();
  const percent = strengthPercent(habit);
  const label = strengthLabel(percent);

  return (
    <View
      accessibilityLabel={`Habit strength ${percent} percent, ${label}`}
      accessibilityRole='progressbar'
      accessibilityValue={{ max: 100, min: 0, now: percent }}
      style={{
        alignItems: 'center',
        backgroundColor: palette.card,
        borderColor: palette.cardBorder,
        borderRadius: borderRadius.large,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 14,
        paddingVertical: 11,
        ...shadows.subtle,
      }}
    >
      <View style={{ height: SIZE, justifyContent: 'center', width: SIZE }}>
        <Svg height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE}>
          <Circle
            cx={CENTER}
            cy={CENTER}
            fill='none'
            r={RADIUS}
            stroke={palette.dialTrack}
            strokeWidth={STROKE}
          />
          <Circle
            cx={CENTER}
            cy={CENTER}
            fill='none'
            r={RADIUS}
            rotation={-90}
            stroke={palette.green}
            strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            strokeDashoffset={CIRCUMFERENCE * (1 - percent / 100)}
            strokeLinecap='round'
            strokeWidth={STROKE}
            origin={`${CENTER}, ${CENTER}`}
          />
        </Svg>
        <Text
          style={{
            color: palette.textPrimary,
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
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: palette.textPrimary,
            fontSize: 13,
            fontWeight: fontWeights.semibold,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            color: palette.textTertiary,
            fontSize: 11,
            lineHeight: 16,
            marginTop: 2,
          }}
        >
          Habit strength · a small snapshot, not today’s task
        </Text>
      </View>
    </View>
  );
}
