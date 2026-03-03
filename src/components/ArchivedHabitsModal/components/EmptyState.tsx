import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { fontFamilies } from '@/theme/typography';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

const font = fontFamilies.primary.text;

const s = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 64 },
  illustration: { alignItems: 'center', borderRadius: 16, height: 112, justifyContent: 'center', marginBottom: 24, width: 128 },
  emoji: { fontSize: 48 },
  heading: { fontFamily: font, fontSize: 22, fontWeight: '700', letterSpacing: -0.5, marginBottom: 8, textAlign: 'center' as const },
  desc1: { fontFamily: font, fontSize: 15, marginBottom: 4, textAlign: 'center' as const },
  desc2: { fontFamily: font, fontSize: 14, marginBottom: 24, maxWidth: 280, textAlign: 'center' as const },
  tipCard: { borderRadius: 16, borderWidth: 1, flexDirection: 'row' as const, gap: 12, maxWidth: 320, padding: 16, width: '100%' as const },
  tipEmoji: { fontSize: 24 },
  tipContent: { flex: 1 },
  tipTitle: { fontFamily: font, fontSize: 14, fontWeight: '500' as const, marginBottom: 4 },
  tipDesc: { fontFamily: font, fontSize: 12, lineHeight: 18 },
});

export function EmptyState() {
  const { colors, isDark } = useThemeColors();
  const greenBg = isDark ? '#064E3B' : '#ECFDF5';

  return (
    <View style={s.container}>
      <Animated.View entering={anim(0)} style={[s.illustration, { backgroundColor: greenBg }]}>
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
        style={[s.tipCard, { backgroundColor: greenBg, borderColor: isDark ? '#065F46' : '#D1FAE5' }]}
      >
        <Text style={s.tipEmoji}>💚</Text>
        <View style={s.tipContent}>
          <Text style={[s.tipTitle, { color: isDark ? '#6EE7B7' : '#065F46' }]}>Good to Know</Text>
          <Text style={[s.tipDesc, { color: isDark ? '#A7F3D0' : '#047857' }]}>
            Archiving preserves all your progress and streaks. Restore habits anytime and pick up
            right where you left off!
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}
