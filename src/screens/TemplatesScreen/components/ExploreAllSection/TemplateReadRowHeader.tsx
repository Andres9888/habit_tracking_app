/** Top row of TemplateReadRow — icon, name, meta, add button. */

import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Check, Plus } from 'lucide-react-native';
import type { Doc, Id } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { iconSizes } from '@/theme/iconSizes';
import { triggerHaptic } from '@/utils/haptics';
import { getTemplateMetaLabel } from '../HabitTemplateCard/templateMeta';
import { useAddAnimation } from './useAddAnimation';
import { s } from './TemplateReadRow.styles';

interface TemplateReadRowHeaderProps {
  importingTemplateId: Id<'templates'> | null;
  isImported: boolean;
  item: Doc<'templates'>;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function TemplateReadRowHeader({
  importingTemplateId,
  isImported,
  item,
  onImport,
  onPreview,
}: TemplateReadRowHeaderProps) {
  const { colors } = useThemeColors();
  const isImporting = importingTemplateId === item._id;
  const animStyle = useAddAnimation(isImported);
  const iconBg = `${item.iconColor || colors.primary[600]}30`;
  const metaLabel = getTemplateMetaLabel(item);

  return (
    <Pressable
      accessibilityLabel={`${item.name} habit`}
      accessibilityRole='button'
      style={s.row}
      onPress={() => onPreview(item)}
    >
      <View style={[s.iconBox, { backgroundColor: iconBg }]}>
        <Text style={s.emoji}>{item.icon}</Text>
      </View>
      <View style={s.info}>
        <Text numberOfLines={1} style={[s.name, { color: colors.text.primary }]}>
          {item.name}
        </Text>
        {metaLabel ? (
          <Text style={[s.meta, { color: colors.text.tertiary }]}>{metaLabel}</Text>
        ) : null}
      </View>
      <AnimatedPressable
        accessibilityLabel={isImported ? `${item.name} added` : `Add ${item.name}`}
        accessibilityRole='button'
        disabled={isImported || isImporting}
        style={[
          s.addBtn,
          { backgroundColor: isImported ? colors.primary[100] : colors.primary[600] },
          animStyle,
        ]}
        onPress={(e) => {
          e?.stopPropagation?.();
          void triggerHaptic('selection');
          onImport(item);
        }}
      >
        {isImporting ? (
          <ActivityIndicator color={colors.text.inverse} size='small' />
        ) : isImported ? (
          <Check color={colors.primary[700]} size={iconSizes.small} strokeWidth={3} />
        ) : (
          <Plus color={colors.text.inverse} size={iconSizes.medium} strokeWidth={2.5} />
        )}
      </AnimatedPressable>
    </Pressable>
  );
}
