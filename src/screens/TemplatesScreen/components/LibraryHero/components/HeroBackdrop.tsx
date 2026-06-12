import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '../../../../../theme/ThemeContext';
import { borderRadius } from '../../../../../theme/spacing';

const HERO_GRADIENT_LIGHT = [
  'rgba(251, 191, 116, 0.55)',
  'rgba(254, 215, 170, 0.30)',
  '#F5F1ED',
] as const;

const HERO_GRADIENT_DARK = [
  'rgba(245, 158, 11, 0.16)',
  'rgba(245, 158, 11, 0.05)',
  '#111827',
] as const;

export function HeroBackdrop() {
  const { isDark } = useThemeColors();

  return (
    <View pointerEvents='none' style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={isDark ? [...HERO_GRADIENT_DARK] : [...HERO_GRADIENT_LIGHT]}
        end={{ x: 0.5, y: 1 }}
        locations={[0, 0.45, 1]}
        start={{ x: 0.5, y: 0 }}
        style={s.gradient}
      />
      {/* TODO(Phase 1.5): Skip grain until the shared texture asset is ready. */}
    </View>
  );
}

const s = StyleSheet.create({
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
});
