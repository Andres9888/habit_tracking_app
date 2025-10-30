import type { ComponentType } from 'react';
import { Platform } from 'react-native';

const NativeWebToaster: ComponentType | null =
  Platform.OS === 'web' ? (require('sonner').Toaster as ComponentType) : null;

export function WebToaster() {
  if (!NativeWebToaster) {
    return null;
  }
  return <NativeWebToaster />;
}

export default WebToaster;
