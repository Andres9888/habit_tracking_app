import { getProfileStatColors } from '@/components/SettingsModal/getProfileStatColors';
import { lightColors } from '@/theme/darkColors';

describe('getProfileStatColors', () => {
  it('uses a neutral semantic text palette in standard mode', () => {
    const colors = getProfileStatColors(lightColors);

    expect(colors.activeHabits).toBe(lightColors.text.primary);
    expect(colors.flawlessDays).toBe(lightColors.text.primary);
    expect(colors.lifetimeCompletions).toBe(lightColors.text.primary);
    expect(colors.label).toBe(lightColors.text.secondary);
    expect(colors.borderTop).toBe(lightColors.border);
    expect(colors.divider).toBe(lightColors.border);
  });
});
