/**
 * Shared imported-state tint for library rows and cards.
 */

export function getImportedStateColors(isDark: boolean) {
  if (isDark) {
    return {
      backgroundColor: 'rgba(5,150,105,0.15)',
      borderColor: '#6EE7B7',
    };
  }

  return {
    backgroundColor: '#F0FDF6',
    borderColor: '#A7F3D0',
  };
}
