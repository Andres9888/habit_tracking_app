import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../../theme/ThemeContext';
import { CATEGORY_META } from '../../../data/categoryMeta';

interface AreaOfLifeQuestionProps {
  selectedCategories: string[];
  onSelect: (category: string) => void;
}

export function AreaOfLifeQuestion({ selectedCategories, onSelect }: AreaOfLifeQuestionProps) {
  const { colors } = useThemeColors();
  return (
    <View>
      <Text style={[s.question, { color: colors.text.primary }]}>
        What area of life do you want to improve?
      </Text>
      <ScrollView contentContainerStyle={s.grid} showsVerticalScrollIndicator={false}>
        {Object.entries(CATEGORY_META).map(([key, meta]) => {
          const isSelected = selectedCategories.includes(key);
          return (
            <Pressable
              key={key}
              style={[s.chip, { backgroundColor: isSelected ? meta.bgColor : colors.card, borderColor: isSelected ? meta.borderColor : colors.border }]}
              onPress={() => onSelect(key)}
            >
              <Text style={s.chipIcon}>{meta.icon}</Text>
              <Text style={[s.chipLabel, { color: isSelected ? meta.textColor : colors.text.primary }]}>
                {meta.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  chip: { alignItems: 'center', borderRadius: 12, borderWidth: 1.5, margin: 4, padding: 10, width: '45%' },
  chipIcon: { fontSize: 22, marginBottom: 4 },
  chipLabel: { fontSize: 13, fontWeight: '500', textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingBottom: 8 },
  question: { fontSize: 17, fontWeight: '600', marginBottom: 16, textAlign: 'center' },
});
