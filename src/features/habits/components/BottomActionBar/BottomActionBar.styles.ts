import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  addButton: {
    alignItems: 'center',
    backgroundColor: '#059669',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    marginTop: -16,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    width: 48,
  },
  addButtonBorder: {
    borderColor: 'rgba(255, 255, 255, 0.97)',
    borderWidth: 3,
  },
  addButtonBorderDark: {
    borderColor: 'rgba(23, 23, 23, 0.97)',
    borderWidth: 3,
  },
  addButtonPressed: {
    backgroundColor: '#047857',
  },
  container: {
    alignItems: 'center',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'visible',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  iconButtonDark: {
    backgroundColor: 'rgba(31,41,55,0.8)',
    borderColor: '#374151',
  },
  iconButtonLight: {
    backgroundColor: 'transparent',
    borderColor: '#e7e5e4',
  },
  iconButtonPressed: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  leftSection: {
    alignItems: 'center',
    flexDirection: 'row',
    flexShrink: 1,
    gap: 8,
  },
  rightSection: {
    alignItems: 'center',
    flexDirection: 'row',
    flexShrink: 0,
    gap: 8,
    overflow: 'visible',
  },
  summaryCompact: {
    fontFamily: 'System',
    fontSize: 13,
    fontWeight: '700',
  },
  summarySub: {
    fontFamily: 'System',
    fontSize: 10,
    fontWeight: '500',
  },
  templatesButton: {
    alignItems: 'center',
    backgroundColor: '#7c3aed',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 4,
    height: 32,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  templatesButtonPressed: {
    backgroundColor: '#6d28d9',
  },
  templatesLabel: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
});
