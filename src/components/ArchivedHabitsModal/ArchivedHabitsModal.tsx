import { useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, X } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { useArchivedHabitsModalLogic } from './ArchivedHabitsModal.hooks';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import type { Id } from '../../../convex/_generated/dataModel';

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

// Animation constants
const CARD_ANIMATION_DURATION = 300; // 300ms per card
const CARD_ANIMATION_STAGGER = 50; // 50ms stagger between cards

// Animated habit card component
interface AnimatedHabitCardProps {
  habit: {
    _id: Id<'habits'>;
    name: string;
    icon?: string;
    iconColor?: string;
    strength?: number;
    currentStreak?: number;
    totalCompletions?: number;
    archivedAt?: number;
    _creationTime: number;
  };
  index: number;
  reducedMotion: boolean;
  onRestore: (id: Id<'habits'>, name: string) => void;
  onDelete: (id: Id<'habits'>, name: string) => void;
}

function AnimatedHabitCard({
  habit,
  index,
  reducedMotion,
  onRestore,
  onDelete,
}: AnimatedHabitCardProps) {
  const cardOpacity = useSharedValue(reducedMotion ? 1 : 0);
  const cardTranslateY = useSharedValue(reducedMotion ? 0 : 20);

  useEffect(() => {
    if (reducedMotion) {
      // Instant appearance for reduced motion
      cardOpacity.value = 1;
      cardTranslateY.value = 0;
      return;
    }

    const delay = index * CARD_ANIMATION_STAGGER;

    cardOpacity.value = withDelay(
      delay,
      withTiming(1, { duration: CARD_ANIMATION_DURATION, easing: Easing.out(Easing.cubic) })
    );
    cardTranslateY.value = withDelay(
      delay,
      withSpring(0, { damping: 18, stiffness: 120 })
    );

    return () => {
      cancelAnimation(cardOpacity);
      cancelAnimation(cardTranslateY);
    };
  }, [index, reducedMotion, cardOpacity, cardTranslateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }],
  }));

  const strength = (habit.strength ?? 0) * 100;
  const strengthInfo = getStrengthInfo(strength);
  const gradientColor = getStrengthGradientColor(strength);
  const archiveDate = habit.archivedAt || habit._creationTime;

  return (
    <Animated.View style={animatedStyle}>
      <View
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
              onPress={() => onRestore(habit._id, habit.name)}
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
              onPress={() => onDelete(habit._id, habit.name)}
            >
              <Text className='text-red-400'>🗑</Text>
              <Text className='text-xs font-bold tracking-wide text-red-400'>
                DELETE
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

export default function ArchivedHabitsModal({
  onClose,
  onBack,
}: ArchivedHabitsModalProps) {
  const insets = useSafeAreaInsets();
  const reducedMotion = useReduceMotion();
  const { archivedHabits, handleRestore, handlePermanentDelete } =
    useArchivedHabitsModalLogic();

  return (
    <>
      {/* Header - dynamic padding for Dynamic Island/notch with subtle blur */}
      <BlurView
        intensity={20}
        tint='light'
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 0,
          paddingBottom: 8,
        }}
      >
        <View className='mb-2 flex-row items-center justify-between'>
          <TouchableOpacity
            accessibilityLabel='Back to settings'
            accessibilityRole='button'
            className='h-11 w-11 items-center justify-center rounded-2xl bg-slate-100/80'
            onPress={onBack}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 3,
              elevation: 1,
            }}
          >
            <ChevronLeft color='#475569' size={24} strokeWidth={2} />
          </TouchableOpacity>
          <Text className='flex-1 text-center text-xl font-bold text-slate-900'>
            Archived Habits
          </Text>
          <TouchableOpacity
            accessibilityLabel='Close'
            accessibilityRole='button'
            className='h-11 w-11 items-center justify-center rounded-2xl bg-slate-100/80'
            onPress={onClose}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 3,
              elevation: 1,
            }}
          >
            <X color='#64748b' size={22} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </BlurView>

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

      <ScrollView
        className='flex-1'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
      >
        {archivedHabits.length === 0 ? (
          /* Empty State */
          <View className='items-center justify-center px-6 py-16'>
            {/* Illustration - using plant/growth metaphor for warmth */}
            <View className='mb-6 items-center'>
              <View className='relative'>
                <View className='h-28 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100'>
                  <Text className='mt-2 text-5xl'>🌱</Text>
                </View>
                {/* Sparkles - repositioned for balance */}
                <Text className='absolute -right-3 -top-3 text-xl'>🌟</Text>
                <Text className='absolute -bottom-2 -left-3 text-lg'>✨</Text>
              </View>
            </View>

            {/* Text Content - warmer, more encouraging copy */}
            <Text className='mb-2 text-center text-2xl font-bold text-slate-900'>
              Your Habits Are Thriving!
            </Text>
            <Text className='mb-1 text-center text-base text-slate-500'>
              All your habits are active and growing.
            </Text>
            <Text className='mb-6 max-w-xs text-center text-sm text-slate-400'>
              When you need a break from a habit, swipe left to archive it here for safekeeping.
            </Text>

            {/* Pro Tip Card - warmer color scheme */}
            <View className='w-full max-w-xs rounded-2xl border border-emerald-100 bg-emerald-50 p-4'>
              <View className='flex-row items-start gap-3'>
                <Text className='text-2xl'>💚</Text>
                <View className='flex-1'>
                  <Text className='mb-1 text-sm font-medium text-emerald-800'>Good to Know</Text>
                  <Text className='text-xs leading-5 text-emerald-700'>
                    Archiving preserves all your progress and streaks. You can restore habits anytime and pick up right where you left off!
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          /* Habit Cards with staggered entrance animations */
          <View className='gap-3'>
            {archivedHabits.map((habit, index) => (
              <AnimatedHabitCard
                key={habit._id}
                habit={habit}
                index={index}
                reducedMotion={reducedMotion}
                onRestore={handleRestore}
                onDelete={handlePermanentDelete}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </>
  );
}
