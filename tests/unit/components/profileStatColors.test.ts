import { getProfileStatColors } from '@/components/SettingsModal/getProfileStatColors';
import { lightColors } from '@/theme/darkColors';

describe('getProfileStatColors', () => {
  it('uses semantic status colors in standard mode', () => {
    const colors = getProfileStatColors(lightColors);

    expect(colors.activeHabits).toBe(lightColors.status.streak);
    expect(colors.flawlessDays).toBe(lightColors.status.success);
    expect(colors.lifetimeCompletions).toBe(lightColors.status.info);
    expect(colors.label).toBe(lightColors.text.secondary);
    expect(colors.borderTop).toBe(lightColors.border);
    expect(colors.divider).toBe(lightColors.border);
  });
});
