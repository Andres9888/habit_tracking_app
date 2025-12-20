import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useArchivedHabitsModalLogic } from './ArchivedHabitsModal.hooks';

interface ArchivedHabitsModalProps {
  onClose: () => void;
  onBack: () => void;
}

// Get strength level info based on percentage
const getStrengthInfo = (strength: number) => {
  if (strength >= 80) return { emoji: '⚡', label: 'Automatic', bgColor: 'bg-purple-50', textColor: 'text-purple-700' };
  if (strength >= 60) return { emoji: '💪', label: 'Strong', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' };
  if (strength >= 40) return { emoji: '🌳', label: 'Developing', bgColor: 'bg-teal-50', textColor: 'text-teal-700' };
  if (strength >= 20) return { emoji: '🌿', label: 'Building', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700' };
  return { emoji: '🌱', label: 'Starting', bgColor: 'bg-rose-50', textColor: 'text-rose-600' };
};

// Get strength gradient color
const getStrengthGradientColor = (strength: number): string => {
  if (strength >= 80) return '#A855F7'; // purple-500
  if (strength >= 60) return '#10B981'; // emerald-500
  if (strength >= 40) return '#14B8A6'; // teal-500
  if (strength >= 20) return '#EAB308'; // yellow-500
  return '#F43F5E'; // rose-500
};

// Format relative time
const getRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
  const months = Math.floor(diffDays / 30);
  return `${months} month${months > 1 ? 's' : ''} ago`;
};

export default function ArchivedHabitsModal({
  onClose,
  onBack,
}: ArchivedHabitsModalProps) {
  const { archivedHabits, handleRestore, handlePermanentDelete } =
    useArchivedHabitsModalLogic();

  return (
    <>
      {/* Header - extra top padding for Dynamic Island */}
      <View className='mb-4 mt-4 flex-row items-center justify-between'>
        <TouchableOpacity
          accessibilityLabel='Back to settings'
          accessibilityRole='button'
          className='h-10 w-10 items-center justify-center rounded-full bg-slate-100'
          onPress={onBack}
        >
          <Text className='text-xl text-slate-600'>←</Text>
        </TouchableOpacity>
        <Text className='flex-1 text-center text-xl font-bold text-slate-900'>
          Archived Habits
        </Text>
        <TouchableOpacity
          accessibilityLabel='Close'
          accessibilityRole='button'
          className='h-10 w-10 items-center justify-center rounded-full bg-slate-100'
          onPress={onClose}
        >
          <Text className='text-lg text-slate-500'>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Summary Bar */}
      {archivedHabits.length > 0 && (
        <View className='mb-4 flex-row items-center justify-between rounded-xl bg-slate-50 px-4 py-3'>
          <View className='flex-row items-center gap-2'>
            <Text className='text-lg'>📦</Text>
            <Text className='text-sm font-medium text-slate-600'>
              {archivedHabits.length} archived habit{archivedHabits.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      )}

      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        {archivedHabits.length === 0 ? (
          /* Empty State */
          <View className='items-center justify-center px-6 py-16'>
            {/* Illustration */}
            <View className='mb-6 items-center'>
              <View className='relative'>
                <View className='h-28 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200'>
                  <Text className='mt-2 text-5xl'>📦</Text>
                </View>
                {/* Sparkles */}
                <Text className='absolute -right-4 -top-4 text-xl'>✨</Text>
                <Text className='absolute -bottom-2 -left-4 text-lg'>✨</Text>
              </View>
            </View>

            {/* Text Content */}
            <Text className='mb-2 text-center text-2xl font-bold text-slate-900'>
              All Clear!
            </Text>
            <Text className='mb-1 text-center text-base text-slate-500'>
              No archived habits here.
            </Text>
            <Text className='mb-6 max-w-xs text-center text-sm text-slate-400'>
              When you swipe left to archive a habit, it'll appear here for safekeeping.
            </Text>

            {/* Pro Tip Card */}
            <View className='w-full max-w-xs rounded-2xl border border-blue-100 bg-blue-50 p-4'>
              <View className='flex-row items-start gap-3'>
                <Text className='text-2xl'>💡</Text>
                <View className='flex-1'>
                  <Text className='mb-1 text-sm font-medium text-slate-700'>Pro Tip</Text>
                  <Text className='text-xs leading-5 text-slate-500'>
                    Archive habits you want to pause without losing your progress. You can restore them anytime!
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          /* Habit Cards */
          <View className='gap-3 pb-6'>
            {archivedHabits.map((habit) => {
              const strength = (habit.strength ?? 0) * 100;
              const strengthInfo = getStrengthInfo(strength);
              const gradientColor = getStrengthGradientColor(strength);
              const archiveDate = habit.archivedAt || habit._creationTime;

              return (
                <View
                  key={habit._id}
                  className='overflow-hidden rounded-2xl border border-slate-200 bg-white'
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 2,
                  }}
                >
                  {/* Strength Fill Background */}
                  <View className='absolute inset-0' style={{ width: `${Math.min(strength, 100)}%` }}>
                    <LinearGradient
                      colors={[`${gradientColor}20`, `${gradientColor}08`, `${gradientColor}00`]}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={{ flex: 1 }}
                    />
                  </View>

                  <View className='relative p-4'>
                    {/* Top Row: Icon, Name, Archive Date */}
                    <View className='mb-3 flex-row items-start'>
                      <View className='flex-row items-center gap-3'>
                        {/* Color Accent Bar + Icon */}
                        <View className='relative'>
                          <View
                            className='absolute bottom-0 left-0 top-0 w-1 rounded-full'
                            style={{ backgroundColor: habit.iconColor || '#6366F1' }}
                          />
                          <Text className='pl-3 text-2xl'>{habit.icon || '📝'}</Text>
                        </View>
                        <View className='flex-1'>
                          <Text className='text-base font-semibold text-slate-900'>
                            {habit.name}
                          </Text>
                          <View className='mt-0.5 flex-row items-center gap-1'>
                            <Text className='text-xs text-slate-400'>
                              Archived {new Date(archiveDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </Text>
                            <Text className='text-slate-300'>•</Text>
                            <Text className='text-xs text-slate-400'>
                              {getRelativeTime(archiveDate)}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Stats Row */}
                    <View className='mb-3 flex-row flex-wrap gap-2'>
                      {/* Strength Badge */}
                      <View className={`flex-row items-center gap-1.5 rounded-lg px-2.5 py-1 ${strengthInfo.bgColor}`}>
                        <Text className='text-sm'>{strengthInfo.emoji}</Text>
                        <Text className={`text-xs font-semibold ${strengthInfo.textColor}`}>
                          {Math.round(strength)}% {strengthInfo.label}
                        </Text>
                      </View>

                      {/* Streak Badge */}
                      {(habit.currentStreak ?? 0) > 0 ? (
                        <View className='flex-row items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1'>
                          <Text className='text-sm'>🔥</Text>
                          <Text className='text-xs font-semibold text-amber-700'>
                            {habit.currentStreak} day streak
                          </Text>
                        </View>
                      ) : (
                        <View className='flex-row items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1'>
                          <Text className='text-sm'>🔥</Text>
                          <Text className='text-xs font-semibold text-slate-500'>
                            No streak
                          </Text>
                        </View>
                      )}

                      {/* Total Completions Badge */}
                      {(habit.totalCompletions ?? 0) > 0 && (
                        <View className='flex-row items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1'>
                          <Text className='text-xs font-bold text-blue-600'>✓</Text>
                          <Text className='text-xs font-semibold text-blue-700'>
                            {habit.totalCompletions} total
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Action Buttons */}
                    <View className='flex-row gap-2'>
                      <TouchableOpacity
                        accessibilityLabel={`Restore ${habit.name}`}
                        accessibilityRole='button'
                        className='flex-1 flex-row items-center justify-center gap-2 rounded-xl border-2 border-blue-500 py-2.5'
                        onPress={() => handleRestore(habit._id, habit.name)}
                      >
                        <Text className='text-blue-500'>↩</Text>
                        <Text className='text-xs font-bold tracking-wide text-blue-500'>
                          RESTORE
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        accessibilityLabel={`Permanently delete ${habit.name}`}
                        accessibilityRole='button'
                        className='flex-1 flex-row items-center justify-center gap-2 rounded-xl border-2 border-red-400 py-2.5'
                        onPress={() => handlePermanentDelete(habit._id, habit.name)}
                      >
                        <Text className='text-red-400'>🗑</Text>
                        <Text className='text-xs font-bold tracking-wide text-red-400'>
                          DELETE
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </>
  );
}
