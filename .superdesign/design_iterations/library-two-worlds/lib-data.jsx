// lib-data.jsx — shared data, palette, theme + atoms for the Habit Library flow.
const {
  useState: useLibState,
  createContext: createLibCtx,
  useContext: useLibCtx,
} = React;

const lpath = (
  paths,
  { s = 20, c = '#047857', sw = 2, fill = 'none' } = {}
) => (
  <svg
    width={s}
    height={s}
    viewBox='0 0 24 24'
    fill={fill}
    stroke={c}
    strokeWidth={sw}
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    {paths}
  </svg>
);
window.LibIcon = {
  chevL: (p) =>
    lpath(<polyline points='15 18 9 12 15 6' />, {
      s: 22,
      c: T.g700,
      sw: 2.2,
      ...p,
    }),
  chevR: (p) =>
    lpath(<polyline points='9 18 15 12 9 6' />, { s: 18, c: T.g400, ...p }),
  x: (p) =>
    lpath(
      <>
        <line x1='18' y1='6' x2='6' y2='18' />
        <line x1='6' y1='6' x2='18' y2='18' />
      </>,
      p
    ),
  search: (p) =>
    lpath(
      <>
        <circle cx='11' cy='11' r='7' />
        <line x1='21' y1='21' x2='16.65' y2='16.65' />
      </>,
      p
    ),
  bookmark: (p) =>
    lpath(<path d='M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z' />, p),
  share: (p) =>
    lpath(
      <>
        <circle cx='18' cy='5' r='3' />
        <circle cx='6' cy='12' r='3' />
        <circle cx='18' cy='19' r='3' />
        <line x1='8.6' y1='13.5' x2='15.4' y2='17.5' />
        <line x1='15.4' y1='6.5' x2='8.6' y2='10.5' />
      </>,
      p
    ),
  shield: (p) =>
    lpath(
      <>
        <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' />
        <polyline points='9 12 11 14 15 10' />
      </>,
      p
    ),
  file: (p) =>
    lpath(
      <>
        <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
        <polyline points='14 2 14 8 20 8' />
      </>,
      p
    ),
  play: (p) => lpath(<polygon points='6 4 20 12 6 20 6 4' fill={p?.fill} />, p),
  clock: (p) =>
    lpath(
      <>
        <circle cx='12' cy='12' r='9' />
        <polyline points='12 7 12 12 15 14' />
      </>,
      p
    ),
  repeat: (p) =>
    lpath(
      <>
        <polyline points='17 1 21 5 17 9' />
        <path d='M3 11V9a4 4 0 0 1 4-4h14' />
        <polyline points='7 23 3 19 7 15' />
        <path d='M21 13v2a4 4 0 0 1-4 4H3' />
      </>,
      p
    ),
  bars: (p) =>
    lpath(
      <>
        <line x1='5' y1='20' x2='5' y2='15' />
        <line x1='12' y1='20' x2='12' y2='10' />
        <line x1='19' y1='20' x2='19' y2='4' />
      </>,
      p
    ),
  sprout: (p) =>
    lpath(
      <>
        <path d='M7 20h10' />
        <path d='M12 20c0-7 0-10 0-10' />
        <path d='M12 10C12 6 9 4 5 4c0 4 3 6 7 6Z' />
        <path d='M12 14c0-3 2.5-5 6-5 0 3-2.5 5-6 5Z' />
      </>,
      p
    ),
  users: (p) =>
    lpath(
      <>
        <path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' />
        <circle cx='9' cy='7' r='4' />
        <path d='M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
      </>,
      p
    ),
  sparkle: (p) =>
    lpath(
      <path d='M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z' />,
      p
    ),
  wave: (p) => lpath(<path d='M2 12h3l2-6 4 13 3-9 2 2h6' />, p),
  moon: (p) => lpath(<path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' />, p),
  target: (p) =>
    lpath(
      <>
        <circle cx='12' cy='12' r='9' />
        <circle cx='12' cy='12' r='5' />
        <circle cx='12' cy='12' r='1.4' fill={p?.c || '#047857'} />
      </>,
      p
    ),
  leaf: (p) =>
    lpath(
      <>
        <path d='M11 20A7 7 0 0 1 4 13c0-5 4-9 16-9 0 10-5 13-9 13Z' />
        <path d='M8 17c2-4 5-6 8-7' />
      </>,
      p
    ),
  check: (p) => lpath(<polyline points='20 6 9 17 4 12' />, { sw: 2.6, ...p }),
  link: (p) =>
    lpath(
      <>
        <path d='M9 17H7A5 5 0 0 1 7 7h2' />
        <path d='M15 7h2a5 5 0 0 1 0 10h-2' />
        <line x1='8' y1='12' x2='16' y2='12' />
      </>,
      p
    ),
  quote: (p) =>
    lpath(
      <path
        d='M7 7h4v6a4 4 0 0 1-4 4M15 7h4v6a4 4 0 0 1-4 4'
        fill={p?.c || T.g300}
        stroke='none'
      />,
      p
    ),
  plus: (p) =>
    lpath(
      <>
        <line x1='12' y1='5' x2='12' y2='19' />
        <line x1='5' y1='12' x2='19' y2='12' />
      </>,
      { sw: 2.6, ...p }
    ),
  flask: (p) =>
    lpath(
      <>
        <path d='M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3' />
        <line x1='7' y1='16' x2='17' y2='16' />
      </>,
      p
    ),
  sliders: (p) =>
    lpath(
      <>
        <line x1='4' y1='21' x2='4' y2='14' />
        <line x1='4' y1='10' x2='4' y2='3' />
        <line x1='12' y1='21' x2='12' y2='12' />
        <line x1='12' y1='8' x2='12' y2='3' />
        <line x1='20' y1='21' x2='20' y2='16' />
        <line x1='20' y1='12' x2='20' y2='3' />
        <line x1='1' y1='14' x2='7' y2='14' />
        <line x1='9' y1='8' x2='15' y2='8' />
        <line x1='17' y1='16' x2='23' y2='16' />
      </>,
      p
    ),
  zap: (p) =>
    lpath(
      <polygon
        points='13 2 3 14 12 14 11 22 21 10 12 10 13 2'
        fill={p?.fill}
      />,
      p
    ),
  feather: (p) =>
    lpath(
      <>
        <path d='M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z' />
        <line x1='16' y1='8' x2='2' y2='22' />
        <line x1='17.5' y1='15' x2='9' y2='15' />
      </>,
      p
    ),
  arrowDn: (p) =>
    lpath(
      <>
        <line x1='12' y1='5' x2='12' y2='19' />
        <polyline points='19 12 12 19 5 12' />
      </>,
      p
    ),
};

const LIB_ACCENTS = {
  Mind: { l: '#047857', d: '#34D399', g0: '#D7F0E4', g1: '#EAF6F0' },
  Sleep: { l: '#0d9488', d: '#2dd4bf', g0: '#CDF7EE', g1: '#E5F5F0' },
  Focus: { l: '#0891b2', d: '#22d3ee', g0: '#CFF7FB', g1: '#E6F5F7' },
  Health: { l: '#16a34a', d: '#4ade80', g0: '#DCF7E4', g1: '#EAF6EC' },
};
window.libTheme = (category, dark) => {
  const a = LIB_ACCENTS[category] || LIB_ACCENTS.Mind;
  const accent = dark ? a.d : a.l;
  return dark
    ? { accent, g0: `${accent}26`, g1: `${accent}0D` }
    : { accent, g0: a.g0, g1: a.g1 };
};

const LIB_LIGHT = {
  bg: '#F5F1ED',
  card: '#FFFFFF',
  cardAlt: '#FAF8F5',
  border: '#DDD8D2',
  borderMuted: '#E5E2DE',
  divider: '#F1ECE6',
  textPri: '#2D2A26',
  textSec: '#6B6560',
  textTer: '#6E6660',
  g300: '#C4BFB7',
  g400: '#6E6660',
  streak100: '#FEF3CD',
  streak300: '#E8B94D',
  streak700: '#7D5907',
  chipBg: '#FFFFFF',
};
const LIB_DARK = {
  bg: '#111827',
  card: '#1F2937',
  cardAlt: '#232E3F',
  border: '#374151',
  borderMuted: '#2C3645',
  divider: '#2C3645',
  textPri: '#F9FAFB',
  textSec: '#9CA3AF',
  textTer: '#8E95A2',
  g300: '#4B5563',
  g400: '#6B7280',
  streak100: 'rgba(245,158,11,0.15)',
  streak300: '#FBBF24',
  streak700: '#FDE68A',
  chipBg: '#232E3F',
};
window.LibThemeCtx = createLibCtx(LIB_LIGHT);
window.useLibC = () => useLibCtx(window.LibThemeCtx);
window.LIB_PAL = { light: LIB_LIGHT, dark: LIB_DARK };

window.growthMeta = (g) =>
  ({
    simple: { label: 'Builds fast', days: 21 },
    average: { label: 'Steady build', days: 66 },
    complex: { label: 'Long build', days: 120 },
  })[g] || null;

window.LIB_TEMPLATES = [
  {
    id: 'meditation',
    icon: '🧘',
    name: 'Evening meditation',
    category: 'Mind',
    tagline: 'A short nightly sit to downshift before sleep.',
    frequency: 'Daily',
    estimatedMinutes: 5,
    growthType: 'simple',
    popularityScore: 8400,
    authored: true,
    startSmallVersion: 'Just one slow breath, eyes closed.',
    description:
      'A short, guided wind-down that helps your body shift from the busyness of the day into rest.',
    lead: 'Five quiet minutes before bed nudges your nervous system out of fight-or-flight and into rest — the same “relaxation response” that makes it easier to fall asleep and stay even-keeled the next day.',
    evidence:
      'A 2014 JAMA Internal Medicine review of 47 trials found mindfulness meditation produces small-to-moderate reductions in anxiety, depression, and stress.',
    scientificReference:
      'Goyal M, et al. (2014) — Meditation programs for psychological stress and well-being',
    scientificLink: '#',
    youtubeLink: '#',
    cadenceLabel: 'Daily · 5 min · after dinner',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Calmer mind',
        description: 'Consistent practice lowers everyday stress and anxiety.',
      },
      {
        icon: 'moon',
        title: 'Better sleep',
        description: 'Shorter time to fall asleep; fewer nighttime wake-ups.',
      },
      {
        icon: 'target',
        title: 'Sharper focus',
        description: 'Gains in attention and working memory the next day.',
      },
      {
        icon: 'leaf',
        title: 'Steadier mood',
        description: 'Less reactivity and better emotional regulation.',
      },
    ],
    timeline: [
      {
        when: 'First sit',
        title: 'Body settles',
        description:
          'Breathing slows and the relaxation response begins within minutes.',
      },
      {
        when: '~2 weeks',
        title: 'Easier to fall asleep',
        description: 'Sleep latency starts to drop as the routine takes hold.',
      },
      {
        when: '~6 weeks',
        title: 'Less reactive',
        description: 'A noticeable dip in day-to-day stress and rumination.',
      },
      {
        when: '~66 days',
        title: 'Runs on autopilot',
        description: 'The median time for a daily behavior to feel automatic.',
        peak: true,
      },
    ],
    howToStart: [
      'Sit somewhere quiet right after dinner.',
      'Five minutes, eyes closed — just follow your breath.',
      'Same time each night. Consistency beats length.',
    ],
    sources: [
      {
        authors: 'Goyal M, et al.',
        title: 'Meditation programs for psychological stress and well-being',
        journal: 'JAMA Internal Medicine',
        year: '2014',
        link: '#',
      },
      {
        authors: 'Tang YY, Hölzel BK, Posner MI',
        title: 'The neuroscience of mindfulness meditation',
        journal: 'Nature Reviews Neuroscience',
        year: '2015',
        link: '#',
      },
      {
        authors: 'Lally P, et al.',
        title: 'How are habits formed: modelling habit formation',
        journal: 'Eur. J. of Social Psychology',
        year: '2010',
        link: '#',
      },
    ],
  },
  {
    id: 'deepwork',
    icon: '🎯',
    name: 'Deep work block',
    category: 'Focus',
    tagline: 'One protected, distraction-free stretch a day.',
    frequency: 'Daily',
    estimatedMinutes: 90,
    growthType: 'average',
    popularityScore: 6100,
    authored: true,
    startSmallVersion: 'Set a 10-minute timer, phone in another room.',
    description:
      'A single, fiercely-protected block for your most cognitively demanding work — no email, no Slack, no phone.',
    lead: 'Cognitively demanding work improves fastest in long, uninterrupted blocks. Each context-switch drains attention residue that can take 20+ minutes to recover — so one protected block beats a fragmented day.',
    evidence:
      'Research on attention residue (Leroy, 2009) shows that switching tasks leaves part of your attention stuck on the prior task, measurably lowering performance on the next one.',
    scientificReference:
      'Newport C. (2016) — Deep Work: Rules for Focused Success',
    scientificLink: '#',
    cadenceLabel: 'Daily · 90 min · morning',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Faster progress',
        description: 'Hard problems move when attention is unbroken.',
      },
      {
        icon: 'zap',
        title: 'More output',
        description: 'Fewer switches means more finished, higher-quality work.',
      },
      {
        icon: 'wave',
        title: 'Lower stress',
        description: 'A clear block reduces the anxiety of a fragmented day.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Friction',
        description: 'The urge to check things is strong — that’s normal.',
      },
      {
        when: '~3 weeks',
        title: 'Flow comes faster',
        description: 'You settle into the block more quickly each day.',
      },
      {
        when: '~66 days',
        title: 'Default mode',
        description: 'The morning block becomes how you start, automatically.',
        peak: true,
      },
    ],
    howToStart: [
      'Pick the same 90 minutes each morning.',
      'Phone in another room; one task only.',
      'End on time — protect the boundary both ways.',
    ],
    sources: [
      {
        authors: 'Leroy S.',
        title: 'Why is it so hard to do my work? Attention residue',
        journal: 'Org. Behavior and Human Decision Processes',
        year: '2009',
        link: '#',
      },
      {
        authors: 'Newport C.',
        title: 'Deep Work: Rules for Focused Success',
        journal: 'Grand Central Publishing',
        year: '2016',
        link: '#',
      },
    ],
  },
  {
    id: 'coldshower',
    icon: '🚿',
    name: 'Cold shower finish',
    category: 'Health',
    tagline: 'End your shower with 30s of cold.',
    frequency: 'Daily',
    estimatedMinutes: 1,
    growthType: 'simple',
    popularityScore: 3200,
    authored: false,
    description:
      'Finish your normal shower with 30 seconds of cold water to sharpen alertness and build a little daily grit.',
    scientificReference:
      'Buijze GA, et al. (2016) — The effect of cold showering on health',
    startSmallVersion: 'Just 10 seconds of cold at the end.',
  },
  {
    id: 'walk',
    icon: '🚶',
    name: 'Morning walk',
    category: 'Health',
    tagline: 'A short walk to start the day moving.',
    frequency: 'Daily',
    estimatedMinutes: 15,
    growthType: 'simple',
    popularityScore: 5400,
    authored: false,
    description:
      'A gentle 15-minute walk soon after waking — daylight and movement to set your body clock.',
    scientificReference:
      'Huberman A. (2021) — Morning light & circadian timing',
    startSmallVersion: 'Walk to the end of the street and back.',
  },
  {
    id: 'breath',
    icon: '🌬️',
    name: 'Box breathing',
    category: 'Mind',
    tagline: 'Four-count breathing to steady yourself.',
    frequency: 'Daily',
    estimatedMinutes: 3,
    growthType: 'simple',
    popularityScore: 2900,
    authored: false,
    description:
      'Inhale 4, hold 4, exhale 4, hold 4 — a simple pattern to down-regulate stress in a couple of minutes.',
    scientificReference:
      'Zaccaro A, et al. (2018) — Slow breathing & autonomic control',
    startSmallVersion: 'One round: 4 in, 4 hold, 4 out, 4 hold.',
  },
  {
    id: 'read',
    icon: '📖',
    name: 'Read 10 pages',
    category: 'Focus',
    tagline: 'Ten pages a day compounds into shelves.',
    frequency: 'Daily',
    estimatedMinutes: 15,
    growthType: 'average',
    popularityScore: 4700,
    authored: false,
    description:
      'Ten pages a day is ~12 books a year — a tiny, repeatable dose of focused reading.',
    scientificReference: '—',
    startSmallVersion: 'Read a single page before bed.',
  },
];

