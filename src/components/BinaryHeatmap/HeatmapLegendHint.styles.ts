import { Dimensions, StyleSheet } from 'react-native';
import { borderRadius, spacing } from '@/theme/spacing';
import { typography, fontFamilies, fontWeights } from '@/theme/typography';
import { CELL_BORDER_RADIUS } from './constants';

const SCREEN_WIDTH = Dimensions.get('window').width;
export const LEGEND_HINT_CARD_WIDTH = Math.min(280, SCREEN_WIDTH - 32);
export const LEGEND_HINT_GAP = 8;
export const LEGEND_HINT_ARROW = 7;
const SWATCH = 14;

export const legendHintStyles = StyleSheet.create({
  arrow: {
    borderBottomWidth: LEGEND_HINT_ARROW,
    borderLeftColor: 'transparent',
    borderLeftWidth: LEGEND_HINT_ARROW,
    borderRightColor: 'transparent',
    borderRightWidth: LEGEND_HINT_ARROW,
    height: 0,
    position: 'absolute',
    top: -LEGEND_HINT_ARROW,
    width: 0,
  },
  backdrop: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  body: { alignItems: 'stretch', width: '100%' },
  button: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
  },
  buttonText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: fontWeights.semibold,
  },
  card: {
    borderRadius: borderRadius.large,
    padding: spacing.md,
    position: 'absolute',
    width: LEGEND_HINT_CARD_WIDTH,
  },
  label: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.bodySmall.fontSize,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.bodySmall.fontSize,
    marginBottom: spacing.md,
  },
  swatch: { borderRadius: CELL_BORDER_RADIUS, height: SWATCH, width: SWATCH },
  title: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.body.fontSize,
    fontWeight: fontWeights.bold,
    marginBottom: spacing.xs,
  },
});
