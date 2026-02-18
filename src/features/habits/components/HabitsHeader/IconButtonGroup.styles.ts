import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  buttonPressed: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  buttonUnpressed: {
    backgroundColor: 'transparent',
  },
  containerDark: {
    backgroundColor: 'rgba(31,41,55,0.8)',
    borderColor: '#374151',
  },
  label: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  settingsButton: {
    alignItems: 'center',
    borderColor: '#e7e5e4',
    borderRadius: 12,
    borderWidth: 1,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  templatesButton: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    height: 38,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  templatesButtonPressed: {
    backgroundColor: '#6d28d9',
  },
  templatesButtonUnpressed: {
    backgroundColor: '#7c3aed',
  },
});
