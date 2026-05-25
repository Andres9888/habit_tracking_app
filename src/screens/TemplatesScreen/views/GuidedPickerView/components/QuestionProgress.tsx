import { StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../../theme/ThemeContext';

interface QuestionProgressProps {
  current: number;
  total: number;
}

export function QuestionProgress({ current, total }: QuestionProgressProps) {
  const { colors } = useThemeColors();
  return (
    <View style={s.row}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[
            s.dot,
            { backgroundColor: i <= current ? colors.primary[500] : colors.border },
          ]}
        />
      ))}
      <Text style={[s.label, { color: colors.text.secondary }]}>
        {current + 1} of {total}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  dot: { borderRadius: 4, height: 6, marginRight: 4, width: 24 },
  label: { fontSize: 12, marginLeft: 8 },
  row: { alignItems: 'center', flexDirection: 'row', marginBottom: 12 },
});
