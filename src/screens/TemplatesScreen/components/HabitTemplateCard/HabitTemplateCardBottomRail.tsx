/**
 * Bottom rail — meta pill + the 🔬 science door (SPEC_05). The door deep-links
 * to the science section (initialAnchor='science'); the card body opens at top.
 */

import { Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import type { TemplatePreviewAnchor } from '../../TemplatesScreen.types';
import { ScienceDoorPill } from '../ScienceDoorPill/ScienceDoorPill';
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
  // Quiet filled pill — warm tonal overlay so the meta reads as a chip in both modes.
  const metaPillBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(45,42,38,0.06)';

  return (
    <View style={s.bottomRail}>
      <View style={[s.divider, { backgroundColor: dividerColor }]} />
      {metaLabel ? (
        <Text
          style={[
            s.metaPillLabel,
            { backgroundColor: metaPillBg, color: colors.text.secondary },
          ]}
        >
          {metaLabel}
        </Text>
      ) : (
        <View />
      )}
      <ScienceDoorPill
        template={item}
        onPress={(template) => onPreview(template, 'science')}
      />
    </View>
  );
}
