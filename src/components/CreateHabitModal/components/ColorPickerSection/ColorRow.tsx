/**
 * One-row palette: 10 equal flex cells, one 26px dot each (spec §2).
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
      marginHorizontal: -2,
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
