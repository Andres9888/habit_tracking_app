/**
 * MonitoringExample - Example screen demonstrating all health monitoring features
 * 
 * This is a reference implementation showing how to use:
 * - Screen render tracking
 * - Convex query performance monitoring
 * - User action tracking
 * - Navigation tracking
 */

import { useQuery, useMutation } from 'convex/react';
import { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  useScreenRenderTracking,
  useScreenRenderTrackingManual,
  useConvexQueryTracking,
  useConvexQueryTrackingManual,
  useUserActionTracking,
} from '@/lib/performance';
import { api } from '@/convex/_generated/api';

// Example: Automatic screen render tracking
function ExampleScreen1() {
  // Tracks render time until InteractionManager.runAfterInteractions completes
  useScreenRenderTracking('ExampleScreen1');

  return (
    <View style={styles.container}>
      <Text>Screen with automatic render tracking</Text>
    </View>
  );
}

// Example: Manual screen render tracking for complex screens
function ExampleScreen2() {
  const [dataLoaded, setDataLoaded] = useState(false);
  const { markInteractive } = useScreenRenderTrackingManual('ExampleScreen2');

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setDataLoaded(true);
      // Mark screen as interactive when ready
      markInteractive();
    }, 500);
    return () => clearTimeout(timer);
  }, [markInteractive]);

  if (!dataLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text>Screen with manual render tracking</Text>
    </View>
  );
}

// Example: Convex query performance tracking
function HabitListWithTracking() {
  const habits = useQuery(api.habits.list);

  // Automatically tracks query performance
  useConvexQueryTracking(
    'habits.list',
    habits === undefined, // isLoading
    undefined,            // error
    habits?.length        // resultSize (optional)
  );

  if (habits === undefined) {
    return <Text>Loading habits...</Text>;
  }

  return (
    <FlatList
      data={habits}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={styles.habitItem}>
          <Text>{item.name}</Text>
        </View>
      )}
    />
  );
}

// Example: Mutation tracking with manual controls
function CreateHabitWithTracking() {
  const createHabit = useMutation(api.habits.create);
  const trackQuery = useConvexQueryTrackingManual();
  const { trackAction } = useUserActionTracking();

  const handleCreate = async (name: string) => {
    // Track the user action
    trackAction('habit.create', { name });

    // Track the mutation performance
    const queryId = trackQuery.start('habits.create');
    try {
      const result = await createHabit({ name });
      trackQuery.end(queryId, { resultSize: 1 });
      
      // Track success
      trackAction('habit.create.success', { habitId: result });
      
      return result;
    } catch (error) {
      trackQuery.end(queryId, { error: error as Error });
      
      // Track failure
      trackAction('habit.create.error', { 
        error: (error as Error).message 
      });
      
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      <Button 
        title="Create Habit" 
        onPress={() => handleCreate('New Habit')} 
      />
    </View>
  );
}

// Example: User action and navigation tracking
function HabitCardWithTracking({ 
  habit, 
  navigation 
}: { 
  habit: any; 
  navigation: any; 
}) {
  const { trackAction, trackNavigation } = useUserActionTracking();

  const handleComplete = () => {
    // Track the completion action
    trackAction('habit.complete', {
      habitId: habit._id,
      habitName: habit.name,
      streak: habit.streak,
    });

    // ... completion logic
  };

  const handleNavigateToDetail = () => {
    // Track navigation
    trackNavigation('HabitList', 'HabitDetail');
    
    // Track the tap action
    trackAction('habit.view_detail', {
      habitId: habit._id,
    });

    navigation.navigate('HabitDetail', { id: habit._id });
  };

  return (
    <View style={styles.habitCard}>
      <Text>{habit.name}</Text>
      <Button title="Complete" onPress={handleComplete} />
      <Button title="View Details" onPress={handleNavigateToDetail} />
    </View>
  );
}

// Full example: Complete screen with all monitoring
function CompleteMonitoringExample({ navigation }: NativeStackScreenProps<any>) {
  // 1. Screen render tracking
  useScreenRenderTracking('CompleteMonitoringExample');

  // 2. Query tracking
  const habits = useQuery(api.habits.list);
  useConvexQueryTracking(
    'habits.list',
    habits === undefined,
    undefined,
    habits?.length
  );

  // 3. User action tracking
  const { trackAction } = useUserActionTracking();
  const createHabit = useMutation(api.habits.create);
  const trackQuery = useConvexQueryTrackingManual();

  const handleCreateHabit = async () => {
    trackAction('create_habit.button_pressed');
    
    const queryId = trackQuery.start('habits.create');
    try {
      const result = await createHabit({ name: 'Example Habit' });
      trackQuery.end(queryId, { resultSize: 1 });
      trackAction('create_habit.success', { habitId: result });
    } catch (error) {
      trackQuery.end(queryId, { error: error as Error });
      trackAction('create_habit.error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monitoring Example</Text>
      
      <Button title="Create Habit" onPress={handleCreateHabit} />

      {habits === undefined ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <HabitCardWithTracking 
              habit={item} 
              navigation={navigation} 
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  habitCard: {
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
  },
  habitItem: {
    marginBottom: 8,
    padding: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export {
  ExampleScreen1,
  ExampleScreen2,
  HabitListWithTracking,
  CreateHabitWithTracking,
  HabitCardWithTracking,
  CompleteMonitoringExample,
};
