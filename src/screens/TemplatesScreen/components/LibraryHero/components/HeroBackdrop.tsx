import { StyleSheet, View } from 'react-native';
import { absoluteFillObject } from '../../../../../theme/absoluteFillObject';
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

// Soft top sheen — light catches the top edge for quiet depth (light mode only).
const HERO_SHEEN_LIGHT = [
  'rgba(255, 255, 255, 0.35)',
  'rgba(255, 255, 255, 0)',
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
      {isDark ? null : (
        <LinearGradient
          colors={[...HERO_SHEEN_LIGHT]}
          end={{ x: 0.5, y: 1 }}
          locations={[0, 1]}
          start={{ x: 0.5, y: 0 }}
          style={s.sheen}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  gradient: {
    ...absoluteFillObject,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  sheen: {
    height: '55%',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
