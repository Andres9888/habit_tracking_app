/**
 * CategoryHero - Full-bleed category header for CategoryDrillView.
 * Replaces the plain ScreenHeader with a colored banner that uses
 * the category's own bgColor, icon, label, and subtitle.
 */

import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../../theme/ThemeContext';
import { spacing } from '../../../theme/spacing';
import type { CategoryMeta } from '../data/categoryMeta.types';
import { styles as s } from './CategoryHero.styles';

interface CategoryHeroProps {
  habitCount: number;
  meta: CategoryMeta;
  onBack: () => void;
}

export function CategoryHero({ habitCount, meta, onBack }: CategoryHeroProps) {
  const { colors } = useThemeColors();
  const insets = useSafeAreaInsets();
  const countLabel = `${habitCount} ${habitCount === 1 ? 'habit' : 'habits'}`;

  return (
    <View
      style={[
        s.hero,
        {
          backgroundColor: meta.bgColor,
          borderBottomColor: meta.borderColor,
          paddingTop: insets.top + spacing.sm,
        },
      ]}
    >
      <Pressable
        accessibilityLabel='Go back'
        accessibilityRole='button'
        hitSlop={8}
        style={s.backBtn}
        onPress={onBack}
      >
        <ChevronLeft
          color={meta.textColor}
          size={iconSizes.medium}
          strokeWidth={2.5}
        />
        <Text style={[s.backLabel, { color: meta.textColor }]}>Library</Text>
      </Pressable>

      <View style={s.content}>
        <View style={[s.iconWrap, { backgroundColor: meta.borderColor }]}>
          <Text style={s.iconText}>{meta.icon}</Text>
        </View>
        <View style={s.textBlock}>
          <Text style={[s.title, { color: meta.textColor }]}>{meta.label}</Text>
          {meta.subtitle ? (
            <Text
              style={[s.subtitle, { color: colors.text.tertiary }]}
              numberOfLines={3}
            >
              {meta.subtitle}
            </Text>
          ) : null}
          <View style={s.badgeRow}>
            <View
              style={[
                s.countBadge,
                {
                  backgroundColor: meta.bgColor,
                  borderColor: meta.borderColor,
                },
              ]}
            >
              <Text style={[s.countText, { color: meta.textColor }]}>
                {countLabel}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
