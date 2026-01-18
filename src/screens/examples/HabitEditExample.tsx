import { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import HabitEditScreen from '../HabitEditScreen';

/**
 * Example usage of HabitEditScreen
 *
 * This component demonstrates how to integrate the HabitEditScreen
 * into your app. Simply render this component to test the habit editing functionality.
 *
 * Usage:
 * 1. Click on any habit to open the edit screen
 * 2. Edit the habit details
 * 3. Save or cancel to return to the list
 */
export default function HabitEditExample() {
  const habits = useQuery(api.habits.list);
  const [editingHabitId, setEditingHabitId] = useState<Id<'habits'> | null>(
    null
  );
  const [showEditScreen, setShowEditScreen] = useState(false);

  const handleEditHabit = (habitId: Id<'habits'>) => {
    setEditingHabitId(habitId);
    setShowEditScreen(true);
  };

  const handleCloseEditScreen = () => {
    setShowEditScreen(false);
    setEditingHabitId(null);
  };

  return (
    <View className='flex-1 bg-[#faf9f7] pt-12'>
      <Text className='mb-4 px-4 text-2xl font-bold tracking-tight text-[#1a1a1a]'>
        Habit Edit Screen Example
      </Text>
      <Text className='mb-6 px-4 text-base text-[#8a8a8a]'>
        Tap on any habit to open the edit screen
      </Text>

      <FlatList
        data={habits}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <View className='items-center justify-center px-4 py-12'>
            <Text className='text-center text-base text-[#8a8a8a]'>
              No habits found. Create a habit first to test the edit screen.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            className='mx-4 mb-3 flex-row items-center rounded-2xl bg-white p-4'
            onPress={() => handleEditHabit(item._id)}
          >
            <View className='mr-3 h-12 w-12 items-center justify-center rounded-xl bg-blue-100'>
              <Text className='text-2xl'>
                {item.icon || item.name.split(' ')[0] || '💪'}
              </Text>
            </View>
            <View className='flex-1'>
              <Text className='text-base font-semibold text-[#1a1a1a]'>
                {item.name}
              </Text>
              {item.notes && (
                <Text className='text-sm text-[#8a8a8a]' numberOfLines={1}>
                  {item.notes}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Habit Edit Screen */}
      <HabitEditScreen
        habitId={editingHabitId}
        visible={showEditScreen}
        onClose={handleCloseEditScreen}
      />
    </View>
  );
}
