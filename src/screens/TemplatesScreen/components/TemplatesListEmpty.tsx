/**
 * Empty state for filtered template list — suggests categories and custom creation
 */

import { Pressable, ScrollView, Text, View } from 'react-native';
import { Plus } from 'lucide-react-native';
import Button from '../../../components/Button/Button';
import EmptyState from '../../../components/EmptyState';
import { useThemeColors } from '../../../theme/ThemeContext';
import { CATEGORY_META } from '../data/categoryMeta';
import { s } from './TemplatesListEmpty.styles';

interface TemplatesListEmptyProps {
  hasActiveFilters: boolean;
  onCreateCustom?: () => void;
  onResetFilters: () => void;
  onSelectCategory?: (categoryId: string) => void;
}

const SUGGESTED_CATEGORIES = [
  'morning_routine', 'health_fitness', 'mindfulness',
  'sleep', 'productivity', 'mental_health',
] as const;

export function TemplatesListEmpty({
  hasActiveFilters,
  onCreateCustom,
  onResetFilters,
  onSelectCategory,
}: TemplatesListEmptyProps) {
  const { colors } = useThemeColors();
  return (
    <View style={s.wrapper}>
      <EmptyState
        hideCTA
        description='Try a different search or explore a category below.'
        headline='No matching habits'
        icon='🔍'
      />
      {onSelectCategory ? (
        <ScrollView
          horizontal
          contentContainerStyle={s.pills}
          showsHorizontalScrollIndicator={false}
          style={s.pillScroll}
        >
          {SUGGESTED_CATEGORIES.map((id) => {
            const meta = CATEGORY_META[id];
            return (
              <Pressable
                key={id}
                accessibilityLabel={`Browse ${meta.label} habits`}
                accessibilityRole='button'
                style={[s.pill, { backgroundColor: meta.bgColor, borderColor: meta.borderColor }]}
                onPress={() => onSelectCategory(id)}
              >
                <Text style={s.pillIcon}>{meta.icon}</Text>
                <Text style={[s.pillLabel, { color: meta.textColor }]}>{meta.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : null}
      <View style={s.actions}>
        {hasActiveFilters ? (
          <Button size='medium' variant='secondary' onPress={onResetFilters}>
            Reset filters
          </Button>
        ) : null}
        {onCreateCustom ? (
          <Pressable
            accessibilityLabel='Create a custom habit'
            accessibilityRole='button'
            style={[s.createBtn, { borderColor: colors.border }]}
            onPress={onCreateCustom}
          >
            <Plus color={colors.primary[600]} size={16} strokeWidth={2.5} />
            <Text style={[s.createText, { color: colors.primary[600] }]}>
              Create custom habit
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
