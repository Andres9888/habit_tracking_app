import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { estimatePath } from '../data/pathLength';
import { DemoTemplate } from '../useDemoTemplates';

interface DemoCardProps {
  template: DemoTemplate;
}

export function DemoCard({ template }: DemoCardProps) {
  const { colors } = useThemeColors();
  const hasScience = Boolean(template.scientificReference);
  const path = estimatePath(template.name);

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
        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 8 }}>
          <View
            style={{
              backgroundColor: 'rgba(184, 115, 51, 0.12)',
              borderRadius: 100,
              paddingHorizontal: 8,
              paddingVertical: 3,
            }}
          >
            <Text style={{ color: '#8B5A2B', fontSize: 11, fontWeight: '700' }}>
              ~{path.days} days · {path.difficultyLabel}
            </Text>
          </View>
          {hasScience ? (
            <View
              style={{
                backgroundColor: colors.primary[100],
                borderRadius: 100,
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
        </View>
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