window.shortCitation = (ref) => {
  if (!ref || ref === '—') return null;
  const m = ref.match(/^(.+?\((\d{4})\))/);
  if (m) {
    const author = m[1]
      .split(/,|\bet al\b/)[0]
      .replace(/\s*\(.*$/, '')
      .trim();
    return `${author} ${m[2]}`;
  }
  return 'Research-backed';
};

window.LibPill = function ({ icon, children, tone }) {
  const c = window.useLibC();
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 11px',
        background: c.chipBg,
        border: `1px solid ${c.border}`,
        borderRadius: T.rFull,
        whiteSpace: 'nowrap',
      }}
    >
      {icon}
      <span
        style={{ ...Ty.caption, fontWeight: 600, color: tone || c.textSec }}
      >
        {children}
      </span>
    </div>
  );
};
window.LibSecLabel = function ({ children, glyph }) {
  const c = window.useLibC();
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        marginBottom: T.md,
      }}
    >
      {glyph}
      <span
        style={{
          fontFamily: 'Literata, Georgia, serif',
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: -0.2,
          color: c.textPri,
        }}
      >
        {children}
      </span>
    </div>
  );
};
window.LibCard = function ({ children, style }) {
  const c = window.useLibC();
  return (
    <div
      style={{
        background: c.cardAlt,
        border: `1px solid ${c.border}`,
        borderRadius: T.rXl,
        boxShadow: T.shadowCard,
        padding: T.base,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
