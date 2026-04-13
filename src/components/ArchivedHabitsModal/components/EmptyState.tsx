import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '@/theme/ThemeContext';
import { borderRadius } from '@/theme/spacing';
import { typography, fontWeights } from '@/theme/typography';

const anim = (delay: number) => FadeInUp.duration(280).delay(delay).springify().damping(18);

const s = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, paddingVertical: 64 },
  icon: { alignItems: 'center', borderRadius: 24, height: 80, justifyContent: 'center', marginBottom: 28, width: 80 },
  heading: { ...typography.heading3, fontWeight: fontWeights.bold, letterSpacing: -0.3, marginBottom: 8, textAlign: 'center' as const },
  desc: { ...typography.bodySmall, lineHeight: 21, marginBottom: 28, maxWidth: 260, textAlign: 'center' as const },
  tipCard: { borderRadius: borderRadius.card, flexDirection: 'row' as const, gap: 12, padding: 16, width: '100%' as const },
  tipTitle: { ...typography.caption, fontWeight: fontWeights.semibold, marginBottom: 3 },
  tipDesc: { ...typography.caption, lineHeight: 19 },
});

export function EmptyState() {
  const { colors, isDark } = useThemeColors();
  const muted = isDark ? colors.gray[200] : '#F0ECE6';
  const tipText = isDark ? colors.text.secondary : '#6E6660';

  return (
    <View style={s.container}>
      <Animated.View entering={anim(0)} style={[s.icon, { backgroundColor: muted }]}>
        <Text style={{ fontSize: 36 }}>🌱</Text>
      </Animated.View>
      <Animated.Text entering={anim(60)} style={[s.heading, { color: colors.text.primary }]}>
        All habits are active
      </Animated.Text>
      <Animated.Text entering={anim(120)} style={[s.desc, { color: colors.text.secondary }]}>
        Swipe left on any habit to archive it. Your progress and streaks are always preserved.
      </Animated.Text>
      <Animated.View entering={anim(180)} style={[s.tipCard, { backgroundColor: isDark ? colors.gray[100] : '#F7F5F2' }]}>
        <Text style={{ fontSize: 20, marginTop: 1 }}>💡</Text>
        <View style={{ flex: 1 }}>
          <Text style={[s.tipTitle, { color: tipText }]}>Tip</Text>
          <Text style={[s.tipDesc, { color: colors.text.tertiary }]}>
            Archiving is reversible. Restore any habit and pick up right where you left off.
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}
