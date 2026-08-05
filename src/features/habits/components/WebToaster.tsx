import type { ComponentType } from 'react';
import { Platform } from 'react-native';

const NativeWebToaster: ComponentType | null =
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Platform.OS === 'web' ? (require('sonner').Toaster as ComponentType) : null;

export function WebToaster() {
  if (!NativeWebToaster) {
    return null;
  }
  return <NativeWebToaster />;
}

export default WebToaster;
