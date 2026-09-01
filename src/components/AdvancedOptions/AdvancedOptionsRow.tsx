/** One panel row: 16px vertical padding, hairline divider above all but the first. */
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useAdvancedTokens } from './useAdvancedTokens';

interface Props {
  children: ReactNode;
  /** False only for whichever row currently renders first. */
  divided?: boolean;
}

export function AdvancedOptionsRow({ children, divided = true }: Props) {
  const t = useAdvancedTokens();
  return (
    <View
      style={{
        ...(divided ? { borderTopWidth: 1, borderTopColor: t.border } : null),
        paddingTop: 16,
        paddingBottom: 16,
      }}
    >
      {children}
    </View>
  );
}
