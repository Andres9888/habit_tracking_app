/**
 * Compact habit row card for the Explore All section
 */

import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Check, Plus } from 'lucide-react-native';
import type { Doc, Id } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { iconSizes } from '@/theme/iconSizes';
import { triggerHaptic } from '@/utils/haptics';
import { useAddAnimation } from './ExploreHabitRow.hooks';
import { s } from './ExploreHabitRow.styles';

interface ExploreHabitRowProps {
  importedTemplateIds: Set<string>;
  importingTemplateId: Id<'templates'> | null;
  item: Doc<'templates'>;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ExploreHabitRow({
  importedTemplateIds, importingTemplateId, item, onImport, onPreview,
}: ExploreHabitRowProps) {
  const { colors } = useThemeColors();
  const isImporting = importingTemplateId === item._id;
  const isImported = importedTemplateIds.has(item._id);
  const animStyle = useAddAnimation(isImported);
  const iconBg = `${item.iconColor || colors.primary[600]}30`;

  return (
    <Pressable
      accessibilityLabel={`${item.name} habit`}
      accessibilityRole='button'
      style={[s.row, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => onPreview(item)}
    >
      <View style={[s.iconBox, { backgroundColor: iconBg }]}>
        <Text style={s.emoji}>{item.icon}</Text>
      </View>
      <View style={s.info}>
        <Text numberOfLines={1} style={[s.name, { color: colors.text.primary }]}>
          {item.name}
        </Text>
        {item.description ? (
          <Text numberOfLines={1} style={[s.desc, { color: colors.text.secondary }]}>
            {item.description}
          </Text>
        ) : null}
        <View style={s.meta}>
          {item.frequency ? (
            <Text style={[s.freq, { color: colors.text.tertiary }]}>
              {item.frequency}
            </Text>
          ) : null}
          {item.scientificReference ? (
            <>
              <View style={[s.dot, { backgroundColor: colors.text.tertiary }]} />
              <View style={[s.badge, { backgroundColor: colors.primary[100] }]}>
                <Text style={[s.badgeText, { color: colors.primary[700] }]}>Science</Text>
              </View>
            </>
          ) : null}
        </View>
      </View>
      <AnimatedPressable
        accessibilityLabel={isImported ? `${item.name} added` : `Add ${item.name}`}
        accessibilityRole='button'
        disabled={isImported || isImporting}
        style={[s.addBtn, {
          backgroundColor: isImported ? colors.primary[100] : colors.primary[600],
        }, animStyle]}
        onPress={(e) => { e.stopPropagation(); void triggerHaptic('selection'); onImport(item); }}
      >
        {isImporting ? (
          <ActivityIndicator color={colors.text.inverse} size='small' />
        ) : isImported ? (
          <Check color={colors.primary[700]} size={iconSizes.small} strokeWidth={3} />
        ) : (
          <Plus color={colors.text.inverse} size={18} strokeWidth={2.5} />
        )}
      </AnimatedPressable>
    </Pressable>
  );
}
