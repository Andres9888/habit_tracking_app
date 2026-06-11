import { StyleSheet } from 'react-native';
import { borderRadius } from '../../../../theme/spacing';
import { fontWeights, typography } from '../../../../theme/typography';

export const styles = StyleSheet.create({
  label: {
    ...typography.caption,
    color: '#1D4ED8',
    fontSize: 11.5,
    fontWeight: fontWeights.bold,
  },
  pill: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});
