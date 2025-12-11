import type { ComponentType } from 'react';
import { Alert, Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';

import CreateHabitModal from '../../../components/CreateHabitModal';
import HabitCalendarModal from '../../../components/HabitCalendarModal';
import HabitDetailScreen from '../../../screens/HabitDetailScreen';
import { MilestoneCelebration } from '../../../components/MilestoneCelebration';
import PauseHabitModal from '../../../components/PauseHabitModal';
import SettingsModal from '../../../components/SettingsModal';
import HapticTest from '../../../components/HapticTest';
import TemplatesScreen from '../../../screens/TemplatesScreen';
import { QuickActionsSheet } from '../../../components/QuickActionsSheet';
import { VisualizationExercise } from '../../../components/VisualizationExercise';
import type { ShareCardData } from '../types';
import type { HabitsModalsState } from '../hooks/useHabitsApp';

interface HabitsModalsProps {
  state: HabitsModalsState;
}

export function HabitsModals({ state }: HabitsModalsProps) {
  const insets = useSafeAreaInsets();
  const {
    celebrationsEnabled,
    settings,
    showSettings,
    showCreateHabit,
    showHabitCalendar,
    showHabitDetail,
    showHapticTest,
    showShareCard,
    showPauseModal,
    showTemplatesScreen,
    showQuickActions,
    showVisualizationExercise,
    habitToEdit,
    habitToPause,
    selectedHabit,
    quickActionsHabit,
    shareCardData,
    milestone,
    tracking,
    showHabitStrengthPercentage,
    closeSettings,
    openHapticTest,
    closeHapticTest,
    closeCreateHabit,
    closeHabitCalendar,
    closeHabitDetail,
    closeShareCard,
    closePauseModal,
    closeTemplatesScreen,
    closeQuickActions,
    closeVisualizationExercise,
    openVisualizationExercise,
    setShowHabitStrengthPercentage,
    onSettingsChange,
    onDeleteHabit,
    onShareMilestone,
    clearMilestone,
    confirmPause,
    toggleHabit,
    getStreak,
    openHabitCalendar,
    openEditHabit,
    openPauseModal,
    handleArchive,
    onChangeCelebrationsEnabled,
    reduceMotionPreference,
  } = state;

  // Today's date for toggle completion
  const today = new Date().toISOString().split('T')[0];

  const ShareCardGenerator: ComponentType<{
    data: ShareCardData;
    visible: boolean;
    onClose: () => void;
  }> | null = showShareCard
    ? (require('../../../components/ShareCardGenerator')
        .default as ComponentType<{
        data: ShareCardData;
        visible: boolean;
        onClose: () => void;
      }>)
    : null;

  return (
    <>
      <SettingsModal
        celebrationsEnabled={celebrationsEnabled}
        habitCompletionIcon={settings?.habitCompletionIcon ?? 'chain'}
        isHighContrastActive={settings?.highContrastMode ?? false}
        onChangeHabitCompletionIcon={(value) =>
          onSettingsChange({ habitCompletionIcon: value })
        }
        onChangeShowCharacterScreen={(value) =>
          onSettingsChange({ showCharacterScreen: value })
        }
        onChangeShowHabitStrengthPercentage={(value) =>
          setShowHabitStrengthPercentage(value)
        }
        onChangeShowNotesStats={(value) =>
          onSettingsChange({ showNotesStats: value })
        }
        onChangeShowWeekCompletionBar={(value) =>
          onSettingsChange({ showWeekCompletionBar: value })
        }
        onClose={closeSettings}
        onOpenHapticTest={openHapticTest}
        showCharacterScreen={settings?.showCharacterScreen ?? true}
        showHabitStrengthPercentage={showHabitStrengthPercentage}
        showNotesStats={settings?.showNotesStats ?? true}
        showWeekCompletionBar={settings?.showWeekCompletionBar ?? true}
        visible={showSettings}
      />

      <CreateHabitModal
        habitToEdit={habitToEdit || undefined}
        visible={showCreateHabit}
        onClose={closeCreateHabit}
      />

      <Modal
        animationType='slide'
        visible={showHapticTest}
        onRequestClose={closeHapticTest}
      >
        <View className='flex-1'>
          <View className='px-4 py-4' style={{ backgroundColor: '#111827' }}>
            <Pressable onPress={closeHapticTest}>
              <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '700' }}>
                ← Back to App
              </Text>
            </Pressable>
          </View>
          <HapticTest />
        </View>
      </Modal>

      <HabitCalendarModal
        habit={selectedHabit}
        streak={selectedHabit ? getStreak(selectedHabit._id) : 0}
        tracking={tracking}
        toggleHabit={toggleHabit}
        visible={showHabitCalendar}
        onClose={closeHabitCalendar}
      />

      <HabitDetailScreen
        habit={selectedHabit}
        visible={showHabitDetail}
        isPremium={process.env.EXPO_PUBLIC_ENABLE_PREMIUM === 'true'}
        onClose={closeHabitDetail}
        onArchive={(habitId) => handleArchive(habitId)}
        onDelete={onDeleteHabit}
        onEdit={(habit) => openEditHabit(habit)}
        onPause={(habitId) => openPauseModal(habitId)}
        onOpenCalendar={(habit) => openHabitCalendar(habit)}
        onUpgrade={() => {
          console.log('Upgrade to premium');
        }}
      />

      {milestone && (
        <MilestoneCelebration
          visible
          habitName={milestone.habitName}
          level={milestone.level}
          strength={milestone.strength}
          onClose={clearMilestone}
          onShare={() =>
            onShareMilestone({
              habitName: milestone.habitName,
              milestoneLevel: milestone.level,
              strengthPercentage: milestone.strength,
            })
          }
        />
      )}

      {showShareCard && shareCardData && ShareCardGenerator && (
        <ShareCardGenerator
          data={shareCardData}
          visible={showShareCard}
          onClose={closeShareCard}
        />
      )}

      <PauseHabitModal
        habitName={habitToPause?.name ?? ''}
        visible={showPauseModal}
        onCancel={closePauseModal}
        onConfirm={confirmPause}
      />

      <Modal
        animationType='slide'
        visible={showTemplatesScreen}
        onRequestClose={closeTemplatesScreen}
      >
        <View className='flex-1'>
          <TemplatesScreen />
          <View className='absolute right-4 top-12'>
            <Pressable
              className='h-10 w-10 items-center justify-center rounded-full bg-white shadow-md'
              onPress={closeTemplatesScreen}
            >
              <Text style={{ fontSize: 20, fontWeight: '600' }}>×</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Quick Actions Sheet */}
      <QuickActionsSheet
        habit={quickActionsHabit ? {
          _id: quickActionsHabit._id,
          name: quickActionsHabit.name,
          icon: quickActionsHabit.icon,
          completed: tracking.some(
            (t) => t.habitId === quickActionsHabit._id && t.date === today && t.completed
          ),
        } : null}
        visible={showQuickActions}
        onClose={closeQuickActions}
        onComplete={() => {
          if (quickActionsHabit) {
            toggleHabit({ habitId: quickActionsHabit._id, date: today });
          }
        }}
        onMentalBoost={() => {
          if (quickActionsHabit) {
            openVisualizationExercise(quickActionsHabit);
          }
        }}
        onViewCalendar={() => {
          if (quickActionsHabit) {
            openHabitCalendar(quickActionsHabit);
          }
        }}
        onEdit={() => {
          if (quickActionsHabit) {
            openEditHabit(quickActionsHabit);
          }
        }}
        onPause={() => {
          if (quickActionsHabit) {
            openPauseModal(quickActionsHabit._id);
          }
        }}
        onDelete={() => {
          if (quickActionsHabit) {
            Alert.alert(
              'Delete Habit',
              `Are you sure you want to delete "${quickActionsHabit.name}"? This cannot be undone.`,
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => onDeleteHabit(quickActionsHabit._id),
                },
              ]
            );
          }
        }}
      />

      {/* Visualization Exercise Modal (Mental Boost) */}
      <Modal
        animationType='slide'
        visible={showVisualizationExercise}
        onRequestClose={closeVisualizationExercise}
      >
        <View className='flex-1 bg-white' style={{ paddingTop: insets.top + 16 }}>
          {/* Header */}
          <View className='flex-row items-center justify-between border-b border-stone-100 px-5 pb-4'>
            <Text className='text-lg font-bold text-stone-900'>
              Mental Boost
            </Text>
            <Pressable
              accessibilityLabel='Close mental boost'
              accessibilityRole='button'
              className='h-10 w-10 items-center justify-center rounded-full bg-stone-100 active:bg-stone-200'
              onPress={closeVisualizationExercise}
            >
              <X color='#57534e' size={22} />
            </Pressable>
          </View>

          {/* Exercise Content */}
          <View
            className='flex-1 px-5 pt-4'
            style={{ paddingBottom: insets.bottom + 16 }}
          >
            <VisualizationExercise
              habitName={selectedHabit?.name ?? ''}
              onClose={closeVisualizationExercise}
              onSave={(data) => {
                console.log('Visualization saved:', data);
                Alert.alert(
                  'Visualization Saved! ✨',
                  'Your mental contrasting exercise has been saved. Review it when you need motivation.',
                  [{ text: 'Got it' }]
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

export default HabitsModals;
