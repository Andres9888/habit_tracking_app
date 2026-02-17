import { useEffect } from 'react';
import * as QuickActions from 'expo-quick-actions';
import { router } from 'expo-router';

/**
 * Quick Actions Hook
 * 
 * Handles iOS 3D Touch / Haptic Touch quick actions and Siri Shortcuts.
 * Automatically registers quick actions and handles navigation when triggered.
 */
export function useQuickActions() {
  useEffect(() => {
    // Set up quick actions on mount
    const setupQuickActions = async () => {
      try {
        await QuickActions.setItems([
          {
            id: 'complete-top-habit',
            title: 'Complete Top Habit',
            subtitle: 'Mark your highest priority habit as done',
            icon: 'symbol:checkmark.circle.fill',
            params: { action: 'complete-top-habit' },
          },
          {
            id: 'add-habit',
            title: 'Add New Habit',
            subtitle: 'Create a new habit to track',
            icon: 'symbol:plus.circle.fill',
            params: { action: 'add-habit' },
          },
          {
            id: 'view-streaks',
            title: 'View Streaks',
            subtitle: 'See your current streaks',
            icon: 'symbol:flame.fill',
            params: { action: 'view-streaks' },
          },
        ]);
      } catch (error) {
        console.error('Failed to set up quick actions:', error);
      }
    };

    setupQuickActions();

    // Subscribe to quick action events
    const subscription = QuickActions.addListener((action) => {
      handleQuickAction(action.params?.action);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleQuickAction = (actionType: string | undefined) => {
    switch (actionType) {
      case 'complete-top-habit':
        // Navigate to home and trigger completion of top habit
        router.push('/(tabs)');
        // TODO: Implement automatic completion of top habit
        // This could be done by exposing a method from the habits context
        break;
      
      case 'add-habit':
        // Navigate to add habit screen
        router.push('/create-habit');
        break;
      
      case 'view-streaks':
        // Navigate to streaks/stats view
        router.push('/(tabs)/stats');
        break;
      
      default:
        // Unknown action, navigate to home
        router.push('/(tabs)');
    }
  };
}
