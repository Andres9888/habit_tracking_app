import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 16,
  },
  habitCard: {
    borderRadius: 8,
    marginBottom: 8,
    padding: 12,
  },
  habitInfo: {
    marginBottom: 6,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  header: {
    marginBottom: 12,
  },
  interventionBadge: {
    alignSelf: 'flex-start',
  },
  interventionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  prediction: {
    fontSize: 14,
  },
  subtitle: {
    fontSize: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  viewAllButton: {
    marginTop: 8,
    paddingVertical: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
