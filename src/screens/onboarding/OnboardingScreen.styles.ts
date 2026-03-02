import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { fontFamilies, fontWeights } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export const styles = StyleSheet.create({
  bottomContainer: {
    alignItems: 'center',
    gap: 24,
    paddingBottom: spacing['3xl'],
    paddingHorizontal: 32,
  },
  container: {
    backgroundColor: '#FAF8F5',
    flex: 1,
  },
  ctaButton: {
    backgroundColor: colors.primary[600],
    borderRadius: 12,
    elevation: 4,
    paddingHorizontal: 32,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  ctaButtonDisabled: {
    opacity: 0.7,
  },
  ctaText: {
    color: '#FFFFFF',
    fontFamily: fontFamilies.primary.text,
    fontSize: 17,
    fontWeight: fontWeights.semibold,
  },
  dot: {
    borderRadius: 4,
    height: 8,
  },
  dotsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  nextButton: {
    backgroundColor: colors.primary[600],
    borderRadius: 12,
    elevation: 4,
    paddingHorizontal: 48,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  nextText: {
    color: '#FFFFFF',
    fontFamily: fontFamilies.primary.text,
    fontSize: 17,
    fontWeight: fontWeights.semibold,
  },
  page: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  skipButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44,
  },
  skipContainer: {
    position: 'absolute',
    right: 24,
    zIndex: 10,
  },
  skipText: {
    color: '#6B7280',
    fontFamily: fontFamilies.primary.text,
    fontSize: 17,
    fontWeight: '500',
  },
});
