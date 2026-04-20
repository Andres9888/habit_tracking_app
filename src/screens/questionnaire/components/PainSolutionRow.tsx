import { Text, View } from 'react-native';

import { useThemeColors } from '@/theme';

interface Props {
  painLabel: string;
  icon: string;
  title: string;
  body: string;
}

export function PainSolutionRow({ painLabel, icon, title, body }: Props) {
  const { colors } = useThemeColors();

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderRadius: 14,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
        padding: 14,
      }}
    >
      <Text style={{ fontSize: 26 }}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: colors.text.tertiary,
            fontSize: 12,
            marginBottom: 4,
            textDecorationLine: 'line-through',
          }}
        >
          {painLabel}
        </Text>
        <Text
          style={{
            color: colors.text.primary,
            fontSize: 15,
            fontWeight: '600',
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            color: colors.text.secondary,
            fontSize: 14,
            lineHeight: 19,
            marginTop: 2,
          }}
        >
          {body}
        </Text>
      </View>
    </View>
  );
}
