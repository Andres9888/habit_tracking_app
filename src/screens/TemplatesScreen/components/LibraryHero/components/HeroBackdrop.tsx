import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { borderRadius } from '../../../../../theme/spacing';

const HERO_GRADIENT = [
  'rgba(251, 191, 116, 0.55)',
  'rgba(254, 215, 170, 0.30)',
  '#F5F1ED',
] as const;

export function HeroBackdrop() {
  return (
    <View pointerEvents='none' style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={HERO_GRADIENT}
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
