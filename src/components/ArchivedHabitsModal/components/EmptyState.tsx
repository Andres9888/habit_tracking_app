import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { typography, fontWeights } from '@/theme/typography';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

const s = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 64 },
  illustration: { alignItems: 'center', borderRadius: 16, height: 112, justifyContent: 'center', marginBottom: 24, width: 128 },
  emoji: { fontSize: 34 },
  heading: { ...typography.heading2, fontWeight: fontWeights.bold, letterSpacing: -0.5, marginBottom: 8, textAlign: 'center' as const },
  desc1: { ...typography.bodySmall, marginBottom: 4, textAlign: 'center' as const },
  desc2: { ...typography.bodySmall, marginBottom: 24, maxWidth: 280, textAlign: 'center' as const },
  tipCard: { borderRadius: 16, borderWidth: 1, flexDirection: 'row' as const, gap: 12, maxWidth: 320, padding: 16, width: '100%' as const },
  tipEmoji: { fontSize: 22 },
  tipContent: { flex: 1 },
  tipTitle: { ...typography.bodySmall, fontWeight: fontWeights.medium, marginBottom: 4 },
  tipDesc: { ...typography.caption },
});

export function EmptyState() {
  const { colors } = useThemeColors();

  return (
    <View style={s.container}>
      <Animated.View entering={anim(0)} style={[s.illustration, { backgroundColor: colors.status.successLight }]}>
        <Text style={s.emoji}>🌱</Text>
      </Animated.View>

      <Animated.Text entering={anim(60)} style={[s.heading, { color: colors.text.primary }]}>
        All Habits Are Active!
      </Animated.Text>
      <Animated.Text entering={anim(120)} style={[s.desc1, { color: colors.text.secondary }]}>
        Swipe left on any habit to archive it for safekeeping.
      </Animated.Text>
      <Animated.Text entering={anim(180)} style={[s.desc2, { color: colors.text.secondary }]}>
        Your progress is always preserved.
      </Animated.Text>

      <Animated.View
        entering={anim(240)}
        style={[s.tipCard, { backgroundColor: colors.status.successLight, borderColor: colors.primary[100] }]}
      >
        <Text style={s.tipEmoji}>💚</Text>
        <View style={s.tipContent}>
          <Text style={[s.tipTitle, { color: colors.primary[700] }]}>Good to Know</Text>
          <Text style={[s.tipDesc, { color: colors.primary[700] }]}>
            Archiving preserves all your progress and streaks. Restore habits anytime and pick up
            right where you left off!
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}
