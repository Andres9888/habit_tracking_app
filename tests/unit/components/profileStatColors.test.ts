import { getProfileStatColors } from '@/components/SettingsModal/getProfileStatColors';
import { lightColors } from '@/theme/darkColors';
import { highContrastColors } from '@/theme/highContrastColors';

describe('getProfileStatColors', () => {
  it('uses semantic status colors in standard mode', () => {
    const colors = getProfileStatColors(lightColors, false);

    expect(colors.activeHabits).toBe(lightColors.status.streak);
    expect(colors.flawlessDays).toBe(lightColors.status.success);
    expect(colors.lifetimeCompletions).toBe(lightColors.status.info);
    expect(colors.label).toBe(lightColors.text.secondary);
    expect(colors.borderTop).toBe(lightColors.border);
    expect(colors.divider).toBe(lightColors.border);
  });

  it('uses high-contrast borders and readable label colors', () => {
    const colors = getProfileStatColors(lightColors, true);

    expect(colors.borderTop).toBe(highContrastColors.border);
    expect(colors.divider).toBe(highContrastColors.border);
    expect(colors.label).toBe(lightColors.text.secondary);
    expect(colors.activeHabits).toBe(lightColors.status.streakText);
    expect(colors.flawlessDays).toBe(lightColors.status.successText);
    expect(colors.lifetimeCompletions).toBe(lightColors.status.infoText);
  });
});
