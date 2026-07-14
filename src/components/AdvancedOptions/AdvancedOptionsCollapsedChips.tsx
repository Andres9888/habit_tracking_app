/** Collapsed summary chips under the Advanced options header. */
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { fontWeights } from '@/theme/typography';

export interface AdvancedOptionChip {
  icon: ReactNode;
  label: string;
  backgroundColor: string;
  foregroundColor: string;
}

export function AdvancedOptionsCollapsedChips({
  chips,
}: {
  chips: AdvancedOptionChip[];
}) {
  return (
    <View
      style={{
        marginTop: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
      }}
    >
      {chips.map((c) => (
        <View
          key={c.label}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            borderRadius: 999,
            paddingHorizontal: 10,
            paddingVertical: 5,
            backgroundColor: c.backgroundColor,
          }}
        >
          {c.icon}
          <Text
            style={{
              fontSize: 11,
              fontWeight: fontWeights.semibold,
              color: c.foregroundColor,
            }}
          >
            {c.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
