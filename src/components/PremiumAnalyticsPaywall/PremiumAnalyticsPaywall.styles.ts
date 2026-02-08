/**
 * PremiumAnalyticsPaywall Styles
 */

import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { screenWidth, screenHeight } from './PremiumAnalyticsPaywall.constants';

export const styles = StyleSheet.create({
  blurView: {
    height: screenHeight,
    width: screenWidth,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  content: {
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  featuresList: {
    marginBottom: spacing.xl,
  },
  header: {
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
});
