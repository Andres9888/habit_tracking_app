/**
 * CalendarGlyph — lucide calendar icon with an optional day number rendered
 * inside its body (iOS-calendar style). Used by the date-navigator pill so
 * "today" survives as iconography instead of duplicating the highlighted
 * today cell in the week strip below. The number is a positioned Text
 * overlay (not SVG text) so it renders in the app font.
 */
import { Text, View } from 'react-native';
import { Calendar } from 'lucide-react-native';
import { fontWeights } from '../../../theme/typography';

/** Fraction of the icon box occupied by the header bar + date posts. */
const BODY_TOP_RATIO = 0.42;

interface CalendarGlyphProps {
  color: string;
  dayNumber?: string;
  size: number;
}

export function CalendarGlyph({ color, dayNumber, size }: CalendarGlyphProps) {
  const bodyTop = size * BODY_TOP_RATIO;

  return (
    <View style={{ height: size, width: size }}>
      <Calendar color={color} size={size} strokeWidth={dayNumber ? 1.8 : 2} />
      {dayNumber ? (
        <Text
          allowFontScaling={false}
          style={{
            color,
            fontSize: size * 0.44,
            fontWeight: fontWeights.bold,
            left: 0,
            lineHeight: size - bodyTop,
            position: 'absolute',
            right: 0,
            textAlign: 'center',
            top: bodyTop,
          }}
        >
          {dayNumber}
        </Text>
      ) : null}
    </View>
  );
}
