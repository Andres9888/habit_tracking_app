/** Tracks OS notification permission for the reminders permission guard.
 *
 *  Only checks while reminders are ON — a warning about undelivered reminders
 *  is meaningless when there are none. Re-checks on foreground so the banner
 *  clears as soon as the user flips the switch in system Settings and returns.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { hasNotificationPermissions } from '@/utils/notifications';

export function useNotificationPermissionStatus(enabled: boolean) {
  // Assume granted until proven otherwise so the banner never flashes on mount.
  const [granted, setGranted] = useState(true);
  const isMounted = useRef(true);

  const check = useCallback(() => {
    if (!enabled) {
      setGranted(true);
      return;
    }
    void hasNotificationPermissions().then((result) => {
      if (isMounted.current) setGranted(result);
    });
  }, [enabled]);

  useEffect(() => {
    isMounted.current = true;
    check();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') check();
    });
    return () => {
      isMounted.current = false;
      subscription.remove();
    };
  }, [check]);

  return { permissionGranted: granted };
}
