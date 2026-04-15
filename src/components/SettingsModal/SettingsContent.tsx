/* eslint-disable max-lines, max-lines-per-function */
/** SettingsContent - Apple Settings layout: Profile → Appearance → Behavior → Data → Notifications → Support → About → Sign Out */
import {
  ArrowUpDown,
  BookOpen,
  Check,
  Calendar,
  Circle,
  Droplets,
  Rows3,
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
import { SoundPicker } from './SoundPicker';
import { StreakRemindersSection } from './StreakRemindersSection';
import { useAccountActions } from './useAccountActions';
import { AppActions, AboutLegalSection, AccountSection, DeleteAccountButton } from './sections';
import { FeedbackModal } from '../FeedbackModal';
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
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });
  const borderStyle = useAnimatedStyle(() => ({
    opacity: scrollY.value > 4 ? 1 : 0,
  }));

  const actions = useAccountActions();

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
          {/* Appearance Section */}
          <Animated.View entering={anim(0)}>
            <SettingsSection highContrastMode={hc} title='Appearance'>
              <SettingsRow
                highContrastMode={hc}
                icon={<Rows3 color={settingsIcons.compact.icon} size={16} />}
                iconBackgroundColor={settingsIcons.compact.bg}
                label='Compact habit cards'
                subtitle='Show smaller cards to fit more on screen'
                type='toggle'
                value={p.compactView}
                onToggle={(v) => void p.onChangeCompactView(v)}
              />
              <SettingsRow
                highContrastMode={hc}
                icon={<Circle color={settingsIcons.circle.icon} size={16} />}
                iconBackgroundColor={settingsIcons.circle.bg}
                label='Circular day markers'
                subtitle='Use circles instead of squares on the calendar'
                type='toggle'
                value={p.dayShape === 'circle'}
                onToggle={(v) =>
                  void p.onChangeDayShape(v ? 'circle' : 'square')
                }
              />
              <SettingsRow
                highContrastMode={hc}
                icon={
                  <Droplets color={settingsIcons.gradient.icon} size={16} />
                }
                iconBackgroundColor={settingsIcons.gradient.bg}
                label='Gradient streak fill'
                subtitle='Add a color gradient to active streak cells'
                type='toggle'
                value={p.showGradientFill}
                onToggle={(v) => void p.onChangeShowGradientFill(v)}
              />
              <SettingsRow
                hapticStyle='selection'
                highContrastMode={hc}
                icon={<Check color={settingsIcons.checkbox.icon} size={16} />}
                iconBackgroundColor={settingsIcons.checkbox.bg}
                label='Completion icon'
                subtitle='Choose between checkmark and chain link'
                showBorder={false}
                type='toggle'
                value={p.habitCompletionIcon === 'checkbox'}
                onToggle={(v) =>
                  void p.onChangeHabitCompletionIcon(v ? 'checkbox' : 'chain')
                }
              />
            </SettingsSection>
          </Animated.View>

          {/* Behavior Section */}
          <Animated.View entering={anim(40)}>
            <SettingsSection highContrastMode={hc} title='Behavior'>
              <SettingsRow
                hapticStyle='selection'
                highContrastMode={hc}
                icon={<ArrowUpDown color={settingsIcons.sort.icon} size={16} />}
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
                icon={<Volume2 color={settingsIcons.sound.icon} size={16} />}
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
                    size={16}
                  />
                }
                iconBackgroundColor={settingsIcons.calendarHeader.bg}
                label='Pin calendar header'
                showBorder={false}
                type='toggle'
                value={p.stickyCalendarHeader}
                onToggle={(v) => void p.onChangeStickyCalendarHeader(v)}
              />
            </SettingsSection>
          </Animated.View>

          {/* Data Section */}
          <Animated.View entering={anim(80)}>
            <SettingsSection highContrastMode={hc} title='Data'>
              <SettingsRow
                badge={p.archivedHabitsCount}
                highContrastMode={hc}
                icon={<BookOpen color={settingsIcons.archive.icon} size={16} />}
                iconBackgroundColor={settingsIcons.archive.bg}
                label='Archived Habits'
                subtitle='View and restore hidden habits'
                type='navigation'
                onPress={p.onOpenArchivedHabits}
              />
              <SettingsRow
                badge={p.formedHabitsCount}
                highContrastMode={hc}
                icon={<BookOpen color='#7c3aed' size={16} />}
                iconBackgroundColor='#EDE9FE'
                label='Formed Habits'
                subtitle='Habits you successfully built'
                showBorder={false}
                type='navigation'
                onPress={p.onOpenFormedHabits}
              />
            </SettingsSection>
          </Animated.View>

          {/* Notifications Section */}
          <Animated.View entering={anim(120)}>
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

          {/* Support Section */}
          <Animated.View entering={anim(160)}>
            <AppActions
              highContrast={hc}
              onFeedback={actions.handleFeedback}
              onRate={actions.handleRateApp}
              onShare={actions.handleShare}
              onWhatsNew={actions.handleWhatsNew}
            />
          </Animated.View>

          {/* About + Legal */}
          <Animated.View entering={anim(200)}>
            <AboutLegalSection
              buildNumber='1'
              highContrast={hc}
              version='1.0.0'
              onPrivacy={actions.openPrivacy}
              onTerms={actions.openTerms}
            />
          </Animated.View>

          {/* Account — Profile + Sign Out */}
          <Animated.View entering={anim(240)}>
            <AccountSection
              highContrastMode={hc}
              isSigningOut={actions.isSigningOut}
              onSignOut={actions.handleSignOut}
            />
          </Animated.View>

          {/* Delete Account — standalone danger link */}
          <Animated.View entering={anim(280)}>
            <DeleteAccountButton
              isDeletingAccount={actions.isDeletingAccount}
              onDeleteAccount={actions.handleDeleteAccount}
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
