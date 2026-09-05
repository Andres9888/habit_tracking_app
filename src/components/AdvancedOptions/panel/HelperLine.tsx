/** Dot + uppercase micro helper under an open row's controls. */
import { Text, View } from 'react-native';
import { fontWeights, typography } from '@/theme/typography';
import { usePanelTokens } from './panelTokens';

export function HelperLine({ children }: { children: string }) {
  const t = usePanelTokens();
  return (
    <View
      accessibilityRole='text'
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 5,
        marginTop: 8,
      }}
    >
      <View
        style={{
          width: 5,
          height: 5,
          borderRadius: 999,
          backgroundColor: t.dot,
          marginTop: 3,
        }}
      />
      <Text
        style={{
          ...typography.tabBar,
          flex: 1,
          fontWeight: fontWeights.semibold,
          letterSpacing: 0.3,
          lineHeight: 12,
          textTransform: 'uppercase',
          color: t.textSecondary,
        }}
      >
        {children}
      </Text>
    </View>
  );
}
