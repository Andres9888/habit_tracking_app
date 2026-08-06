import { StyleSheet } from 'react-native';
import { borderRadius } from '../../../theme/spacing';

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    borderRadius: borderRadius.xs,
    height: 8,
    position: 'absolute',
    width: 8,
  },
});
