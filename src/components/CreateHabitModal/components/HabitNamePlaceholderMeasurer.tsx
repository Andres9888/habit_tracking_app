import { Text, type TextLayoutEvent } from 'react-native';
import { HABIT_NAME_INPUT_HORIZONTAL_PADDING } from './useCenteredPlaceholderCaretInset';

interface HabitNamePlaceholderMeasurerProps {
  fieldWidth: number;
  text: string;
  onTextLayout: (event: TextLayoutEvent) => void;
}

/** Mirrors centered, ellipsized placeholder layout to locate the first glyph. */
export function HabitNamePlaceholderMeasurer({
  fieldWidth,
  text,
  onTextLayout,
}: HabitNamePlaceholderMeasurerProps) {
  const innerWidth = Math.max(
    0,
    fieldWidth - HABIT_NAME_INPUT_HORIZONTAL_PADDING * 2
  );

  if (innerWidth <= 0) return null;

  return (
    <Text
      ellipsizeMode='tail'
      numberOfLines={1}
      pointerEvents='none'
      className='absolute text-2xl font-semibold opacity-0'
      style={{
        left: HABIT_NAME_INPUT_HORIZONTAL_PADDING,
        lineHeight: 28,
        textAlign: 'center',
        width: innerWidth,
      }}
      onTextLayout={onTextLayout}
    >
      {text}
    </Text>
  );
}
