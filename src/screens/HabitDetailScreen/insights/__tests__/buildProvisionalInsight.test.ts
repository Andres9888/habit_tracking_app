import {
  buildProvisionalInsight,
  type HabitScienceFields,
} from '../buildProvisionalInsight';

const SCIENCE: HabitScienceFields = {
  evidence:
    'Walkers who tie this to an existing routine stick with it about twice as long.',
  sources: [{ authors: 'BJ Fogg', title: 'Tiny Habits', year: '2019' }],
  tips: ['Anchor it to something you already do.'],
};

describe('buildProvisionalInsight', () => {
  it('builds a provisional card before day 14 with template science', () => {
    const insight = buildProvisionalInsight(SCIENCE, 3);
    expect(insight).toEqual({
      attribution: 'From the science · Tiny Habits, BJ Fogg',
      body: SCIENCE.evidence,
      daysRemaining: 11,
      fillPct: expect.closeTo((3 / 14) * 100),
      heading: 'Anchor it to something you already do.',
    });
  });

  it('returns null at 14+ days so personal insights take over unchanged', () => {
    expect(buildProvisionalInsight(SCIENCE, 14)).toBeNull();
    expect(buildProvisionalInsight(SCIENCE, 60)).toBeNull();
  });

  it('returns null when there is no template science', () => {
    expect(buildProvisionalInsight(null, 3)).toBeNull();
    expect(buildProvisionalInsight({}, 3)).toBeNull();
  });

  it('falls back through howToStart and evidence when tips are missing', () => {
    const insight = buildProvisionalInsight(
      {
        evidence: 'Evidence sentence.',
        howToStart: ['Start with two minutes after coffee.'],
      },
      5
    );
    expect(insight?.heading).toBe('Start with two minutes after coffee.');
    expect(insight?.body).toBe('Evidence sentence.');
    expect(insight?.attribution).toBeNull();
  });
});
