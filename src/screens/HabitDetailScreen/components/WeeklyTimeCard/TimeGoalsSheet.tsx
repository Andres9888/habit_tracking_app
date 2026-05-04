import { KeyboardAvoidingView, Modal, Platform, Pressable, Text, View } from 'react-native';
import type { Id } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { typography, fontWeights } from '../../../../theme/typography';
import { DAILY_CHIPS, WEEKLY_CHIPS, useTimeGoals } from './TimeGoalsSheet.hooks';
import { TimeGoalsSheetSection } from './TimeGoalsSheetSection';

interface TimeGoalsSheetProps {
  habitId: Id<'habits'>;
  visible: boolean;
  initialDailyMinutes: number;
  initialWeeklyMinutes: number;
  onClose: () => void;
}

export function TimeGoalsSheet(props: TimeGoalsSheetProps) {
  const { visible, onClose, initialDailyMinutes, initialWeeklyMinutes } = props;
  const { colors } = useThemeColors();
  const {
    dailyValue,
    pickDaily,
    pickWeekly,
    save,
    saving,
    setDailyValue,
    setWeeklyHourValue,
    weeklyHourValue,
  } = useTimeGoals(props);
  const hasAnyGoal = initialDailyMinutes > 0 || initialWeeklyMinutes > 0;

  return (
    <Modal
      animationType='slide'
      presentationStyle='overFullScreen'
      statusBarTranslucent
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable
        className='flex-1 justify-end'
        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        onPress={onClose}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Pressable
            className='rounded-t-3xl px-5 pb-10 pt-3'
            style={{ backgroundColor: colors.card }}
            onPress={(e) => e.stopPropagation()}
          >
          <View className='mx-auto mb-4 h-1 w-10 rounded-full' style={{ backgroundColor: colors.border }} />
          <Text className='text-center' style={{ ...typography.heading3, color: colors.text.primary }}>
            Time goals
          </Text>
          <Text className='mb-4 mt-1 text-center' style={{ ...typography.caption, color: colors.text.secondary }}>
            Either, neither, or both
          </Text>
          <TimeGoalsSheetSection
            chips={DAILY_CHIPS}
            label='Daily target'
            unit='min/day'
            value={dailyValue}
            onChangeValue={setDailyValue}
            onPickChip={pickDaily}
          />
          <TimeGoalsSheetSection
            chips={WEEKLY_CHIPS}
            label='Weekly target'
            unit='hours/week'
            value={weeklyHourValue}
            onChangeValue={setWeeklyHourValue}
            onPickChip={pickWeekly}
          />
          <Pressable
            accessibilityRole='button'
            className='mb-2 items-center rounded-xl px-6 py-3.5'
            disabled={saving}
            style={{ backgroundColor: colors.primary[600], opacity: saving ? 0.6 : 1 }}
            onPress={() => void save(false)}
          >
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: fontWeights.semibold }}>
              {saving ? 'Saving…' : 'Save goals'}
            </Text>
          </Pressable>
          {hasAnyGoal ? (
            <Pressable
              accessibilityRole='button'
              className='items-center rounded-xl px-6 py-3'
              disabled={saving}
              onPress={() => void save(true)}
            >
              <Text style={{ ...typography.bodySmall, color: colors.status.error, fontWeight: fontWeights.semibold }}>
                Clear all
              </Text>
            </Pressable>
          ) : null}
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
