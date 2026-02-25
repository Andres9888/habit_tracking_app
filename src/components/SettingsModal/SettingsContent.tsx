/* eslint-disable max-lines, max-lines-per-function */
/** SettingsContent - Stagger animations, stone-100 bg, 12px version */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowUpDown,
  BookOpen,
  Check,
  Circle,
  ChevronDown,
  Droplets,
  Volume2,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SettingsRow } from './SettingsRow';
import { SettingsSection } from './SettingsSection';
import { StreakRemindersSection } from './StreakRemindersSection';
import { AccountSection } from './AccountSection';
import { AboutSection } from './sections';
import { useThemeColors } from '../../theme/ThemeContext';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { SORT_LABEL_MAP } from './SortPicker.constants';
import type { HabitSortMode } from '../../features/habits/types';
import type { SettingsContentProps } from './types';

const anim = (delay: number) => FadeInDown.delay(delay).springify().damping(18);

const SCROLL_STYLES = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
  },
  scrollFadeTop: {
    height: 32,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  scrollFadeBottom: {
    alignItems: 'center',
    bottom: 0,
    height: 56,
    justifyContent: 'flex-end',
    left: 0,
    paddingBottom: 4,
    position: 'absolute',
    right: 0,
  },
  scrollHintChip: {
    alignItems: 'center',
    borderRadius: 999,
    elevation: 2,
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  scrollHintText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
  },
});

interface ScrollHintState {
  layoutHeight: number;
  contentHeight: number;
}

interface ScrollShadowsState {
  showBottomShadow: boolean;
  showTopShadow: boolean;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  handleContentSizeChange: (_width: number, height: number) => void;
  handleLayout: (event: LayoutChangeEvent) => void;
}

const useScrollShadows = (): ScrollShadowsState => {
  const [showTopShadow, setShowTopShadow] = useState(false);
  const [showBottomShadow, setShowBottomShadow] = useState(false);
  const scrollOffset = useRef(0);
  const scrollMetrics = useRef<ScrollHintState>({
    contentHeight: 0,
    layoutHeight: 0,
  });

  const updateShadows = useCallback(() => {
    const { layoutHeight, contentHeight } = scrollMetrics.current;
    const offsetY = scrollOffset.current;
    const hasScrollableContent = contentHeight > layoutHeight + 1;

    setShowTopShadow(hasScrollableContent && offsetY > 4);
    setShowBottomShadow(
      hasScrollableContent && contentHeight - (offsetY + layoutHeight) > 4
    );
  }, []);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, layoutMeasurement, contentSize } =
        event.nativeEvent;
      scrollOffset.current = contentOffset.y;
      scrollMetrics.current = {
        contentHeight: contentSize.height,
        layoutHeight: layoutMeasurement.height,
      };
      updateShadows();
    },
    [updateShadows]
  );

  const handleContentSizeChange = useCallback(
    (_width: number, height: number) => {
      scrollMetrics.current = {
        ...scrollMetrics.current,
        contentHeight: height,
      };
      updateShadows();
    },
    [updateShadows]
  );

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      scrollMetrics.current = {
        ...scrollMetrics.current,
        layoutHeight: event.nativeEvent.layout.height,
      };
      updateShadows();
    },
    [updateShadows]
  );

  return {
    handleContentSizeChange,
    handleLayout,
    handleScroll,
    showBottomShadow,
    showTopShadow,
  };
};

interface SettingsScrollShadowsProps {
  showBottomShadow: boolean;
  showTopShadow: boolean;
  darkMode: boolean;
  textColor: string;
}

function SettingsScrollShadows({
  showBottomShadow,
  showTopShadow,
  darkMode,
  textColor,
}: SettingsScrollShadowsProps) {
  const reduceMotion = useReduceMotion();
  const chevronOffset = useSharedValue(0);

  const bgOpaque = darkMode ? 'rgba(17,24,39,0.96)' : 'rgba(248,247,245,0.96)';
  const bgTransparent = darkMode ? 'rgba(17,24,39,0)' : 'rgba(248,247,245,0)';
  const chipBg = darkMode ? 'rgba(31,41,55,0.9)' : 'rgba(255,255,255,0.9)';

  useEffect(() => {
    if (!showBottomShadow || reduceMotion) {
      cancelAnimation(chevronOffset);
      chevronOffset.value = 0;
      return;
    }

    chevronOffset.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 650 }),
        withTiming(0, { duration: 650 })
      ),
      -1,
      false
    );
  }, [showBottomShadow, reduceMotion, chevronOffset]);

  const chevronStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: chevronOffset.value }],
    }),
    [chevronOffset]
  );

  return (
    <>
      {showTopShadow && (
        <LinearGradient
          colors={[bgOpaque, bgTransparent]}
          pointerEvents='none'
          style={SCROLL_STYLES.scrollFadeTop}
        />
      )}
      {showBottomShadow && (
        <LinearGradient
          colors={[bgTransparent, bgOpaque]}
          pointerEvents='none'
          style={SCROLL_STYLES.scrollFadeBottom}
        >
          <Animated.View
            style={[
              SCROLL_STYLES.scrollHintChip,
              { backgroundColor: chipBg },
              chevronStyle,
            ]}
          >
            <ChevronDown color={textColor} size={16} strokeWidth={2.25} />
            <Text style={[SCROLL_STYLES.scrollHintText, { color: textColor }]}>
              Scroll for more
            </Text>
          </Animated.View>
        </LinearGradient>
      )}
    </>
  );
}

export function SettingsContent(p: SettingsContentProps) {
  const { colors, isHighContrastActive: hc } = p;
  const { colors: themeColors } = useThemeColors();
  const scrollShadows = useScrollShadows();
  const bottomPadding = Math.max((p.bottomInset ?? 0) + 16, 24);

  const textColor = themeColors.text.secondary;
  const hintTextColor = hc ? colors.textSecondary : textColor;

  return (
    <View style={SCROLL_STYLES.wrapper}>
      <ScrollView
        className='flex-1 px-4'
        contentContainerStyle={{ paddingBottom: bottomPadding, paddingTop: 4 }}
        onContentSizeChange={scrollShadows.handleContentSizeChange}
        onLayout={scrollShadows.handleLayout}
        onScroll={scrollShadows.handleScroll}
        scrollEventThrottle={16}
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
                icon={
                  <Check color={themeColors.settings.checkbox.icon} size={16} />
                }
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
                icon={
                  <Circle color={themeColors.settings.circle.icon} size={16} />
                }
                iconBackgroundColor={themeColors.settings.circle.bg}
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
                    color={themeColors.settings.gradient.icon}
                    size={16}
                  />
                }
                iconBackgroundColor={themeColors.settings.gradient.bg}
                label='Gradient fill for habit strength'
                type='toggle'
                value={p.showGradientFill}
                onToggle={(v) => void p.onChangeShowGradientFill(v)}
              />
              <SettingsRow
                highContrastMode={hc}
                icon={
                  <Volume2 color={themeColors.settings.sound.icon} size={16} />
                }
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
                icon={
                  <ArrowUpDown
                    color={themeColors.settings.sort.icon}
                    size={16}
                  />
                }
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
                icon={
                  <BookOpen
                    color={themeColors.settings.archive.icon}
                    size={16}
                  />
                }
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
      <SettingsScrollShadows
        darkMode={themeColors.background !== '#f8f7f5'}
        showBottomShadow={scrollShadows.showBottomShadow}
        showTopShadow={scrollShadows.showTopShadow}
        textColor={hintTextColor}
      />
    </View>
  );
}
