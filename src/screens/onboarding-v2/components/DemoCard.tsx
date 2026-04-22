import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { DemoTemplate } from '../useDemoTemplates';

interface DemoCardProps {
  template: DemoTemplate;
}

export function DemoCard({ template }: DemoCardProps) {
  const { colors } = useThemeColors();
  const hasScience = Boolean(template.scientificReference);

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderRadius: 20,
        borderWidth: 1.5,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          alignItems: 'center',
          backgroundColor: template.iconColor,
          height: 140,
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 56 }}>{template.icon}</Text>
      </View>
      <View style={{ padding: 18 }}>
        {hasScience ? (
          <View
            style={{
              alignSelf: 'flex-start',
              backgroundColor: colors.primary[100],
              borderRadius: 100,
              marginBottom: 8,
              paddingHorizontal: 8,
              paddingVertical: 3,
            }}
          >
            <Text
              style={{ color: colors.primary[700], fontSize: 11, fontWeight: '600' }}
            >
              Science-backed
            </Text>
          </View>
        ) : null}
        <Text
          style={{
            color: colors.text.primary,
            fontSize: 17,
            fontWeight: '700',
            letterSpacing: -0.2,
            marginBottom: 4,
          }}
        >
          {template.name}
        </Text>
        <Text
          numberOfLines={3}
          style={{ color: colors.text.secondary, fontSize: 13, lineHeight: 19 }}
        >
          {template.description}
        </Text>
      </View>
    </View>
  );
}
