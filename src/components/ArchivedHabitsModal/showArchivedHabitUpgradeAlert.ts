import { Alert } from 'react-native';

export function showArchivedHabitUpgradeAlert(): void {
  Alert.alert(
    'Upgrade to Premium',
    "You've reached the free limit of 3 active habits. Upgrade to premium for unlimited habits, or delete an active habit to make room.",
    [{ text: 'OK', style: 'default' }]
  );
}
