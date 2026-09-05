/** Horizontal chip strip inside an open panel row. */
import type { ReactNode } from 'react';
import { View } from 'react-native';

export function OptionChipRow({ children }: { children: ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>{children}</View>
  );
}
