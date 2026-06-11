/**
 * Bottom rail — meta pill and View details link.
 */

import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import type { TemplatePreviewAnchor } from '../../TemplatesScreen.types';
import { getTemplateMetaLabel } from './templateMeta';
import { styles as s } from './HabitTemplateCard.styles';

interface HabitTemplateCardBottomRailProps {
  item: Doc<'templates'>;
  onPreview: (
    template: Doc<'templates'>,
    anchor?: TemplatePreviewAnchor
  ) => void;
}

export function HabitTemplateCardBottomRail({
  item,
  onPreview,
}: HabitTemplateCardBottomRailProps) {
  const { colors, isDark } = useThemeColors();
  const metaLabel = getTemplateMetaLabel(item);
  const dividerColor = isDark ? colors.border : colors.gray[50];

  return (
    <View style={s.bottomRail}>
      <View style={[s.divider, { backgroundColor: dividerColor }]} />
      {metaLabel ? (
        <Text style={[s.metaPillLabel, { color: colors.text.secondary }]}>
          {metaLabel}
        </Text>
      ) : (
        <View />
      )}
      <Pressable
        accessibilityLabel={`View details for ${item.name}`}
        accessibilityRole='button'
        hitSlop={8}
        onPress={(event) => {
          event.stopPropagation();
          onPreview(item, 'science');
        }}
      >
        <Text style={[s.viewDetails, { color: colors.primary[700] }]}>
          View details ›
        </Text>
      </Pressable>
    </View>
  );
}
