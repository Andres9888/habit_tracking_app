import { StyleSheet } from 'react-native';
import type { SemanticColors } from '../../../../theme/darkColors';

export const styles = StyleSheet.create({
  checkmark: {
    alignItems: 'center',
    backgroundColor: '#10b981',
    borderRadius: 24,
    height: 80,
    justifyContent: 'center',
    width: 80,
  },
  checkmarkText: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    height: 120,
    justifyContent: 'center',
    width: 120,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    zIndex: 100,
  },
  ring: {
    borderRadius: 9999,
    borderWidth: 3,
    height: 100,
    position: 'absolute',
    width: 100,
  },
  successText: {
    color: '#1c1917',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 24,
  },
});

export function themedSuccessStyles(colors: SemanticColors) {
  return StyleSheet.create({
    ring: {
      borderColor: colors.borders.successStrong,
    },
  });
}
