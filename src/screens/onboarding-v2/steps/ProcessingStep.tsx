import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { HeroHeader } from '../components/HeroHeader';
import { StepComponentProps } from '../types';

const DWELL_MS = 1600;

export function ProcessingStep({ onNext }: StepComponentProps) {
  const { colors } = useThemeColors();

  useEffect(() => {
    const t = setTimeout(onNext, DWELL_MS);
    return () => clearTimeout(t);
  }, [onNext]);

  return (
    <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center', padding: 24 }}>
      <ActivityIndicator color={colors.primary[600]} size="large" />
      <View style={{ marginTop: 32 }}>
        <HeroHeader
          headline="Finding templates that fit you."
          sub="Based on what you said, and what usually works for people like you."
        />
      </View>
    </View>
  );
}
