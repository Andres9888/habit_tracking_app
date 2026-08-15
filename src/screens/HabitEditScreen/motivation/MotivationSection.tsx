import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { fontWeights, typography } from '../../../theme/typography';
import { MotivationField } from './MotivationField';
import { MotivationPreview } from './MotivationPreview';
import { WoopIntro } from './WoopIntro';
import {
  COPY,
  DETAIL_FIELDS,
  WOOP_FIELDS,
} from './MotivationSection.constants';
import type { MotivationSectionProps } from './MotivationSection.types';

function SectionLabel({ children }: { children: string }) {
  const { colors } = useThemeColors();
  return (
    <Text
      style={{
        ...typography.caption,
        color: colors.text.tertiary,
        fontWeight: fontWeights.bold,
        letterSpacing: 1.2,
        marginBottom: 8,
        marginLeft: 4,
        textTransform: 'uppercase',
      }}
    >
      {children}
    </Text>
  );
}

function FieldCard({ children }: { children: ReactNode }) {
  const { colors } = useThemeColors();
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderRadius: 20,
        borderWidth: 1,
        overflow: 'hidden',
      }}
    >
      {children}
    </View>
  );
}

export function MotivationSection({
  onChange,
  values,
}: MotivationSectionProps) {
  const { colors } = useThemeColors();

  return (
    <View style={{ marginTop: 8, paddingHorizontal: 24 }}>
      <SectionLabel>{COPY.detailLabel}</SectionLabel>
      <FieldCard>
        {DETAIL_FIELDS.map((field) => (
          <MotivationField
            key={field.key}
            hint={field.hint}
            label={field.label}
            maxLength={field.maxLength}
            short={field.short}
            value={values[field.key]}
            onChange={(text) => onChange(field.key, text)}
          />
        ))}
      </FieldCard>
      <MotivationPreview values={values} />

      <View style={{ marginTop: 20 }}>
        <SectionLabel>{COPY.woopSection}</SectionLabel>
        <WoopIntro />
        <FieldCard>
          {WOOP_FIELDS.map((field) => (
            <MotivationField
              key={field.key}
              hint={field.hint}
              label={field.label}
              maxLength={field.maxLength}
              short={field.short}
              value={values[field.key]}
              onChange={(text) => onChange(field.key, text)}
            />
          ))}
        </FieldCard>
      </View>

      <Text
        style={{
          ...typography.caption,
          color: colors.text.tertiary,
          lineHeight: 18,
          marginTop: 14,
        }}
      >
        {COPY.footnote}
      </Text>
    </View>
  );
}
