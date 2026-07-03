/** Expandable "Why this works" science drawer for TemplateReadRow. */

import { Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import type { AnimatedStyle } from 'react-native-reanimated';
import { ChevronDown, FlaskConical } from 'lucide-react-native';
import type { LayoutChangeEvent, ViewStyle } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { iconSizes } from '@/theme/iconSizes';
import { getShortCitation } from '../HabitTemplateCard/templateMeta';
import { s } from './TemplateReadRow.styles';

interface TemplateReadRowDrawerProps {
  chevronAnimatedStyle: AnimatedStyle<ViewStyle>;
  contentAnimatedStyle: AnimatedStyle<ViewStyle>;
  expanded: boolean;
  item: Doc<'templates'>;
  onContentLayout: (event: LayoutChangeEvent) => void;
  onToggle: () => void;
}

export function TemplateReadRowDrawer({
  chevronAnimatedStyle,
  contentAnimatedStyle,
  expanded,
  item,
  onContentLayout,
  onToggle,
}: TemplateReadRowDrawerProps) {
  const { colors } = useThemeColors();
  const citation = getShortCitation(item);
  // Tint the science affordance with the habit's own category accent (same
  // color as the row icon), matching the "Two Worlds" mock.
  const accent = item.iconColor || colors.primary[600];

  return (
    <>
      <Pressable
        accessibilityLabel={expanded ? 'Hide why this works' : 'Show why this works'}
        accessibilityRole='button'
        style={[
          s.toggle,
          {
            backgroundColor: expanded ? `${accent}0A` : 'transparent',
            borderTopColor: colors.border,
          },
        ]}
        onPress={onToggle}
      >
        <FlaskConical color={accent} size={iconSizes.small} strokeWidth={2} />
        <Text numberOfLines={1} style={[s.toggleLabel, { color: accent }]}>
          Why this works · 1-min read
        </Text>
        <Animated.View style={chevronAnimatedStyle}>
          <ChevronDown color={accent} size={iconSizes.small} strokeWidth={2} />
        </Animated.View>
      </Pressable>
      <Animated.View
        accessibilityElementsHidden={!expanded}
        importantForAccessibility={expanded ? 'auto' : 'no-hide-descendants'}
        pointerEvents={expanded ? 'auto' : 'none'}
        style={contentAnimatedStyle}
      >
        <View style={s.drawerBody} onLayout={onContentLayout}>
          <Text style={[s.drawerLead, { color: colors.text.secondary }]}>{item.lead}</Text>
          {item.evidence ? (
            <Text style={[s.drawerTakeaway, { color: colors.text.primary }]}>
              {item.evidence}
            </Text>
          ) : null}
          {citation ? (
            <Text style={[s.drawerCitation, { color: colors.text.tertiary }]}>
              {citation}
            </Text>
          ) : null}
        </View>
      </Animated.View>
    </>
  );
}
