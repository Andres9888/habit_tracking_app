import { StyleSheet } from 'react-native';
import { absoluteFillObject } from '../../../theme/absoluteFillObject';
import { borderRadius } from '../../../theme/spacing';

export const styles = StyleSheet.create({
  container: {
    ...absoluteFillObject,
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
