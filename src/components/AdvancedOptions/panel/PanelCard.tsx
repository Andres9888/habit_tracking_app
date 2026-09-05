/** Rounded panel surface that holds the "More to customize" rows. */
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { usePanelTokens } from './panelTokens';

export function PanelCard({ children }: { children: ReactNode }) {
  const t = usePanelTokens();
  return (
    <View
      style={{
        backgroundColor: t.panelBg,
        borderWidth: 1,
        borderColor: t.panelBorder,
        borderRadius: 16,
        paddingHorizontal: 16,
        shadowColor: '#2D2A26',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
        elevation: 1,
      }}
    >
      {children}
    </View>
  );
}
