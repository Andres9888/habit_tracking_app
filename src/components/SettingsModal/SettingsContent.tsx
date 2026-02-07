/** SettingsContent - Stagger animations, stone-100 bg, 12px version */
import { Activity, BookOpen, Check, Circle } from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SettingsRow } from './SettingsRow';
import { SettingsSection } from './SettingsSection';
import { AccountSection } from './AccountSection';
import type { SettingsContentProps } from './types';

const anim = (delay: number) => FadeInDown.delay(delay).springify().damping(18);

export function SettingsContent(p: SettingsContentProps) {
  const { colors, isHighContrastActive: hc } = p;
  return (
    <ScrollView
      className='flex-1 px-4'
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: hc ? colors.background : '#f5f5f4' }}
    >
      <View className='gap-5 pb-8'>
        <Animated.View entering={anim(0)}>
          <SettingsSection highContrastMode={hc} title='Visual Preferences'>
            <SettingsRow
              highContrastMode={hc}
              icon={<Activity color='#16a34a' size={16} />}
              iconBackgroundColor='#bbf7d0'
              label='Daily progress bar'
              type='toggle'
              value={p.showWeekCompletionBar}
              onToggle={(v) => void p.onChangeShowWeekCompletionBar(v)}
            />
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
              showBorder={false}
              type='toggle'
              value={p.dayShape === 'circle'}
              onToggle={(v) => void p.onChangeDayShape(v ? 'circle' : 'square')}
            />
          </SettingsSection>
        </Animated.View>
        <Animated.View entering={anim(50)}>
          <SettingsSection highContrastMode={hc} title='Habit Management'>
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
        <Animated.View entering={anim(100)}>
          <AccountSection colors={colors} isHighContrastActive={hc} />
        </Animated.View>
      </View>
      <View className='items-center pb-8 pt-4'>
        <Text
          className='text-center text-[12px] leading-[16px]'
          style={{ color: colors.versionText }}
        >
          Chain Day v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}
