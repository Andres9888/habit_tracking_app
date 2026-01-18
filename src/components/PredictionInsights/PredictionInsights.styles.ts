import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  bulletPoint: {
    borderRadius: 3,
    height: 6,
    marginTop: 6,
    width: 6,
  },
  confidenceBar: {
    height: 8,
    overflow: 'hidden',
  },
  confidenceContainer: {
    gap: 6,
  },
  confidenceFill: {
    height: '100%',
  },
  container: {
    gap: 16,
  },
  methodologyNote: {
    paddingTop: 8,
  },
  predictionHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  riskBadge: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  suggestionItem: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  suggestionsContainer: {
    paddingTop: 8,
  },
  trendIndicator: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  warningBox: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
});
