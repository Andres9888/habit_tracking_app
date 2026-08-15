/**
 * SettingsRow press feedback
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC = path.resolve(__dirname, '../../../src');
const source = fs.readFileSync(
  path.join(SRC, 'components/SettingsModal/SettingsRow/SettingsRow.tsx'),
  'utf-8'
);

describe('SettingsRow uses AnimatedPressable', () => {
  it('imports AnimatedPressable and wraps pressable rows', () => {
    expect(source).toMatch(
      /import\s+\{[^}]*AnimatedPressable[^}]*\}\s+from\s+['"]\.\.\/\.\.\/ui\/AnimatedPressable['"]/
    );
    expect(source).toContain('<AnimatedPressable');
    expect(source).toContain('</AnimatedPressable>');
    expect(source).not.toMatch(/TouchableOpacity/);
    expect(source).not.toContain('activeOpacity');
  });

  it('preserves accessibility and press handler', () => {
    expect(source).toContain("accessibilityRole='button'");
    expect(source).toContain('onPress={handleNavPress}');
  });

  it('returns non-pressable content for toggle / static info', () => {
    expect(source).toMatch(/type\s*===\s*['"]toggle['"]/);
    expect(source).toMatch(/type\s*===\s*['"]info['"]/);
  });
});
