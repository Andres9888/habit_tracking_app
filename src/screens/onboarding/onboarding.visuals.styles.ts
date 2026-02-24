import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { fontFamilies } from '../../theme/typography';

export const visualStyles = StyleSheet.create({
  chainContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: -4,
  },
  chainLink: {
    alignItems: 'center',
    borderRadius: 16,
    height: 52,
    justifyContent: 'center',
    marginHorizontal: -2,
    width: 36,
  },
  chainLinkInner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 36,
    width: 20,
  },
  strengthBar: {
    backgroundColor: colors.primary[600],
    borderRadius: 8,
    height: 32,
  },
  strengthContainer: {
    gap: 12,
    paddingHorizontal: 16,
    width: '100%',
  },
  strengthLabel: {
    color: '#57534e',
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    fontWeight: '500',
  },
  strengthLabelActive: {
    color: colors.primary[700],
    fontWeight: '700',
  },
  strengthRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  subtitle: {
    color: '#6B7280',
    fontFamily: fontFamilies.primary.text,
    fontSize: 17,
    lineHeight: 24,
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  templateEmoji: {
    fontSize: 22,
  },
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
    width: 280,
  },
  templateItem: {
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    elevation: 2,
    height: 56,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    width: 56,
  },
  title: {
    color: colors.primary[700],
    fontFamily: fontFamilies.primary.display,
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 12,
    textAlign: 'center',
  },
  visualContainer: {
    alignItems: 'center',
    height: 280,
    justifyContent: 'center',
    marginBottom: 40,
  },
});
