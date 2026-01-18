import { TouchableOpacity, View } from 'react-native';

interface ColorSwatchProps {
  color: string;
  colorName: string;
  isSelected: boolean;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
}

/**
 * Inner color swatch with selection ring UI
 * Handles the nested ring structure for selected state
 */
export const ColorSwatch = ({
  color,
  colorName,
  isSelected,
  onPress,
  onPressIn,
  onPressOut,
}: ColorSwatchProps) => (
  <View
    style={{
      alignItems: 'center',
      backgroundColor: isSelected ? color : 'transparent',
      borderRadius: 999,
      height: isSelected ? 52 : 44,
      justifyContent: 'center',
      width: isSelected ? 52 : 44,
    }}
  >
    {/* White gap ring */}
    <View
      style={{
        alignItems: 'center',
        backgroundColor: isSelected ? '#ffffff' : 'transparent',
        borderRadius: 999,
        height: isSelected ? 48 : 44,
        justifyContent: 'center',
        width: isSelected ? 48 : 44,
      }}
    >
      <TouchableOpacity
        accessibilityLabel={`${colorName} color${isSelected ? ', selected' : ''}`}
        accessibilityRole='button'
        accessibilityState={{ selected: isSelected }}
        style={{
          alignItems: 'center',
          backgroundColor: color,
          borderRadius: 999,
          height: 44,
          justifyContent: 'center',
          width: 44,
        }}
        testID={`color-swatch-${color.replace('#', '')}`}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      />
    </View>
  </View>
);
