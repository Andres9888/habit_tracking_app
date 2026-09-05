/**
 * One-row palette: 10 dots spread with space-between (spec §2).
 */
import { View } from 'react-native';
import { ColorDot } from './ColorDot';

interface ColorRowProps {
  colors: readonly string[];
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

export const ColorRow = ({
  colors,
  selectedColor,
  onSelectColor,
}: ColorRowProps) => (
  <View
    style={{
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    }}
    testID='color-picker-row'
  >
    {colors.map((color) => (
      <ColorDot
        key={color}
        color={color}
        isSelected={selectedColor === color}
        onSelect={onSelectColor}
      />
    ))}
  </View>
);
