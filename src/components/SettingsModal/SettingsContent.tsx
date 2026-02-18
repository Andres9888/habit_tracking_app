/* eslint-disable max-lines, max-lines-per-function */
/** SettingsContent - Stagger animations, stone-100 bg, 12px version */
import {
  ArrowUpDown,
  BookOpen,
  Check,
  Circle,
  Droplets,
  Volume2,
} from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SettingsRow } from './SettingsRow';
import { SettingsSection } from './SettingsSection';
import { StreakRemindersSection } from './StreakRemindersSection';
import { AccountSection } from './AccountSection';
import { AboutSection } from './sections';
import { useThemeColors } from '../../theme/ThemeContext';
import { usePrefetchNavigation } from '../../hooks/usePrefetchNavigation';
import { SORT_LABEL_MAP } from './SortPicker.constants';
import type { HabitSortMode } from '../../features/habits/types';
import type { SettingsContentProps } from './types';

const anim = (delay: number) => FadeInDown.delay(delay).springify().damping(18);

export function SettingsContent(p: SettingsContentProps) {
  const { colors, isHighContrastActive: hc } = p;
  const { colors: themeColors } = useThemeColors();
  const bottomPadding = Math.max((p.bottomInset ?? 0) + 16, 24);

  return (
    <ScrollView
      className='flex-1 px-4'
      contentContainerStyle={{ paddingBottom: bottomPadding, paddingTop: 4 }}
      showsVerticalScrollIndicator={false}
      style={{
        backgroundColor: hc ? colors.background : themeColors.background,
      }}
    >
      <View className='gap-5'>
        {/* Preferences Section - Visual settings */}
        <Animated.View entering={anim(0)}>
          <SettingsSection highContrastMode={hc} title='Preferences'>
            <SettingsRow
              highContrastMode={hc}
              icon={<Check color={themeColors.settings.checkbox.icon} size={16} />}
              iconBackgroundColor={themeColors.settings.checkbox.bg}
              label='Checkbox style for completed habits'
              type='toggle'
              value={p.habitCompletionIcon === 'checkbox'}
              onToggle={(v) =>
                void p.onChangeHabitCompletionIcon(v ? 'checkbox' : 'chain')
              }
            />
            <SettingsRow
              highContrastMode={hc}
              icon={<Circle color={themeColors.settings.circle.icon} size={16} />}
              iconBackgroundColor={themeColors.settings.circle.bg}
              label='Circular day markers'
              type='toggle'
              value={p.dayShape === 'circle'}
              onToggle={(v) => void p.onChangeDayShape(v ? 'circle' : 'square')}
            />
            <SettingsRow
              highContrastMode={hc}
              icon={<Droplets color={themeColors.settings.gradient.icon} size={16} />}
              iconBackgroundColor={themeColors.settings.gradient.bg}
              label='Gradient fill for habit strength'
              type='toggle'
              value={p.showGradientFill}
              onToggle={(v) => void p.onChangeShowGradientFill(v)}
            />
            <SettingsRow
              highContrastMode={hc}
              icon={<Volume2 color={themeColors.settings.sound.icon} size={16} />}
              iconBackgroundColor={themeColors.settings.sound.bg}
              label='Play sound on habit completion'
              showBorder={false}
              type='toggle'
              value={p.completionSoundEnabled}
              onToggle={(v) => void p.onChangeCompletionSoundEnabled(v)}
            />
          </SettingsSection>
        </Animated.View>

        {/* Notifications Section */}
        <Animated.View entering={anim(60)}>
          <StreakRemindersSection
            enabled={p.streakRemindersEnabled}
            highContrastMode={hc}
            isPremium={p.isPremium}
            reminderTime={p.streakReminderTime}
            onChangeTime={p.onChangeStreakReminderTime}
            onPremiumUpsell={p.onPremiumUpsell}
            onToggle={p.onToggleStreakReminders}
          />
        </Animated.View>

        {/* Data Section - Habit management */}
        <Animated.View entering={anim(120)}>
          <SettingsSection highContrastMode={hc} title='Data'>
            <SettingsRow
              highContrastMode={hc}
              icon={<ArrowUpDown color={themeColors.settings.sort.icon} size={16} />}
              iconBackgroundColor={themeColors.settings.sort.bg}
              label='Sort Order'
              type='selection'
              value={
                SORT_LABEL_MAP[p.habitSortMode as HabitSortMode] ?? 'Custom'
              }
              onPress={p.onOpenSortPicker}
            />
            <SettingsRow
              badge={p.archivedHabitsCount}
              highContrastMode={hc}
              icon={<BookOpen color={themeColors.settings.archive.icon} size={16} />}
              iconBackgroundColor={themeColors.settings.archive.bg}
              label='Archived Habits'
              showBorder={false}
              type='navigation'
              onPress={p.onOpenArchivedHabits}
            />
          </SettingsSection>
        </Animated.View>

        {/* Account Section */}
        <Animated.View entering={anim(180)}>
          <AccountSection
            isHighContrastActive={hc}
            isPremium={p.isPremium}
            onPremiumUpsell={p.onPremiumUpsell}
          />
        </Animated.View>

        {/* About Section - Version info */}
        <Animated.View entering={anim(240)}>
          <AboutSection buildNumber='1' highContrast={hc} version='1.0.0' />
        </Animated.View>
      </View>
    </ScrollView>
  );
}
