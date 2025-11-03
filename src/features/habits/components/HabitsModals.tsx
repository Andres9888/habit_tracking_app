import type { ComponentType } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

import CreateHabitModal from '../../../components/CreateHabitModal';
import HabitCalendarModal from '../../../components/HabitCalendarModal';
import HabitDetailScreen from '../../../screens/HabitDetailScreen';
import { MilestoneCelebration } from '../../../components/MilestoneCelebration';
import PauseHabitModal from '../../../components/PauseHabitModal';
import SettingsModal from '../../../components/SettingsModal';
import HapticTest from '../../../components/HapticTest';
import TemplatesScreen from '../../../screens/TemplatesScreen';
import type { ShareCardData } from '../types';
import type { HabitsModalsState } from '../hooks/useHabitsApp';

interface HabitsModalsProps {
  state: HabitsModalsState;
}

export function HabitsModals({ state }: HabitsModalsProps) {
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
    habitToEdit,
    habitToPause,
    selectedHabit,
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
        visible={showSettings}
        onClose={closeSettings}
        showHabitStrengthPercentage={showHabitStrengthPercentage}
        onChangeShowHabitStrengthPercentage={(value) =>
          setShowHabitStrengthPercentage(value)
        }
        showWeekCompletionBar={settings?.showWeekCompletionBar ?? true}
        onChangeShowWeekCompletionBar={(value) =>
          onSettingsChange({ showWeekCompletionBar: value })
        }
        showNotesStats={settings?.showNotesStats ?? true}
        onChangeShowNotesStats={(value) =>
          onSettingsChange({ showNotesStats: value })
        }
        showCharacterScreen={settings?.showCharacterScreen ?? true}
        onChangeShowCharacterScreen={(value) =>
          onSettingsChange({ showCharacterScreen: value })
        }
        isHighContrastActive={settings?.highContrastMode ?? false}
        onOpenHapticTest={openHapticTest}
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
    </>
  );
}

export default HabitsModals;
