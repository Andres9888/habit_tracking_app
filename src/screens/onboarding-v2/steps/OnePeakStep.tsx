import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { COPPER, GOLD, IRON } from '../components/PathMarkers';
import { PrimaryCTA } from '../components/PrimaryCTA';
import { RouteRow } from '../components/RouteRow';
import { StepComponentProps } from '../types';

const ROUTES = [
  { copperPercent: 25, days: '21 days', goldPercent: 100, ironPercent: 65, name: 'Easy · 10-min walk' },
  { copperPercent: 12, days: '66 days', goldPercent: 100, ironPercent: 35, name: 'Medium · meditation' },
  { copperPercent: 8, days: '120+ days', goldPercent: 60, ironPercent: 25, name: 'Hard · daily writing' },
];

export function OnePeakStep({ onNext }: StepComponentProps) {
  const { colors } = useThemeColors();

  return (
    <View style={{ flex: 1, justifyContent: 'space-between', paddingTop: 8 }}>
      <View>
        <Text
          accessibilityRole="header"
          style={{
            color: colors.text.primary,
            fontSize: 40,
            fontWeight: '800',
            letterSpacing: -1.2,
            lineHeight: 44,
          }}
        >
          Always one peak{'\n'}to chase.
        </Text>
        <Text
          style={{
            color: colors.text.secondary,
            fontSize: 15,
            lineHeight: 22,
            marginTop: 12,
          }}
        >
          Each route is sized to the habit. After Gold, the next route waits. Novelty isn&rsquo;t your job to find — it&rsquo;s structural.
        </Text>
        <View style={{ marginTop: 24 }}>
          {ROUTES.map((route) => (
            <RouteRow key={route.name} {...route} />
          ))}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 4,
            paddingHorizontal: 4,
          }}
        >
          <Text style={{ color: COPPER, fontSize: 11, fontWeight: '700' }}>Copper</Text>
          <Text style={{ color: IRON, fontSize: 11, fontWeight: '700' }}>Iron</Text>
          <Text style={{ color: GOLD, fontSize: 11, fontWeight: '700' }}>Gold</Text>
        </View>
      </View>
      <PrimaryCTA label="Continue" onPress={onNext} variant="brand" />
    </View>
  );
}
