import { useState } from 'react';
import { Text, View } from 'react-native';
import { spacing } from '@/theme/spacing';
import { useThemeColors } from '@/theme/ThemeContext';

import { RevenueCatPaywall } from '@/components/RevenueCatPaywall';
import { HeroHeader } from '../components/HeroHeader';
import { PrimaryCTA } from '../components/PrimaryCTA';
import { useTemplateAutoImport } from '../useTemplateAutoImport';
import { StepComponentProps } from '../types';

export function PaywallStep({ answers, onNext }: StepComponentProps) {
  const { colors } = useThemeColors();
  const [paywallVisible, setPaywallVisible] = useState(false);

  const { failedCount, retry } = useTemplateAutoImport(
    answers.pickedTemplateIds
  );

  const finishAndExit = () => {
    setPaywallVisible(false);
    onNext();
  };

  return (
    <View style={{ flex: 1, justifyContent: 'space-between' }}>
      <View>
        <HeroHeader
          headline="Try ChainDay free."
          sub="Enough time to see your first habit hit iron."
        />
        <View style={{ gap: 10, marginTop: 20 }}>
          {[
            'Unlimited habits · the full copper → legendary progression',
            '200+ science-backed templates · research & videos on each',
            'Smart reminders for the habits you picked',
          ].map((line) => (
            <View
              key={line}
              style={{ alignItems: 'flex-start', flexDirection: 'row', gap: 10 }}
            >
              <Text style={{ color: colors.primary[600], fontSize: 16 }}>✓</Text>
              <Text
                style={{ color: colors.text.primary, flex: 1, fontSize: 14, lineHeight: 20 }}
              >
                {line}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <View style={{ paddingTop: spacing.md }}>
        {failedCount > 0 && (
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              gap: spacing.sm,
              justifyContent: 'center',
              paddingBottom: spacing.md,
            }}
          >
            <Text style={{ color: colors.text.secondary, fontSize: 13 }}>
              {failedCount === 1
                ? "A starter habit didn't import."
                : `${failedCount} starter habits didn't import.`}
            </Text>
            <Text
              onPress={retry}
              style={{ color: colors.primary[600], fontSize: 13, padding: spacing.xs }}
            >
              Retry
            </Text>
          </View>
        )}
        <PrimaryCTA
          label="See pricing"
          onPress={() => setPaywallVisible(true)}
          variant="brand"
        />
        <View style={{ alignItems: 'center', paddingTop: spacing.md }}>
          <Text
            onPress={finishAndExit}
            style={{ color: colors.text.secondary, fontSize: 14, padding: spacing.xs }}
          >
            Continue without premium
          </Text>
        </View>
      </View>
      <RevenueCatPaywall
        onClose={() => setPaywallVisible(false)}
        onPurchaseSuccess={finishAndExit}
        onRestoreSuccess={finishAndExit}
        visible={paywallVisible}
      />
    </View>
  );
}
