/**
 * Top of the Habit Browser card — tinted icon square, serif title, the habit
 * description, and a "Details ›" link. Tapping anywhere opens the detail view.
 *
 * On the affordance, which has now been through three shapes:
 *
 *  - An outlined "Details ›" PILL was the original. Discoverable, but it made
 *    a third pill in a card where pills mean "tappable", and it cost ~50px.
 *  - A bare CHEVRON in the title row replaced it. That reads as the iOS
 *    disclosure idiom in a table row, but this is a big card whose dominant
 *    element is a high-contrast Add button — a tertiary glyph 200px away from
 *    the text it refers to is easy to never notice. Costly if missed: the
 *    detail view holds the science, the evidence and Start small.
 *  - So: the WORD, without the container. A text label is what actually
 *    carries discoverability; the border was only ever carrying visual weight.
 *    ~28px instead of ~50px, and no competing pill.
 *
 * The link is plain text, not a Pressable — the whole card already opens the
 * detail view, and a second control for the same action would be a duplicate
 * screen-reader stop.
 */

import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { withAlpha } from '../../../../theme/colors/alpha';
import { useBrowserPalette } from '../../browserPalette';
import { resolveIconColor } from './resolveIconColor';
import { s } from './TemplateReadRow.styles';

/** Icon tile tint strength behind the emoji. */
const ICON_TINT_ALPHA = 0.19;

interface TemplateReadRowHeaderProps {
  /** True while the habit is being imported — see TemplateReadRow. */
  disabled?: boolean;
  item: Doc<'templates'>;
  onPreview: (template: Doc<'templates'>) => void;
}

function TemplateReadRowHeaderImpl({
  disabled = false,
  item,
  onPreview,
}: TemplateReadRowHeaderProps) {
  const palette = useBrowserPalette();
  const iconBg = withAlpha(
    resolveIconColor(item.iconColor, palette.textSecondary),
    ICON_TINT_ALPHA
  );

  return (
    <Pressable
      accessibilityLabel={`${item.name} habit`}
      accessibilityHint='Opens habit details'
      accessibilityRole='button'
      // The card root is disabled during import; this nested Pressable would
      // otherwise still fire and open the preview mid-import.
      disabled={disabled}
      onPress={() => onPreview(item)}
    >
      <View style={s.titleRow}>
        {/* Decorative: the habit name already says what this is, and the
            emoji's own name ("person running") only adds noise on VoiceOver. */}
        <View
          accessibilityElementsHidden
          importantForAccessibility='no-hide-descendants'
          style={[s.iconBox, { backgroundColor: iconBg }]}
        >
          <Text style={s.emoji}>{item.icon}</Text>
        </View>
        <Text numberOfLines={2} style={[s.name, { color: palette.textPrimary }]}>
          {item.name}
        </Text>
      </View>
      <Text
        numberOfLines={3}
        style={[s.description, { color: palette.textSecondary }]}
      >
        {item.description}
      </Text>
      {/* Hidden from screen readers: the parent Pressable's hint already
          announces "Opens habit details". */}
      <Text
        accessibilityElementsHidden
        importantForAccessibility='no-hide-descendants'
        style={[s.detailsLink, { color: palette.textPrimary }]}
      >
        Details ›
      </Text>
    </Pressable>
  );
}

export const TemplateReadRowHeader = memo(TemplateReadRowHeaderImpl);
