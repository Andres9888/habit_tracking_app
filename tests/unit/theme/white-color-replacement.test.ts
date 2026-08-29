/**
 * White / card token replacement
 */

import { colors } from '@/theme/colors';

describe('White color replacement', () => {
  it('treats light.card as warm paper, not pure white', () => {
    expect(colors.light.card.toLowerCase()).toBe('#edeae5');
    expect(colors.light.cardElevated.toLowerCase()).toBe('#ffffff');
    expect(colors.text.inverse.toLowerCase()).toBe('#ffffff');
  });
});
