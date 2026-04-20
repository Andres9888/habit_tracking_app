import { Text } from 'react-native';

import { useThemeColors } from '@/theme';

interface Props {
  icon: string;
  name: string;
  description: string;
}

export function DemoCardBody({ icon, name, description }: Props) {
  const { colors } = useThemeColors();

  return (
    <>
      <Text style={{ fontSize: 54, textAlign: 'center' }}>{icon}</Text>
      <Text
        style={{
          color: colors.text.primary,
          fontSize: 22,
          fontWeight: '700',
          marginTop: 12,
          textAlign: 'center',
        }}
      >
        {name}
      </Text>
      <Text
        style={{
          color: colors.text.secondary,
          fontSize: 14,
          lineHeight: 20,
          marginTop: 10,
          textAlign: 'center',
        }}
      >
        {description}
      </Text>
    </>
  );
}
