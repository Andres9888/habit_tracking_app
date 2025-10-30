import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import FloatingActionButton from './components/FloatingActionButton';
import { HabitsList } from './components/HabitsList';
import { HabitsModals } from './components/HabitsModals';
import WebToaster from './components/WebToaster';
import { useHabitsApp } from './hooks/useHabitsApp';

export function HabitsApp() {
  const { list, modals } = useHabitsApp();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className='flex-1 bg-[#F7F8FB]'>
        <HabitsList state={list} onOpenSettings={modals.openSettings} />

        <View className='absolute bottom-8 right-6'>
          <FloatingActionButton onPress={list.handleToggleForm} />
        </View>

        <WebToaster />
        <HabitsModals state={modals} />
      </View>
    </GestureHandlerRootView>
  );
}

export default HabitsApp;
