/**
 * Colour grid on the same 5-column tracks as the icon grid (spec §2): gap 8,
 * 48px-tall cells, 36px swatches. Cell width is measured on layout so the
 * columns line up with the emoji tiles above on every device width.
 */
import { useCallback, useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import { ColorDot } from './ColorDot';

const GAP = 8;
const COLUMNS = 5;

interface ColorRowProps {
  colors: readonly string[];
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

export const ColorRow = ({
  colors,
  selectedColor,
  onSelectColor,
}: ColorRowProps) => {
  const [width, setWidth] = useState(0);
  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  }, []);
  const cell = width > 0 ? (width - GAP * (COLUMNS - 1)) / COLUMNS : 0;

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: GAP,
        opacity: cell > 0 ? 1 : 0,
      }}
      testID='color-picker-row'
      onLayout={handleLayout}
    >
      {colors.map((color) => (
        <ColorDot
          key={color}
          cellWidth={cell}
          color={color}
          isSelected={selectedColor === color}
          onSelect={onSelectColor}
        />
      ))}
    </View>
  );
};
