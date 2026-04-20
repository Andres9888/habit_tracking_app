import { Text, View } from 'react-native';

import { useThemeColors } from '@/theme';

interface Props {
  items: readonly string[];
  glyph?: string;
}

export function BulletList({ items, glyph = '•' }: Props) {
  const { colors } = useThemeColors();

  return (
    <View style={{ gap: 14 }}>
      {items.map((line) => (
        <View
          key={line}
          style={{ alignItems: 'flex-start', flexDirection: 'row', gap: 10 }}
        >
          <Text style={{ color: colors.primary[600], fontSize: 18 }}>
            {glyph}
          </Text>
          <Text
            style={{
              color: colors.text.primary,
              flex: 1,
              fontSize: 16,
              lineHeight: 22,
            }}
          >
            {line}
          </Text>
        </View>
      ))}
    </View>
  );
}
