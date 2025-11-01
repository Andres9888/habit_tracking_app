import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { HabitsHeader } from './components/HabitsHeader';
import { CalendarTimeline } from '../../components/CalendarTimeline';
import { HabitsList } from './components/HabitsList';
import { HabitsModals } from './components/HabitsModals';
import FloatingActionButton from './components/FloatingActionButton';
import WebToaster from './components/WebToaster';
import { useHabitsApp } from './hooks/useHabitsApp';

export function HabitsApp() {
  const { list, modals } = useHabitsApp();
  const { openCreateHabitScreen, openSettings, openTemplatesScreen } = modals;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className='flex-1 bg-[#F7F8FB]'>
        <View className='gap-4 px-6 pb-6 pt-12'>
          <HabitsHeader
            openCreateHabitScreen={openCreateHabitScreen}
            openSettings={openSettings}
            openTemplatesScreen={openTemplatesScreen}
          />

          <CalendarTimeline
            showSeparator
            canNavigateForward={list.canNavigateForward}
            dates={list.weekDates}
            onNextWeek={list.handleNextWeek}
            onPreviousWeek={list.handlePreviousWeek}
          />
        </View>

        <HabitsList list={list} modals={modals} />

        <View className='absolute bottom-8 right-6'>
          <FloatingActionButton openCreateHabitScreen={openCreateHabitScreen} />
        </View>

        <WebToaster />
        <HabitsModals state={modals} />
      </View>
    </GestureHandlerRootView>
  );
}

export default HabitsApp;
