import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

interface TestimonialCardProps {
  initials: string;
  meta: string;
  name: string;
  quote: string;
}

export function TestimonialCard({
  initials,
  meta,
  name,
  quote,
}: TestimonialCardProps) {
  const { colors } = useThemeColors();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 12,
        padding: 16,
      }}
    >
      <View
        style={{ alignItems: 'center', flexDirection: 'row', gap: 12, marginBottom: 12 }}
      >
        <View
          style={{
            alignItems: 'center',
            backgroundColor: colors.primary[600],
            borderRadius: 18,
            height: 36,
            justifyContent: 'center',
            width: 36,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '700' }}>
            {initials}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{ color: colors.text.primary, fontSize: 14, fontWeight: '600' }}
          >
            {name}
          </Text>
          <Text style={{ color: colors.text.tertiary, fontSize: 12 }}>{meta}</Text>
        </View>
      </View>
      <Text
        style={{ color: colors.text.secondary, fontSize: 14, lineHeight: 21 }}
      >
        {quote}
      </Text>
    </View>
  );
}
