/**
 * GoalHero - Full-bleed goal header for GoalDrillView.
 * Mirrors CategoryHero but surfaces goal.promise (which CategoryHero's
 * subtitle slot can't carry for multi-category goals).
 */

import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../../theme/ThemeContext';
import { spacing } from '../../../theme/spacing';
import type { GoalCollection } from '../data/goalCollections';
import { styles as s } from './GoalHero.styles';

const PATH_MECHANICS_NOTE =
  'How paths work: start with one habit. Add the next once it sticks.';

interface GoalHeroProps {
  goal: GoalCollection;
  habitCount: number;
  onBack: () => void;
  showPathNote?: boolean;
}

export function GoalHero({
  goal,
  habitCount,
  onBack,
  showPathNote = false,
}: GoalHeroProps) {
  const { colors } = useThemeColors();
  const insets = useSafeAreaInsets();
  const countLabel = `📋 ${habitCount} ${habitCount === 1 ? 'habit' : 'habits'}`;

  return (
    <View
      style={[
        s.hero,
        {
          backgroundColor: goal.bgColor,
          borderBottomColor: colors.border,
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
          color={goal.textColor}
          size={iconSizes.medium}
          strokeWidth={2.5}
        />
        <Text style={[s.backLabel, { color: goal.textColor }]}>Library</Text>
      </Pressable>

      <View style={s.content}>
        <View style={[s.iconWrap, { backgroundColor: 'rgba(0,0,0,0.06)' }]}>
          <Text style={s.iconText}>{goal.emoji}</Text>
        </View>
        <View style={s.textBlock}>
          <Text style={[s.title, { color: goal.textColor }]}>{goal.label}</Text>
          <Text
            style={[s.subtitle, { color: colors.text.tertiary }]}
            numberOfLines={3}
          >
            {goal.promise}
          </Text>
          <View style={s.badgeRow}>
            <View
              style={[
                s.countBadge,
                {
                  backgroundColor: goal.bgColor,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[s.countText, { color: goal.textColor }]}>
                {countLabel}
              </Text>
            </View>
          </View>
        </View>
      </View>
      {showPathNote ? (
        <View style={s.pathNote}>
          <Text style={[s.pathNoteText, { color: goal.textColor }]}>
            {PATH_MECHANICS_NOTE}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
