/**
 * FeedbackModal Styles
 */

import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import type { SemanticColors } from '../../theme/darkColors';

const WHITE = '#FFFFFF';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 17,
    color: colors.gray[600],
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 12,
  },
  required: {
    color: colors.error,
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: colors.gray[200],
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: WHITE,
  },
  typeCardSelected: {
    backgroundColor: colors.gray[50],
  },
  typeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  typeContent: {
    flex: 1,
  },
  typeLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 2,
  },
  typeDescription: {
    fontSize: 13,
    color: colors.gray[600],
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 12,
    padding: 16,
    fontSize: 17,
    color: colors.gray[900],
    backgroundColor: WHITE,
  },
  textArea: {
    minHeight: 120,
    maxHeight: 200,
  },
  charCount: {
    fontSize: 13,
    color: colors.gray[500],
    textAlign: 'right',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});

/** Theme-aware overrides */
export function themedFeedbackStyles(tc: SemanticColors) {
  return {
    container: { backgroundColor: tc.background },
    headerTitle: { color: tc.text.primary },
    headerSubtitle: { color: tc.text.secondary },
    sectionLabel: { color: tc.text.primary },
    typeCard: { borderColor: tc.gray[200], backgroundColor: tc.card },
    typeCardSelected: { backgroundColor: tc.gray[50] },
    typeLabel: { color: tc.text.primary },
    typeDescription: { color: tc.text.secondary },
    input: { borderColor: tc.gray[300], color: tc.text.primary, backgroundColor: tc.card },
    charCount: { color: tc.text.secondary },
  } as const;
}
