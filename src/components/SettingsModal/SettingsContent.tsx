/* eslint-disable max-lines, max-lines-per-function */
/** SettingsContent - Settings layout: Account → Appearance → Behavior → Notifications → Support → About */
import {
  ArrowUpDown,
  BookOpen,
  Calendar,
  Check,
  Circle,
  Droplets,
  Dumbbell,
  Link2,
  Rows3,
  Square,
  Volume2,
} from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import Constants from 'expo-constants';
import { StyleSheet, View } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { CompletionIconPicker } from './CompletionIconPicker';
import { DayShapePicker } from './DayShapePicker';
import { StrengthAlgorithmPicker } from './StrengthAlgorithmPicker';
import type { StrengthAlgorithmMode } from './StrengthAlgorithmPicker';
import { AlgorithmLegend } from '../AlgorithmPicker';
import { AccountRow } from './AccountRow';
import { SettingsRow } from './SettingsRow';
import { SettingsSection } from './SettingsSection';
import { SoundPicker } from './SoundPicker';
import { StreakRemindersSection } from './StreakRemindersSection';
import { useAccountActions } from './useAccountActions';
import { AppActions, AboutLegalSection } from './sections';
import { FeedbackModal } from '../FeedbackModal';
import { useThemeColors } from '../../theme/ThemeContext';
import { SORT_LABEL_MAP } from './SortPicker.constants';
import type { HabitSortMode } from '../../features/habits/types';
import type { SettingsContentProps } from './types';
import { useSettingsSectionStates, SECTION_IDS } from './useSettingsSectionStates';

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
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });
  const borderStyle = useAnimatedStyle(() => ({
    opacity: scrollY.value > 4 ? 1 : 0,
  }));

  const actions = useAccountActions();
  const { sectionStates, toggleSection } = useSettingsSectionStates();

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
          <Animated.View entering={anim(0)}>
            <AccountRow highContrastMode={hc} isPremium={p.isPremium} onPress={p.onOpenAccount} />
          </Animated.View>

          {/* Appearance Section */}
          <Animated.View entering={anim(25)}>
            <SettingsSection collapsible highContrastMode={hc} isExpanded={sectionStates.appearance} title='Appearance' onToggle={() => toggleSection(SECTION_IDS.appearance)}>
              <SettingsRow
                highContrastMode={hc}
                icon={<Rows3 color={settingsIcons.compact.icon} size={iconSizes.small} />}
                iconBackgroundColor={settingsIcons.compact.bg}
                label='Compact habit cards'
                subtitle='Show smaller cards to fit more on screen'
                type='toggle'
                value={p.compactView}
                onToggle={(v) => void p.onChangeCompactView(v)}
              />
              <SettingsRow
                highContrastMode={hc}
                icon={
                  p.dayShape === 'circle' ? (
                    <Circle color={settingsIcons.circle.icon} size={iconSizes.small} />
                  ) : (
                    <Square color={settingsIcons.circle.icon} size={iconSizes.small} />
                  )
                }
                iconBackgroundColor={settingsIcons.circle.bg}
                label='Day marker shape'
                rightAccessory={
                  <DayShapePicker
                    selected={p.dayShape}
                    onSelect={(v) => void p.onChangeDayShape(v)}
                  />
                }
                type='info'
              />
              <SettingsRow
                highContrastMode={hc}
                icon={
                  <Droplets color={settingsIcons.gradient.icon} size={iconSizes.small} />
                }
                iconBackgroundColor={settingsIcons.gradient.bg}
                label='Gradient streak fill'
                subtitle='Add a color gradient to active streak cells'
                type='toggle'
                value={p.showGradientFill}
                onToggle={(v) => void p.onChangeShowGradientFill(v)}
              />
              <SettingsRow
                highContrastMode={hc}
                icon={
                  p.habitCompletionIcon === 'checkbox' ? (
                    <Check color={settingsIcons.checkbox.icon} size={iconSizes.small} />
                  ) : (
                    <Link2 color={settingsIcons.checkbox.icon} size={iconSizes.small} />
                  )
                }
                iconBackgroundColor={settingsIcons.checkbox.bg}
                label='Completion icon'
                rightAccessory={
                  <CompletionIconPicker
                    selected={p.habitCompletionIcon}
                    onSelect={(v) => void p.onChangeHabitCompletionIcon(v)}
                  />
                }
                type='info'
              />
            </SettingsSection>
          </Animated.View>

          {/* Behavior Section */}
          <Animated.View entering={anim(50)}>
            <SettingsSection collapsible highContrastMode={hc} isExpanded={sectionStates.behavior} title='Behavior' onToggle={() => toggleSection(SECTION_IDS.behavior)}>
              <SettingsRow
                hapticStyle='selection'
                highContrastMode={hc}
                icon={<ArrowUpDown color={settingsIcons.sort.icon} size={iconSizes.small} />}
                iconBackgroundColor={settingsIcons.sort.bg}
                label='Sort Order'
                subtitle='Choose how your habits are ordered'
                type='selection'
                value={
                  SORT_LABEL_MAP[p.habitSortMode as HabitSortMode] ?? 'Custom'
                }
                onPress={p.onOpenSortPicker}
              />
              <SettingsRow
                highContrastMode={hc}
                icon={<Volume2 color={settingsIcons.sound.icon} size={iconSizes.small} />}
                iconBackgroundColor={settingsIcons.sound.bg}
                label='Completion sound'
                subtitle='Hear a sound when you check off a habit'
                showBorder={!p.completionSoundEnabled}
                type='toggle'
                value={p.completionSoundEnabled}
                onToggle={(v) => void p.onChangeCompletionSoundEnabled(v)}
              />
              {p.completionSoundEnabled ? (
                <SoundPicker
                  selected={p.completionSoundType}
                  onSelect={(v) => void p.onChangeCompletionSoundType(v)}
                />
              ) : null}
              <SettingsRow
                highContrastMode={hc}
                icon={
                  <Calendar
                    color={settingsIcons.calendarHeader.icon}
                    size={iconSizes.small}
                  />
                }
                iconBackgroundColor={settingsIcons.calendarHeader.bg}
                label='Pin calendar header'
                subtitle='Keep the month header visible when scrolling'
                type='toggle'
                value={p.stickyCalendarHeader}
                onToggle={(v) => void p.onChangeStickyCalendarHeader(v)}
              />
              <SettingsRow
                highContrastMode={hc}
                icon={
                  <Dumbbell
                    color={settingsIcons.strength.icon}
                    size={iconSizes.small}
                  />
                }
                iconBackgroundColor={settingsIcons.strength.bg}
                label='Strength algorithm'
                subtitle='Match to how complex your habits are'
                rightAccessory={
                  <StrengthAlgorithmPicker
                    selected={
                      (p.strengthAlgorithm as StrengthAlgorithmMode) ??
                      'balanced'
                    }
                    onSelect={(v) => void p.onChangeStrengthAlgorithm(v)}
                  />
                }
                type='info'
              />
              <AlgorithmLegend activeMode={p.strengthAlgorithm} />
            </SettingsSection>
          </Animated.View>

          {/* Habit Management Section */}
          <Animated.View entering={anim(75)}>
            <SettingsSection collapsible highContrastMode={hc} isExpanded={sectionStates.habitManagement} title='Habit Management' onToggle={() => toggleSection(SECTION_IDS.habitManagement)}>
              <SettingsRow
                badge={p.archivedHabitsCount}
                highContrastMode={hc}
                icon={<BookOpen color={settingsIcons.archive.icon} size={iconSizes.small} />}
                iconBackgroundColor={settingsIcons.archive.bg}
                label='Archived Habits'
                showBorder={false}
                subtitle='View and restore hidden habits'
                type='navigation'
                onPress={p.onOpenArchivedHabits}
              />
            </SettingsSection>
          </Animated.View>

          {/* Notifications Section */}
          <Animated.View entering={anim(100)}>
            <StreakRemindersSection
              collapsible
              enabled={p.streakRemindersEnabled}
              highContrastMode={hc}
              isExpanded={sectionStates.notifications}
              isPremium={p.isPremium}
              reminderTime={p.streakReminderTime}
              onChangeTime={p.onChangeStreakReminderTime}
              onPremiumUpsell={p.onPremiumUpsell}
              onToggle={p.onToggleStreakReminders}
              onToggleSection={() => toggleSection(SECTION_IDS.notifications)}
            />
          </Animated.View>

          {/* Support Section */}
          <Animated.View entering={anim(125)}>
            <AppActions
              collapsible
              highContrast={hc}
              isExpanded={sectionStates.support}
              onFeedback={actions.handleFeedback}
              onRate={actions.handleRateApp}
              onShare={actions.handleShare}
              onToggleSection={() => toggleSection(SECTION_IDS.support)}
              onWhatsNew={actions.handleWhatsNew}
            />
          </Animated.View>

          {/* About + Legal */}
          <Animated.View entering={anim(150)}>
            <AboutLegalSection
              buildNumber={Constants.expoConfig?.ios?.buildNumber ?? '1'}
              collapsible
              highContrast={hc}
              isExpanded={sectionStates.about}
              version={Constants.expoConfig?.version ?? '1.0.0'}
              onPrivacy={actions.openPrivacy}
              onTerms={actions.openTerms}
              onToggleSection={() => toggleSection(SECTION_IDS.about)}
            />
          </Animated.View>
        </View>
      </Animated.ScrollView>

      <FeedbackModal
        visible={actions.showFeedbackModal}
        onClose={actions.closeFeedback}
      />
    </View>
  );
}
