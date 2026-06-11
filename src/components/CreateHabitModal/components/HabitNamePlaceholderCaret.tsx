import { View } from 'react-native';

interface Props {
  left: number;
}

/** Custom caret aligned to the first glyph of centered placeholder text. */
export function HabitNamePlaceholderCaret({ left }: Props) {
  return (
    <View
      pointerEvents='none'
      className='absolute top-4 h-8 w-0.5 rounded-full'
      style={{ backgroundColor: '#6D8DFF', left }}
    />
  );
}
