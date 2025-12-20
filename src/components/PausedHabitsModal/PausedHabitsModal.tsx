/**
 * PausedHabitsModal Component
 * Shows list of paused habits with ability to resume them
 * Similar structure to ArchivedHabitsModal
 */

import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePausedHabitsModalLogic } from './PausedHabitsModal.hooks';

interface PausedHabitsModalProps {
  onClose: () => void;
  onBack: () => void;
}

export default function PausedHabitsModal({
  onClose,
  onBack,
}: PausedHabitsModalProps) {
  const insets = useSafeAreaInsets();
  const { pausedHabits, handleResume } = usePausedHabitsModalLogic();

  return (
    <>
      {/* Header - dynamic padding for Dynamic Island/notch */}
      <View style={{ paddingTop: insets.top + 8 }}>
        <View className='mb-6 flex-row items-center justify-between'>
        <TouchableOpacity
          accessibilityLabel='Back to settings'
          accessibilityRole='button'
          className='h-8 w-8 items-center justify-center rounded-full bg-slate-100'
          onPress={onBack}
        >
          <Text className='text-xl font-semibold text-slate-500'>←</Text>
        </TouchableOpacity>
        <Text className='flex-1 text-center text-2xl font-bold text-slate-900'>
          Paused Habits
        </Text>
        <TouchableOpacity
          accessibilityLabel='Close'
          accessibilityRole='button'
          className='h-8 w-8 items-center justify-center rounded-full bg-slate-100'
          onPress={onClose}
        >
          <Text className='text-lg font-semibold text-slate-500'>✕</Text>
        </TouchableOpacity>
        </View>
      </View>

      <ScrollView className='p-5'>
        {pausedHabits.length === 0 ? (
          <View className='items-center gap-3 py-12'>
            <Text className='text-5xl'>⏸️</Text>
            <Text className='text-lg font-semibold text-slate-900'>
              No paused habits
            </Text>
            <Text className='text-sm text-slate-500'>
              Paused habits will appear here
            </Text>
          </View>
        ) : (
          <View className='gap-3'>
            {pausedHabits.map((habit) => (
              <View
                key={habit._id}
                className='gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4'
              >
                <View className='gap-1'>
                  <Text className='text-base font-semibold text-slate-900'>
                    {habit.name}
                  </Text>
                  <Text className='text-xs text-slate-500'>
                    Paused{' '}
                    {new Date(
                      habit.pausedAt || habit._creationTime
                    ).toLocaleDateString()}
                  </Text>
                  {habit.strengthAtPause !== undefined && (
                    <Text className='text-xs text-slate-600'>
                      Strength preserved:{' '}
                      {Math.round(habit.strengthAtPause * 100)}%
                    </Text>
                  )}
                </View>
                <View className='flex-row gap-2'>
                  <TouchableOpacity
                    accessibilityLabel={`Resume ${habit.name}`}
                    accessibilityRole='button'
                    className='flex-1 items-center rounded-xl border border-blue-500 py-3'
                    onPress={() => handleResume(habit._id, habit.name)}
                  >
                    <Text className='text-xs font-bold tracking-[2px] text-blue-500'>
                      RESUME
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </>
  );
}
