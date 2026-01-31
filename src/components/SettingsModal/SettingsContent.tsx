import { Activity, BookOpen, Check, Circle } from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';
import { SettingsRow } from './SettingsRow';
import { SettingsSection } from './SettingsSection';
import { AccountSection } from './AccountSection';
import type { SettingsContentProps } from './types';

export function SettingsContent({
  colors,
  isHighContrastActive,
  showWeekCompletionBar,
  habitCompletionIcon,
  dayShape,
  onChangeShowWeekCompletionBar,
  onChangeHabitCompletionIcon,
  onChangeDayShape,
  onOpenArchivedHabits,
}: SettingsContentProps) {
  return (
    <ScrollView
      className='flex-1 px-4'
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: colors.background }}
    >
      <View className='gap-6 pb-8'>
        {/* Visual Preferences */}
        <SettingsSection
          highContrastMode={isHighContrastActive}
          title='Visual Preferences'
        >
          <SettingsRow
            highContrastMode={isHighContrastActive}
            icon={<Activity color='#16a34a' size={16} />}
            iconBackgroundColor='#bbf7d0'
            label='Daily progress bar'
            type='toggle'
            value={showWeekCompletionBar}
            onToggle={(value) => void onChangeShowWeekCompletionBar(value)}
          />
          <SettingsRow
            highContrastMode={isHighContrastActive}
            icon={<Check color='#0284c7' size={16} />}
            iconBackgroundColor='#bae6fd'
            label='Use checkbox completion icon'
            type='toggle'
            value={habitCompletionIcon === 'checkbox'}
            onToggle={(value) =>
              void onChangeHabitCompletionIcon(value ? 'checkbox' : 'chain')
            }
          />
          <SettingsRow
            highContrastMode={isHighContrastActive}
            icon={<Circle color='#8b5cf6' size={16} />}
            iconBackgroundColor='#ddd6fe'
            label='Use circles for habit days'
            showBorder={false}
            type='toggle'
            value={dayShape === 'circle'}
            onToggle={(value) =>
              void onChangeDayShape(value ? 'circle' : 'square')
            }
          />
        </SettingsSection>

        {/* Habit Management */}
        <SettingsSection
          highContrastMode={isHighContrastActive}
          title='Habit Management'
        >
          <SettingsRow
            highContrastMode={isHighContrastActive}
            icon={<BookOpen color='#78716c' size={16} />}
            iconBackgroundColor='#e7e5e4'
            label='Archived Habits'
            showBorder={false}
            type='navigation'
            onPress={onOpenArchivedHabits}
          />
        </SettingsSection>

        {/* Account, App, and Legal sections */}
        <AccountSection
          colors={colors}
          isHighContrastActive={isHighContrastActive}
        />
      </View>

      {/* Footer */}
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
