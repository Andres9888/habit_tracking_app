import { Text, View } from 'react-native';
import { resolveWhy } from '../../HabitDetailScreen/components/resolveWhy';
import { useThemeColors } from '../../../theme/ThemeContext';
import {
  fontFamilies,
  fontWeights,
  typography,
} from '../../../theme/typography';
import { COPY } from './MotivationSection.constants';
import type { MotivationDraft } from './motivationDraft';

interface MotivationPreviewProps {
  values: MotivationDraft;
}

export function MotivationPreview({ values }: MotivationPreviewProps) {
  const { colors } = useThemeColors();
  const resolved = resolveWhy(values);
  const empty = resolved === null;

  return (
    <View
      style={{
        backgroundColor: colors.primary[100],
        borderColor: colors.border,
        borderRadius: 16,
        borderWidth: 1,
        marginTop: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
      }}
    >
      <Text
        style={{
          ...typography.caption,
          color: colors.primary[700],
          fontWeight: fontWeights.bold,
          letterSpacing: 0.8,
          textTransform: 'uppercase',
        }}
      >
        {COPY.previewLabel}
      </Text>
      {empty ? (
        <Text
          style={{
            ...typography.bodySmall,
            color: colors.text.tertiary,
            fontStyle: 'italic',
            marginTop: 6,
          }}
        >
          {COPY.emptyPreview}
        </Text>
      ) : (
        <>
          <Text
            style={{
              ...typography.caption,
              color: colors.primary[700],
              fontWeight: fontWeights.bold,
              letterSpacing: 0.6,
              marginTop: 6,
              textTransform: 'uppercase',
            }}
          >
            {resolved.label}
          </Text>
          <Text
            style={{
              color: colors.text.primary,
              fontFamily: fontFamilies.primary.display,
              fontSize: 15,
              fontStyle: 'italic',
              lineHeight: 22,
              marginTop: 3,
            }}
          >
            {resolved.value}
          </Text>
        </>
      )}
    </View>
  );
}
