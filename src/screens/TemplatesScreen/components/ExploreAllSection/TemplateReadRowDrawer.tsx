/** Meta pill + expandable "Why this works" science drawer for TemplateReadRow. */

import { Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import type { AnimatedStyle } from 'react-native-reanimated';
import { ChevronDown, FlaskConical } from 'lucide-react-native';
import type { LayoutChangeEvent, ViewStyle } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { iconSizes } from '@/theme/iconSizes';
import { getTemplateMetaLabel } from '../HabitTemplateCard/templateMeta';
import { TemplateReadRowScience } from './TemplateReadRowScience';
import { s } from './TemplateReadRow.styles';

interface TemplateReadRowDrawerProps {
  chevronAnimatedStyle: AnimatedStyle<ViewStyle>;
  contentAnimatedStyle: AnimatedStyle<ViewStyle>;
  expanded: boolean;
  item: Doc<'templates'>;
  onContentLayout: (event: LayoutChangeEvent) => void;
  onPreview: (template: Doc<'templates'>) => void;
  onToggle: () => void;
}

export function TemplateReadRowDrawer({
  chevronAnimatedStyle,
  contentAnimatedStyle,
  expanded,
  item,
  onContentLayout,
  onPreview,
  onToggle,
}: TemplateReadRowDrawerProps) {
  const { colors } = useThemeColors();
  const metaLabel = getTemplateMetaLabel(item);
  const accent = colors.primary[600];

  return (
    <>
      <View style={[s.footer, { borderTopColor: colors.border }]}>
        {metaLabel ? (
          <View style={[s.metaPill, { backgroundColor: colors.border }]}>
            <Text style={[s.metaPillText, { color: colors.text.tertiary }]}>
              {metaLabel}
            </Text>
          </View>
        ) : (
          <View />
        )}
        <Pressable
          accessibilityLabel={
            expanded ? 'Hide why this works' : 'Show why this works'
          }
          accessibilityRole='button'
          style={s.toggle}
          onPress={onToggle}
        >
          <FlaskConical color={accent} size={iconSizes.small} strokeWidth={2} />
          <Text numberOfLines={1} style={[s.toggleLabel, { color: accent }]}>
            Why this works
          </Text>
          <Animated.View style={chevronAnimatedStyle}>
            <ChevronDown
              color={accent}
              size={iconSizes.small}
              strokeWidth={2}
            />
          </Animated.View>
        </Pressable>
      </View>
      <Animated.View
        accessibilityElementsHidden={!expanded}
        importantForAccessibility={expanded ? 'auto' : 'no-hide-descendants'}
        pointerEvents={expanded ? 'auto' : 'none'}
        style={contentAnimatedStyle}
      >
        {expanded ? (
          <TemplateReadRowScience
            item={item}
            onLayout={onContentLayout}
            onPreview={onPreview}
          />
        ) : null}
      </Animated.View>
    </>
  );
}
