/* eslint-disable max-lines, max-lines-per-function */
/** SettingsContent - Stagger animations, stone-100 bg, 12px version */
import { useCallback } from 'react';
import {
  Moon,
  BookOpen,
  Check,
  Circle,
  Droplets,
  Monitor,
  Sun,
  Volume2,
  Lock,
} from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SettingsRow } from './SettingsRow';
import { SettingsSection } from './SettingsSection';
import { StreakRemindersSection } from './StreakRemindersSection';
import { AccountSection } from './AccountSection';
import { AboutSection } from './sections';
import { useThemeColors } from '../../theme/ThemeContext';
import type { SettingsContentProps } from './types';

const anim = (delay: number) => FadeInDown.delay(delay).springify().damping(18);

const DARK_MODE_OPTIONS: Array<{
  key: 'system' | 'light' | 'dark';
  label: string;
  Icon: typeof Monitor;
}> = [
  { Icon: Monitor, key: 'system', label: 'System' },
  { Icon: Sun, key: 'light', label: 'Light' },
  { Icon: Moon, key: 'dark', label: 'Dark' },
];

const COMPLETION_SOUND_OPTIONS: Array<{
  key: 'chime' | 'pop' | 'success';
  label: string;
}> = [
  { key: 'chime', label: 'Chime' },
  { key: 'pop', label: 'Pop' },
  { key: 'success', label: 'Success' },
];

/**
 * PERF: Optimized settings content with memoized handlers
 */
