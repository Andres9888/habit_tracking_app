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
import { SORT_LABEL_MAP } from './SortPicker.constants';
import { t } from '../../i18n';
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
          <SettingsSection highContrastMode={hc} title={t('settings.preferences')}>
            <SettingsRow
              highContrastMode={hc}
              icon={<Check color='#0284c7' size={16} />}
              iconBackgroundColor='#bae6fd'
              label={t('settings.checkboxStyleLabel')}
              type='toggle'
              value={p.habitCompletionIcon === 'checkbox'}
              onToggle={(v) =>
                void p.onChangeHabitCompletionIcon(v ? 'checkbox' : 'chain')
              }
            />
            <SettingsRow
              highContrastMode={hc}
              icon={<Circle color='#8b5cf6' size={16} />}
              iconBackgroundColor='#ddd6fe'
              label={t('settings.circularDayMarkersLabel')}
              type='toggle'
              value={p.dayShape === 'circle'}
              onToggle={(v) => void p.onChangeDayShape(v ? 'circle' : 'square')}
            />
            <SettingsRow
              highContrastMode={hc}
              icon={<Droplets color='#059669' size={16} />}
              iconBackgroundColor='#d1fae5'
              label={t('settings.gradientFillLabel')}
              type='toggle'
              value={p.showGradientFill}
              onToggle={(v) => void p.onChangeShowGradientFill(v)}
            />
            <SettingsRow
              highContrastMode={hc}
              icon={<Volume2 color='#f59e0b' size={16} />}
              iconBackgroundColor='#fef3c7'
              label={t('settings.soundOnCompletionLabel')}
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
          <SettingsSection highContrastMode={hc} title={t('settings.data')}>
            <SettingsRow
              highContrastMode={hc}
              icon={<ArrowUpDown color='#6366f1' size={16} />}
              iconBackgroundColor='#e0e7ff'
              label={t('settings.sortOrder')}
              type='selection'
              value={
                SORT_LABEL_MAP[p.habitSortMode as HabitSortMode] ?? 'Custom'
              }
              onPress={p.onOpenSortPicker}
            />
            <SettingsRow
              badge={p.archivedHabitsCount}
              highContrastMode={hc}
              icon={<BookOpen color='#78716c' size={16} />}
              iconBackgroundColor='#e7e5e4'
              label={t('settings.archivedHabits')}
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
