import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { legendHintStyles } from './HeatmapLegendHint.styles';

interface HeatmapLegendHintBodyProps {
  habitColor: string;
  missedTint: string;
  onClose: () => void;
}

export const HeatmapLegendHintBody = memo(function HeatmapLegendHintBody({
  habitColor,
  missedTint,
  onClose,
}: HeatmapLegendHintBodyProps) {
  const { colors } = useThemeColors();

  return (
    <View style={legendHintStyles.body}>
      <Text style={[legendHintStyles.title, { color: colors.text.primary }]}>
        Reading the grid
      </Text>
      <Text
        style={[legendHintStyles.subtitle, { color: colors.text.secondary }]}
      >
        Tap any day for its status. Colors mean:
      </Text>
      <View style={legendHintStyles.row}>
        <View
          style={[legendHintStyles.swatch, { backgroundColor: missedTint }]}
        />
        <Text style={[legendHintStyles.label, { color: colors.text.primary }]}>
          Light tint — missed
        </Text>
      </View>
      <View style={legendHintStyles.row}>
        <View
          style={[legendHintStyles.swatch, { backgroundColor: habitColor }]}
        />
        <Text style={[legendHintStyles.label, { color: colors.text.primary }]}>
          Solid fill — done
        </Text>
      </View>
      <Pressable
        accessibilityRole='button'
        style={[
          legendHintStyles.button,
          { backgroundColor: colors.primary[500] },
        ]}
        onPress={onClose}
      >
        <Text
          style={[legendHintStyles.buttonText, { color: colors.text.inverse }]}
        >
          Got it
        </Text>
      </Pressable>
    </View>
  );
});
