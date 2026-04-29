/**
 * SmartSuggestions EmptyState — section label above a canonical compact EmptyState.
 */
import { Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { borderRadius } from '@/theme/spacing';
import { typography, fontFamilies, fontWeights } from '@/theme/typography';
import { EmptyState as CanonicalEmptyState } from '../../../EmptyState/EmptyState';

interface EmptyStateProps {
  label: string;
}

export function EmptyState({ label }: EmptyStateProps) {
  const { colors } = useThemeColors();

  return (
    <View style={{ marginBottom: 24 }}>
      <Text
        style={{
          color: colors.text.secondary,
          fontFamily: fontFamilies.primary.text,
          fontSize: typography.bodySmall.fontSize,
          fontWeight: fontWeights.semibold,
          marginBottom: 12,
        }}
      >
        {label}
      </Text>
      <CanonicalEmptyState
        variant='noResults'
        size='compact'
        icon='🎯'
        headline=''
        description='Create your own unique habit!'
        hideCTA
        style={{
          backgroundColor: colors.gray[50],
          borderRadius: borderRadius.card,
          paddingVertical: 24,
        }}
      />
    </View>
  );
}
