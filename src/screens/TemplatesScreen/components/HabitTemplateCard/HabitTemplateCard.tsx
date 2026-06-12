import { memo } from 'react';
import { Text, View } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { triggerHaptic } from '@/utils/haptics';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { shadows } from '../../../../theme/spacing';
import { ListCardAddButton } from '../../views/TemplateListCard/ListCardAddButton';
import { getImportedStateColors } from '../../utils/importedStateColors';
import type { TemplatePreviewAnchor } from '../../TemplatesScreen.types';
import { HabitTemplateCardBottomRail } from './HabitTemplateCardBottomRail';
import { HabitTemplateCardTopPick } from './HabitTemplateCardTopPick';
import { styles as s } from './HabitTemplateCard.styles';

export interface HabitTemplateCardProps {
  descriptionLines?: 2 | 3;
  elevated?: boolean;
  isImported: boolean;
  isImporting: boolean;
  isTopPick?: boolean;
  item: Doc<'templates'>;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (
    template: Doc<'templates'>,
    anchor?: TemplatePreviewAnchor
  ) => void;
}

function HabitTemplateCardComponent({
  descriptionLines = 3,
  elevated = false,
  isImported,
  isImporting,
  isTopPick = false,
  item,
  onImport,
  onPreview,
}: HabitTemplateCardProps) {
  const { colors, isDark } = useThemeColors();
  const importedColors = getImportedStateColors(isDark);
  const statusColors = colors.status;
  const topPickBorderColor = isDark
    ? statusColors.warning
    : statusColors.warningLight;
  const iconColor = item.iconColor || colors.primary[600];
  const backgroundColor = isImported
    ? importedColors.backgroundColor
    : colors.card;
  const borderColor = isImported
    ? importedColors.borderColor
    : isTopPick
      ? topPickBorderColor
      : colors.border;
  const opacity = isImporting ? 0.72 : 1;
  const cardStyle = { backgroundColor, borderColor, opacity };

  return (
    <AnimatedPressable
      accessibilityLabel={`${item.name} habit`}
      accessibilityRole='button'
      style={[s.card, shadows.subtle, elevated && shadows.card, cardStyle]}
      onPress={() => {
        void triggerHaptic('tap');
        onPreview(item);
      }}
    >
      {isTopPick ? <HabitTemplateCardTopPick /> : null}
      <View style={s.topRow}>
        <View style={[s.icon, { backgroundColor: `${iconColor}26` }]}>
          <Text style={s.iconText}>{item.icon}</Text>
        </View>
        <View style={s.body}>
          <Text
            numberOfLines={2}
            style={[s.name, { color: colors.text.primary }]}
          >
            {item.name}
          </Text>
          <Text
            numberOfLines={descriptionLines}
            style={[s.description, { color: colors.text.secondary }]}
          >
            {item.description}
          </Text>
        </View>
        <View style={s.addSlot}>
          <ListCardAddButton
            isImported={isImported}
            isImporting={isImporting}
            name={item.name}
            onImport={() => onImport(item)}
          />
        </View>
      </View>
      <HabitTemplateCardBottomRail item={item} onPreview={onPreview} />
    </AnimatedPressable>
  );
}

export const HabitTemplateCard = memo(HabitTemplateCardComponent);
