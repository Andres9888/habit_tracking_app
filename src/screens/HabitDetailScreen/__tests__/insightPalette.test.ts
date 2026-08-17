/**
 * Pins the habit-detail palette to the ORIGINAL "Habit Flow Prototype" values.
 *
 * Two revisions drifted these — first to a neutral parchment wash, then to a wash
 * and accents derived from theme tokens — and both were rejected on look. These
 * assertions exist so the next refactor can't quietly do it a third time.
 *
 * The sibling `FullsizeTemplatePreview/__tests__/detailPalette.test.ts` covers the
 * same ground for the template drill-down.
 */
import { colors as corePalette } from '../../../theme/colors';
import { darkColors, lightColors } from '../../../theme/darkColors';
import { buildInsightPalette } from '../insightPalette';

const light = buildInsightPalette(lightColors, false);
const dark = buildInsightPalette(darkColors, true);

describe('buildInsightPalette — the design greens', () => {
  it('uses the mock single green #0C7C59 for both roles in light mode', () => {
    expect(light.green).toBe('#0C7C59');
    expect(light.ctaGreen).toBe('#0C7C59');
  });

  it('is deliberately NOT the theme split — see the file comment', () => {
    // Documents the rejected alternative so the intent survives.
    expect(light.ctaGreen).not.toBe(lightColors.primary[600]); // #059669
    expect(light.green).not.toBe(corePalette.success); // #15793C
  });

  it('keeps the two fields present so re-splitting stays one line', () => {
    expect(light).toHaveProperty('ctaGreen');
    expect(light).toHaveProperty('green');
  });

  it('falls back to theme greens in dark mode', () => {
    expect(dark.green).toBe(darkColors.primary[500]);
  });
});

describe('buildInsightPalette — surfaces', () => {
  it('uses the pure-white card, not the warm paper fill', () => {
    expect(light.card).toBe(corePalette.light.cardElevated); // #FFFFFF
    expect(light.card).not.toBe(lightColors.cardPaper); // #F8F5F1, rejected
    expect(dark.card).toBe(darkColors.card);
  });

  it('never leaves a value undefined', () => {
    for (const palette of [light, dark]) {
      for (const [key, value] of Object.entries(palette)) {
        if (key === 'bandLocations') continue;
        expect(value).toBeDefined();
      }
    }
  });
});

describe('buildInsightPalette — hero wash', () => {
  it('restores the mock mint exactly in light mode', () => {
    expect(light.bandGradient[0]).toBe('#E3EDE6');
    expect(light.bandGradient[1]).toBe('#EDF0E9');
    expect(light.bandGradientDone[0]).toBe('#D9EBDF');
    expect(light.bandGradientDone[1]).toBe('#E9EFE7');
  });

  it('restores the mock band ink and chrome', () => {
    expect(light.bandFg).toBe('#23211C');
    expect(light.bandMuted).toBe('#5A6B5D');
    expect(light.bandHairline).toBe('#C9D6CB');
    expect(light.dialTrack).toBe('#D3DFD5');
  });

  // FullsizeTemplatePreview/components/PreviewContent.tsx:29-30 — the header
  // tint, hero stop 0 and the ScrollView overscroll tint all read stop 0, so an
  // alpha stop would composite three times and show a seam. This one is a
  // correctness rule, not a style choice.
  it('uses opaque hex for every stop in both modes', () => {
    const stops = [
      ...light.bandGradient,
      ...light.bandGradientDone,
      ...dark.bandGradient,
      ...dark.bandGradientDone,
    ];
    for (const stop of stops) {
      expect(stop).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it('settles into the page background on its last stop', () => {
    expect(light.bandGradient[2]).toBe(lightColors.background);
    expect(light.bandGradientDone[2]).toBe(lightColors.background);
    expect(dark.bandGradient[2]).toBe(darkColors.background);
    expect(dark.bandGradientDone[2]).toBe(darkColors.background);
  });

  it('deepens the wash once today is logged', () => {
    expect(light.bandGradientDone[0]).not.toBe(light.bandGradient[0]);
    expect(dark.bandGradientDone[0]).not.toBe(dark.bandGradient[0]);
  });

  it('exposes stop positions so components never hardcode them', () => {
    expect(light.bandLocations).toEqual([0, 0.7, 1]);
  });
});

describe('buildInsightPalette — the design amber', () => {
  it('uses the mock orange, not the app burnished gold', () => {
    expect(light.amberBar).toBe('#E5893B');
    expect(light.amber).toBe('#B0723A');
    expect(light.amberBg).toBe('#FBF0E3');
    expect(light.amberBorder).toBe('#F0DFC8');
    expect(light.amberBar).not.toBe(corePalette.streak[300]); // #E8B94D, rejected
  });

  it('keeps the dial arc on the mock value while today is open', () => {
    expect(light.dialArc).toBe('#F5A25B');
  });
});

describe('buildInsightPalette — remaining mock neutrals', () => {
  it('restores the heatmap and week-dot values', () => {
    expect(light.cellEmpty).toBe('#F0EDE4');
    expect(light.cellFuture).toBe('#F7F5EF');
    expect(light.missedRing).toBe('#D6CFC3');
    expect(light.greenWash).toBe('#E8F2EC');
    expect(light.greenSoft).toBe('#8FC3AB');
    expect(light.greenTint).toBe('#CFE3D8');
    expect(light.onGreenMuted).toBe('#BFE3D2');
  });
});
