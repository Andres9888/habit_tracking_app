/**
 * detailPalette — the hero gradient's last stop must equal the page body in
 * both modes, or the drill-down shows a seam where the hero meets content.
 */

import { buildDetailPalette } from '../detailPalette';
import { darkColors, lightColors } from '../../../theme/darkColors';
import type { SemanticColors } from '../../../theme/darkColors';

const light = lightColors as unknown as SemanticColors;
const dark = darkColors as unknown as SemanticColors;

describe('buildDetailPalette', () => {
  it('ends the hero gradient on the page background in light mode', () => {
    const p = buildDetailPalette(light, false);
    expect(p.heroGradient[2]).toBe(p.body);
    expect(p.body).toBe(light.background);
  });

  it('ends the hero gradient on the page background in dark mode', () => {
    const p = buildDetailPalette(dark, true);
    expect(p.heroGradient[2]).toBe(p.body);
    expect(p.body).toBe(dark.background);
  });

  it('uses the mock warm-peach stops in light mode', () => {
    const p = buildDetailPalette(light, false);
    expect(p.heroGradient[0]).toBe('#F6DEC8');
    expect(p.heroGradient[1]).toBe('#F3E3D2');
  });

  it('keeps every hero stop opaque so the header tint cannot double-composite', () => {
    for (const [colors, isDark] of [
      [light, false],
      [dark, true],
    ] as const) {
      const p = buildDetailPalette(colors, isDark);
      for (const stop of p.heroGradient) {
        expect(stop).toMatch(/^#[0-9A-Fa-f]{6}$/);
      }
    }
  });

  it('has three gradient locations spanning 0 to 1', () => {
    const p = buildDetailPalette(light, false);
    expect(p.heroLocations).toHaveLength(3);
    expect(p.heroLocations[0]).toBe(0);
    expect(p.heroLocations[2]).toBe(1);
  });

  it('exposes distinct add and added CTA colors in both modes', () => {
    for (const [colors, isDark] of [
      [light, false],
      [dark, true],
    ] as const) {
      const p = buildDetailPalette(colors, isDark);
      expect(p.addBg).not.toBe(p.addedBg);
      expect(p.addFg).not.toBe(p.addedFg);
    }
  });
});
