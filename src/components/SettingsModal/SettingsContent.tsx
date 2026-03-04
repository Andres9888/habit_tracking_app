/* eslint-disable max-lines, max-lines-per-function */
/** SettingsContent - Stagger animations, stone-100 bg, 12px version */
import {
  ArrowUpDown,
  BookOpen,
  Check,
  Calendar,
  Circle,
  Droplets,
  Share2,
  Volume2,
} from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { SettingsRow } from './SettingsRow';
import { SettingsSection } from './SettingsSection';
import { StreakRemindersSection } from './StreakRemindersSection';
import { AccountSection } from './AccountSection';
import { AboutSection } from './sections';
import { useThemeColors } from '../../theme/ThemeContext';
import { SORT_LABEL_MAP } from './SortPicker.constants';
import type { HabitSortMode } from '../../features/habits/types';
import type { SettingsContentProps } from './types';

const anim = (delay: number) => FadeInDown.delay(delay).springify().damping(18);

const SCROLL_STYLES = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
  },
});

export function SettingsContent(p: SettingsContentProps) {
  const { colors, isHighContrastActive: hc } = p;
  const { colors: themeColors, settings: settingsIcons } = useThemeColors();
  const bottomPadding = Math.max((p.bottomInset ?? 0) + 16, 24);
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => { scrollY.value = e.contentOffset.y; },
  });
  const borderStyle = useAnimatedStyle(() => ({
    opacity: scrollY.value > 4 ? 1 : 0,
  }));

  return (
    <View style={SCROLL_STYLES.wrapper}>
      <Animated.View
        style={[
          { height: 1, backgroundColor: themeColors.border },
          borderStyle,
        ]}
      />
      <Animated.ScrollView
        className='flex-1 px-4'
        contentContainerStyle={{ paddingBottom: bottomPadding, paddingTop: 4 }}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: hc ? colors.background : themeColors.background,
        }}
        onScroll={scrollHandler}
      >
        <View className='gap-5'>
          {/* Preferences Section - Visual settings */}
          <Animated.View entering={anim(0)}>
            <SettingsSection highContrastMode={hc} title='Preferences'>
              <SettingsRow
                highContrastMode={hc}
                icon={
                  <Check color={settingsIcons.checkbox.icon} size={16} />
                }
                iconBackgroundColor={settingsIcons.checkbox.bg}
                label='Checkbox style for completed habits'
                type='toggle'
                value={p.habitCompletionIcon === 'checkbox'}
                onToggle={(v) =>
                  void p.onChangeHabitCompletionIcon(v ? 'checkbox' : 'chain')
                }
              />
              <SettingsRow
                highContrastMode={hc}
                icon={
                  <Circle color={settingsIcons.circle.icon} size={16} />
                }
                iconBackgroundColor={settingsIcons.circle.bg}
                label='Circular day markers'
                type='toggle'
                value={p.dayShape === 'circle'}
                onToggle={(v) =>
                  void p.onChangeDayShape(v ? 'circle' : 'square')
                }
              />
              <SettingsRow
                highContrastMode={hc}
                icon={
                  <Droplets
                    color={settingsIcons.gradient.icon}
                    size={16}
                  />
                }
                iconBackgroundColor={settingsIcons.gradient.bg}
                label='Gradient fill for habit strength'
                type='toggle'
                value={p.showGradientFill}
                onToggle={(v) => void p.onChangeShowGradientFill(v)}
              />
              <SettingsRow
                highContrastMode={hc}
                icon={
                  <Calendar
                    color={settingsIcons.calendarHeader.icon}
                    size={16}
                  />
                }
                iconBackgroundColor={settingsIcons.calendarHeader.bg}
                label='Sticky calendar header'
                type='toggle'
                value={p.stickyCalendarHeader}
                onToggle={(v) => void p.onChangeStickyCalendarHeader(v)}
              />
              <SettingsRow
                highContrastMode={hc}
                icon={
                  <Volume2 color={settingsIcons.sound.icon} size={16} />
                }
                iconBackgroundColor={settingsIcons.sound.bg}
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
                hapticStyle='selection'
                highContrastMode={hc}
                icon={
                  <ArrowUpDown
                    color={settingsIcons.sort.icon}
                    size={16}
                  />
                }
                iconBackgroundColor={settingsIcons.sort.bg}
                label='Sort Order'
                type='selection'
                value={
                  SORT_LABEL_MAP[p.habitSortMode as HabitSortMode] ?? 'Custom'
                }
                onPress={p.onOpenSortPicker}
              />
              <SettingsRow
                hapticStyle='selection'
                highContrastMode={hc}
                icon={
                  <Share2
                    color={settingsIcons.share.icon}
                    size={16}
                  />
                }
                iconBackgroundColor={settingsIcons.share.bg}
                label='Export habits & stats'
                type='navigation'
                onPress={() => {
                  void p.onExportHabitsData?.();
                }}
              />
              <SettingsRow
                badge={p.archivedHabitsCount}
                highContrastMode={hc}
                icon={
                  <BookOpen
                    color={settingsIcons.archive.icon}
                    size={16}
                  />
                }
                iconBackgroundColor={settingsIcons.archive.bg}
                label='Archived Habits'
                showBorder={false}
                type='navigation'
                onPress={p.onOpenArchivedHabits}
              />
            </SettingsSection>
          </Animated.View>

          {/* Account Section — sub-sections stagger internally */}
          <AccountSection
            isHighContrastActive={hc}
            isPremium={p.isPremium}
            onPremiumUpsell={p.onPremiumUpsell}
          />

          {/* About Section - Version info */}
          <Animated.View entering={anim(240)}>
            <AboutSection buildNumber='1' highContrast={hc} version='1.0.0' />
          </Animated.View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}
