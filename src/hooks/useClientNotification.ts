import { useCallback } from 'react';
import { Alert, Platform } from 'react-native';

type NotificationVariant = 'error' | 'success';

export const useClientNotification = () => {
  const baseNotify = useCallback((message: string, variant: NotificationVariant) => {
    if (!message) {
      return;
    }

    if (Platform.OS === 'web') {
      const { toast } = require('sonner') as typeof import('sonner');
      if (variant === 'success') {
        toast.success(message);
        return;
      }
      toast.error(message);
      return;
    }

    Alert.alert(
      variant === 'success' ? 'Success' : 'Something went wrong',
      message,
      [{ text: 'OK' }],
      { cancelable: true },
    );
  }, []);

  const notifyError = useCallback(
    (message: string) => baseNotify(message, 'error'),
    [baseNotify],
  );

  const notifySuccess = useCallback(
    (message: string) => baseNotify(message, 'success'),
    [baseNotify],
  );

  return {
    notifyError,
    notifySuccess,
  };
};

export default useClientNotification;
