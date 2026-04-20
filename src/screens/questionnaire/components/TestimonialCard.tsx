import { Text, View } from 'react-native';

import { useThemeColors } from '@/theme';

import type { Testimonial } from '../data/testimonials';

interface Props {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: Props) {
  const { colors } = useThemeColors();

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderRadius: 14,
        borderWidth: 1,
        marginBottom: 12,
        padding: 16,
      }}
    >
      <View
        style={{ alignItems: 'center', flexDirection: 'row', marginBottom: 10 }}
      >
        <View
          style={{
            alignItems: 'center',
            backgroundColor: colors.primary[100],
            borderRadius: 999,
            height: 36,
            justifyContent: 'center',
            marginRight: 10,
            width: 36,
          }}
        >
          <Text
            style={{
              color: colors.primary[700],
              fontSize: 13,
              fontWeight: '700',
            }}
          >
            {testimonial.initials}
          </Text>
        </View>
        <Text
          style={{ color: colors.text.secondary, fontSize: 13, fontWeight: '500' }}
        >
          {testimonial.personaTag}
        </Text>
      </View>
      <Text
        style={{ color: colors.text.primary, fontSize: 15, lineHeight: 21 }}
      >
        “{testimonial.quote}”
      </Text>
    </View>
  );
}
