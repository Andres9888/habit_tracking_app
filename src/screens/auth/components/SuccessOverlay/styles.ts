import { StyleSheet } from 'react-native';
import { typography } from '../../../../theme/typography';

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
    ...typography.displayLarge,
    color: '#ffffff',
<<<<<<< HEAD
    fontSize: 34,
    fontWeight: 'bold',
=======
>>>>>>> bc0f7748 (ui: migrate hardcoded font sizes to typography tokens across auth + template screens)
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
    borderColor: '#10b981',
    borderRadius: 9999,
    borderWidth: 3,
    height: 100,
    position: 'absolute',
    width: 100,
  },
  successText: {
    ...typography.heading2,
    color: '#1c1917',
    fontWeight: '700',
    marginTop: 24,
  },
});
