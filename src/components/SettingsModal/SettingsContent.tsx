/* eslint-disable max-lines */
/** SettingsContent - Stagger animations, stone-100 bg, 12px version */
import {
  BarChart3,
  Moon,
  BookOpen,
  Check,
  Circle,
  Droplets,
  Monitor,
  Sun,
} from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SettingsRow } from './SettingsRow';
import { SettingsSection } from './SettingsSection';
import { StreakRemindersSection } from './StreakRemindersSection';
import { AccountSection } from './AccountSection';
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

export function SettingsContent(p: SettingsContentProps) {
  const { colors, isHighContrastActive: hc } = p;
  const { colors: themeColors, isDark } = useThemeColors();

  return (
    <ScrollView
      className='flex-1 px-4'
      showsVerticalScrollIndicator={false}
      style={{
        backgroundColor: hc ? colors.background : themeColors.background,
      }}
    >
      <View className='gap-5 pb-8'>
        <Animated.View entering={anim(0)}>
          <SettingsSection highContrastMode={hc} title='Visual Preferences'>
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
                      className='flex-1 flex-row items-center justify-center gap-1.5 rounded-lg px-2 py-2'
                      style={{
                        backgroundColor: selected
                          ? isDark
                            ? '#374151'
                            : '#e5e7eb'
                          : 'transparent',
                      }}
                      onPress={() => void p.onChangeDarkModePreference(key)}
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
              label='Use checkbox completion icon'
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
              label='Use circles for habit days'
              type='toggle'
              value={p.dayShape === 'circle'}
              onToggle={(v) => void p.onChangeDayShape(v ? 'circle' : 'square')}
            />
            <SettingsRow
              highContrastMode={hc}
              icon={<Droplets color='#059669' size={16} />}
              iconBackgroundColor='#d1fae5'
              label='Show strength gradient fill'
              showBorder={false}
              type='toggle'
              value={p.showGradientFill}
              onToggle={(v) => void p.onChangeShowGradientFill(v)}
            />
          </SettingsSection>
        </Animated.View>
        <Animated.View entering={anim(50)}>
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
        <Animated.View entering={anim(100)}>
          <SettingsSection highContrastMode={hc} title='Habit Management'>
            <SettingsRow
              highContrastMode={hc}
              icon={<BarChart3 color='#059669' size={16} />}
              iconBackgroundColor='#d1fae5'
              label='Weekly Summary'
              type='navigation'
              onPress={p.onOpenWeeklySummary}
            />
            <SettingsRow
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
        <Animated.View entering={anim(150)}>
          <AccountSection isHighContrastActive={hc} />
        </Animated.View>
      </View>
      <View className='items-center pb-8 pt-4'>
        <Text
          className='text-center text-[13px] leading-[18px]'
          style={{ color: colors.versionText }}
        >
          Chain Day v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}
