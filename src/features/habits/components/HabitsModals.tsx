import type { ComponentType } from 'react';
import { Alert, Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { X } from 'lucide-react-native';

import CreateHabitModal from '../../../components/CreateHabitModal';
import HabitCalendarModal from '../../../components/HabitCalendarModal';
import HabitDetailScreen from '../../../screens/HabitDetailScreen';
import CustomModal from '../../../components/Modal';
import PauseHabitModal from '../../../components/PauseHabitModal';
import SettingsModal from '../../../components/SettingsModal';
import HapticTest from '../../../components/HapticTest';
import TemplatesScreen from '../../../screens/TemplatesScreen';
import { QuickActionsSheet } from '../../../components/QuickActionsSheet';
import { VisualizationExercise } from '../../../components/VisualizationExercise';
import type { ShareCardData } from '../types';
import type { HabitsModalsState } from '../hooks/useHabitsApp';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface HabitsModalsProps {
  state: HabitsModalsState;
}

export function HabitsModals({ state }: HabitsModalsProps) {
  const insets = useSafeAreaInsets();

  // Animation values for close button press feedback
  const templatesCloseScale = useSharedValue(1);
  const visualizationCloseScale = useSharedValue(1);

  const templatesCloseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: templatesCloseScale.value }],
  }));

  const visualizationCloseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: visualizationCloseScale.value }],
  }));

  const handleTemplatesClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    state.closeTemplatesScreen();
  };

  const handleVisualizationClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    state.closeVisualizationExercise();
  };

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
    confirmPause,
    toggleHabit,
    getStreak,
    openHabitDetail,
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
        dayShape={settings?.dayShape ?? 'square'}
        habitCompletionIcon={settings?.habitCompletionIcon ?? 'chain'}
        isHighContrastActive={settings?.highContrastMode ?? false}
        onChangeDayShape={(value) =>
          onSettingsChange({ dayShape: value })
        }
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
        onArchive={(habitId) => handleArchive(habitId)}
        onClose={closeHabitDetail}
        onDelete={onDeleteHabit}
        onEdit={(habit) => openEditHabit(habit)}
        onPause={(habitId) => openPauseModal(habitId)}
        onOpenCalendar={(habit) => openHabitCalendar(habit)}
        tracking={tracking}
        visible={showHabitDetail}
      />

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

      <CustomModal
        variant='fullScreen'
        visible={showTemplatesScreen}
        onClose={handleTemplatesClose}
      >
        <View className='flex-1' style={{ paddingTop: insets.top }}>
          <TemplatesScreen />
          <View className='absolute right-4' style={{ top: insets.top + 8 }}>
            <AnimatedPressable
              accessibilityLabel='Close templates'
              accessibilityRole='button'
              className='h-10 w-10 items-center justify-center rounded-full bg-white shadow-md'
              style={templatesCloseAnimatedStyle}
              onPress={handleTemplatesClose}
              onPressIn={() => {
                templatesCloseScale.value = withSpring(0.9, { damping: 15, stiffness: 200 });
              }}
              onPressOut={() => {
                templatesCloseScale.value = withSpring(1, { damping: 15, stiffness: 200 });
              }}
            >
              <X color='#57534e' size={22} />
            </AnimatedPressable>
          </View>
        </View>
      </CustomModal>

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
        onViewDetails={() => {
          if (quickActionsHabit) {
            openHabitDetail(quickActionsHabit);
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
      <CustomModal
        variant='fullScreen'
        visible={showVisualizationExercise}
        onClose={handleVisualizationClose}
      >
        <View className='flex-1 bg-white' style={{ paddingTop: insets.top + 16 }}>
          {/* Header */}
          <View className='flex-row items-center justify-between border-b border-stone-100 px-5 pb-4'>
            <Text className='text-lg font-bold text-stone-900'>
              Mental Boost
            </Text>
            <AnimatedPressable
              accessibilityLabel='Close mental boost'
              accessibilityRole='button'
              className='h-10 w-10 items-center justify-center rounded-full bg-stone-100'
              style={visualizationCloseAnimatedStyle}
              onPress={handleVisualizationClose}
              onPressIn={() => {
                visualizationCloseScale.value = withSpring(0.9, { damping: 15, stiffness: 200 });
              }}
              onPressOut={() => {
                visualizationCloseScale.value = withSpring(1, { damping: 15, stiffness: 200 });
              }}
            >
              <X color='#57534e' size={22} />
            </AnimatedPressable>
          </View>

          {/* Exercise Content */}
          <View
            className='flex-1 px-5 pt-4'
            style={{ paddingBottom: insets.bottom + 16 }}
          >
            <VisualizationExercise
              habitName={selectedHabit?.name ?? ''}
              onClose={handleVisualizationClose}
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
      </CustomModal>
    </>
  );
}

export default HabitsModals;
