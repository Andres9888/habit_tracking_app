/**
 * Bottom rail — meta pill and View details link.
 */

import { useState } from 'react';
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
  // Instant press feedback — without it the preview-open work reads as lag.
  // State-based: function-form Pressable styles silently drop in this app.
  const [pressed, setPressed] = useState(false);
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
      <Pressable
        accessibilityLabel={`View details for ${item.name}`}
        accessibilityRole='button'
        hitSlop={8}
        style={{ opacity: pressed ? 0.45 : 1 }}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        onPress={(event) => {
          // Keep the parent card press from also firing on web; the event
          // can be undefined on native, so never assume it exists.
          event?.stopPropagation?.();
          onPreview(item);
        }}
      >
        <Text style={[s.viewDetails, { color: colors.primary[700] }]}>
          View details ›
        </Text>
      </Pressable>
    </View>
  );
}
