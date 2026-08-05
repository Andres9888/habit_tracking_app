import { Text, type TextLayoutEvent } from 'react-native';

interface HabitNamePlaceholderMeasurerProps {
  text: string;
  onTextLayout: (event: TextLayoutEvent) => void;
}

/** Measures placeholder text so the empty-field caret can start at its first glyph. */
export function HabitNamePlaceholderMeasurer({
  text,
  onTextLayout,
}: HabitNamePlaceholderMeasurerProps) {
  return (
    <Text
      accessibilityElementsHidden
      importantForAccessibility='no-hide-descendants'
      numberOfLines={1}
      pointerEvents='none'
      className='absolute text-2xl font-semibold opacity-0'
      style={{
        lineHeight: 28,
      }}
      onTextLayout={onTextLayout}
    >
      {text}
    </Text>
  );
}
