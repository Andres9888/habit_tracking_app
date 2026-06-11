import { StyleSheet } from 'react-native';
import { borderRadius } from '../../../../theme/spacing';
import { fontWeights, typography } from '../../../../theme/typography';

export const styles = StyleSheet.create({
  label: {
    ...typography.caption,
    fontSize: 11.5,
    fontWeight: fontWeights.bold,
  },
  pill: {
    borderRadius: borderRadius.full,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});