export function SettingsContent(p: SettingsContentProps) {
  const { colors, isHighContrastActive: hc } = p;
  const { colors: themeColors, isDark } = useThemeColors();

  // If not premium, show upsell for completion sounds
  const showSoundUpsell = !p.isPremium;

  // PERF: Memoize handler factories for dark mode options
  const createDarkModeHandler = useCallback(
    (key: 'system' | 'light' | 'dark') => () => {
      void p.onChangeDarkModePreference(key);
    },
    [p]
  );

  // PERF: Memoize handler factory for completion sound options
  const createSoundTypeHandler = useCallback(
    (key: 'chime' | 'pop' | 'success') => () => {
      void p.onChangeCompletionSoundType(key);
    },
    [p]
  );

  return (
    <ScrollView
      className='flex-1 px-4'
      showsVerticalScrollIndicator={false}
      style={{
        backgroundColor: hc ? colors.background : themeColors.background,
      }}
    >
      <View className='gap-5 pb-8'>
        {/* Account Section - First for easy access */}
        <Animated.View entering={anim(0)}>
          <AccountSection
            isHighContrastActive={hc}
            isPremium={p.isPremium}
            onPremiumUpsell={p.onPremiumUpsell}
          />
        </Animated.View>

        {/* Preferences Section - Visual settings */}
        <Animated.View entering={anim(60)}>
          <SettingsSection highContrastMode={hc} title='Preferences'>
            <View className='px-4 pb-4 pt-4'>
              <Text
                className='mb-2 text-[13px] font-semibold'
                style={{ color: themeColors.text.secondary }}
              >
                Appearance
              </Text>
              <View
                className='flex-row rounded-xl p-1'
                style={{
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.border,
                  borderWidth: 1,
                }}
              >
                {DARK_MODE_OPTIONS.map(({ key, label, Icon }) => {
                  const selected = p.darkModePreference === key;
                  return (
                    <Pressable
                      key={key}
                      accessibilityHint={`Set appearance to ${label} mode`}
                      accessibilityLabel={`${label} appearance`}
                      accessibilityRole='radio'
                      accessibilityState={{ selected }}
                      className='flex-1 flex-row items-center justify-center gap-1.5 rounded-lg px-2 py-2'
                      style={{
                        backgroundColor: selected
                          ? themeColors.card
                          : 'transparent',
                      }}
                      onPress={createDarkModeHandler(key)}
                    >
                      <Icon
                        color={
                          selected
                            ? themeColors.text.primary
                            : themeColors.text.secondary
                        }
                        size={14}
                      />
                      <Text
                        className='text-[13px] font-semibold'
                        style={{
                          color: selected
                            ? themeColors.text.primary
                            : themeColors.text.secondary,
                        }}
                      >
                        {label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
            <SettingsRow
              highContrastMode={hc}
              icon={<Check color='#0284c7' size={16} />}
              iconBackgroundColor='#bae6fd'
              label='Checkbox style for completed habits'
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
              label='Circular day markers'
              type='toggle'
              value={p.dayShape === 'circle'}
              onToggle={(v) => void p.onChangeDayShape(v ? 'circle' : 'square')}
            />
            <SettingsRow
              highContrastMode={hc}
              icon={<Droplets color='#059669' size={16} />}
              iconBackgroundColor='#d1fae5'
              label='Gradient fill for habit strength'
              showBorder={false}
              type='toggle'
              value={p.showGradientFill}
              onToggle={(v) => void p.onChangeShowGradientFill(v)}
            />
          </SettingsSection>
        </Animated.View>

        {/* Sounds Section - Premium feature */}
        <Animated.View entering={anim(120)}>
          <SettingsSection
            highContrastMode={hc}
            subtitle='Premium'
            title='Sounds'
          >
            {showSoundUpsell ? (
              <SettingsRow
                highContrastMode={hc}
                icon={<Lock color='#f59e0b' size={16} />}
                iconBackgroundColor='#fef3c7'
                label='Unlock satisfying sounds when completing habits'
                showBorder={false}
                type='navigation'
                onPress={p.onPremiumUpsell}
              />
            ) : (
              <>
                <SettingsRow
                  highContrastMode={hc}
                  icon={<Volume2 color='#f59e0b' size={16} />}
                  iconBackgroundColor='#fef3c7'
                  label='Play sound on habit completion'
                  type='toggle'
                  value={p.completionSoundEnabled}
                  onToggle={(v) => void p.onChangeCompletionSoundEnabled(v)}
                />
                {p.completionSoundEnabled && (
                  <View className='px-4 pb-4'>
                    <Text
                      className='mb-2 text-[13px] font-semibold'
                      style={{ color: themeColors.text.secondary }}
                    >
                      Sound
                    </Text>
                    <View
                      className='flex-row rounded-xl p-1'
                      style={{
                        backgroundColor: themeColors.surface,
                        borderColor: themeColors.border,
                        borderWidth: 1,
                      }}
                    >
                      {COMPLETION_SOUND_OPTIONS.map(({ key, label }) => {
                        const selected = p.completionSoundType === key;
                        return (
                          <Pressable
                            key={key}
                            className='flex-1 flex-row items-center justify-center gap-1.5 rounded-lg px-2 py-2'
                            style={{
                              backgroundColor: selected
                                ? isDark
                                  ? '#374151'
                                  : '#e5e7eb'
                                : 'transparent',
                            }}
                            onPress={createSoundTypeHandler(key)}
                          >
                            <Text
                              className='text-[13px] font-semibold'
                              style={{
                                color: selected
                                  ? themeColors.text.primary
                                  : themeColors.text.secondary,
                              }}
                            >
                              {label}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                )}
              </>
            )}
          </SettingsSection>
        </Animated.View>

        {/* Notifications Section */}
        <Animated.View entering={anim(180)}>
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
        <Animated.View entering={anim(240)}>
          <SettingsSection highContrastMode={hc} title='Data'>
            <SettingsRow
              badge={p.archivedHabitsCount}
              highContrastMode={hc}
              icon={<BookOpen color='#78716c' size={16} />}
              iconBackgroundColor='#e7e5e4'
              label='Archived Habits'
              showBorder={false}
              type='navigation'
              onPress={p.onOpenArchivedHabits}
            />
          </SettingsSection>
        </Animated.View>

        {/* About Section - Version info */}
        <Animated.View entering={anim(300)}>
          <AboutSection
            buildNumber='1'
            highContrast={hc}
            version='1.0.0'
          />
        </Animated.View>
      </View>
      <View className='pb-8' />
    </ScrollView>
  );
}
