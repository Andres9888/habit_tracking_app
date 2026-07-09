(function () {
  const { useState } = React;
  const I = window.LibIcon;
  const chevD = ({ s = 14, c = '#9A938C', sw = 2 } = {}) => (
    <svg
      width={s}
      height={s}
      viewBox='0 0 24 24'
      fill='none'
      stroke={c}
      strokeWidth={sw}
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <polyline points='6 9 12 15 18 9' />
    </svg>
  );
  const sans = '"DM Sans", system-ui, sans-serif';
  const serif = 'Literata, Georgia, serif';

  window.LIB_PATHS = [
    {
      id: 'sleep-reset',
      emoji: '😴',
      name: 'Sleep Reset',
      weeks: 3,
      bg: '#EFF6FF',
      fg: '#1E3A5F',
      tagline: 'Wind down, rest fully, wake refreshed',
      steps: [
        {
          week: 1,
          habit: 'noscreens',
          why: 'Fix the input first — blue light delays melatonin by ~90 minutes.',
        },
        {
          week: 2,
          habit: 'read',
          why: 'Replace the scroll with something that drops your heart rate.',
        },
        {
          week: 3,
          habit: 'meditation',
          why: 'A short sit builds the buffer that keeps stress out of bed.',
        },
      ],
    },
    {
      id: 'morning-energy',
      emoji: '⚡',
      name: 'Morning Energy',
      weeks: 3,
      bg: '#FEF3C7',
      fg: '#78350F',
      tagline: 'Routines that keep you sharp all day',
      steps: [
        {
          week: 1,
          habit: 'hydration',
          why: 'Rehydrate before caffeine — the easiest win in the library.',
        },
        {
          week: 2,
          habit: 'walk',
          why: 'Morning light anchors your body clock.',
        },
        {
          week: 3,
          habit: 'coldshower',
          why: 'A controlled stressor that trains alertness.',
        },
      ],
    },
    {
      id: 'calm-mind',
      emoji: '🧘',
      name: 'Calm Mind',
      weeks: 3,
      bg: '#F0FDF4',
      fg: '#14532D',
      tagline: 'Regulate the body, then the mind',
      steps: [
        {
          week: 1,
          habit: 'breath',
          why: 'Slow exhales activate the vagus nerve in minutes.',
        },
        {
          week: 2,
          habit: 'meditation',
          why: 'Small daily sits lower baseline anxiety.',
        },
        {
          week: 3,
          habit: 'journal',
          why: 'Naming feelings reduces their grip — three lines is enough.',
        },
      ],
    },
  ];
  window.libPathById = (id) => window.LIB_PATHS.find((p) => p.id === id);

  window.LIB_READS = {
    meditation: {
      min: 1,
      body: 'In an 8-week trial, ~10 minutes of daily mindfulness measurably shrank amygdala reactivity — the brain’s alarm system fired less at everyday stressors.',
      takeaway:
        'The dose that works is smaller than you think. Consistency, not duration.',
    },
    noscreens: {
      min: 1,
      body: 'Evening screen light suppresses melatonin and pushes your circadian phase later — the study measured ~90 minutes of delay from bedtime eReader use.',
      takeaway:
        'It’s not willpower — it’s photons. Move the phone, and sleep moves back.',
    },
    walk: {
      min: 1,
      body: 'Daily outdoor walking pairs two mechanisms: morning light calibrates your body clock, and low-intensity movement improves glucose control and mood.',
      takeaway: 'The light matters as much as the steps.',
    },
    breath: {
      min: 1,
      body: 'Extended-exhale breathing directly stimulates the vagus nerve, downshifting heart rate within a few minutes — the fastest self-regulation tool we have evidence for.',
      takeaway: 'Exhale longer than you inhale. That’s the whole trick.',
    },
    read: {
      min: 1,
      body: 'Reading fiction before bed lowers physiological arousal faster than most wind-down activities tested — and it displaces the scroll that keeps you up.',
      takeaway: 'It works by substitution as much as by relaxation.',
    },
    hydration: {
      min: 1,
      body: 'You wake mildly dehydrated after 7–8 hours without fluids. Even 1–2% dehydration measurably impairs attention and raises perceived fatigue.',
      takeaway: 'Water before coffee — rehydrate, then caffeinate.',
    },
    deepwork: {
      min: 1,
      body: 'Task-switching carries a re-focus cost of up to ~23 minutes. One protected block outperforms a day of fragmented effort on deep tasks.',
      takeaway: 'Protect one block; let the rest of the day be messy.',
    },
    coldshower: {
      min: 1,
      body: 'Brief cold exposure spikes norepinephrine several-fold — the same alertness chemistry as caffeine, without the sleep cost.',
      takeaway: '30 seconds is a real dose. You don’t need the ice bath.',
    },
    journal: {
      min: 1,
      body: 'Expressive writing studies show that putting feelings into words reduces their intensity — affect labeling calms the same circuits meditation trains.',
      takeaway: 'Three lines counts. The mechanism is naming, not length.',
    },
  };

  window.LibReadRow = function ({ t, added, onAdd }) {
    const [open, setOpen] = useState(false);
    const theme = window.libTheme(t.category, false);
    const read = window.LIB_READS[t.id];
    const cite = window.shortCitation(t.scientificReference);
    return (
      <div
        style={{
          background: T.cardWhite,
          border: `1px solid rgba(45,42,38,0.07)`,
          borderRadius: T.rLg,
          boxShadow: T.shadowSubtle,
          overflow: 'hidden',
        }}
      >
        <div
          className='tap'
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 11,
            padding: '12px 12px',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              background: `${theme.accent}14`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 23,
              flexShrink: 0,
            }}
          >
            {t.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: sans,
                fontSize: 15,
                fontWeight: 600,
                color: T.g800,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {t.name}
            </div>
            <div
              style={{
                fontFamily: sans,
                fontSize: 12,
                color: T.g500,
                marginTop: 2,
              }}
            >
              {t.estimatedMinutes ? `${t.estimatedMinutes} min · ` : ''}
              {t.frequency}
            </div>
          </div>
          <window.LibAddBtn added={added} onAdd={onAdd} />
        </div>
        {read && (
          <div
            className='tap'
            onClick={() => setOpen((v) => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 12px',
              borderTop: `1px solid rgba(45,42,38,0.06)`,
              background: open ? `${theme.accent}0A` : 'transparent',
              cursor: 'pointer',
              transition: 'background .2s',
            }}
          >
            {I.flask({ s: 12, c: theme.accent })}
            <span
              style={{
                flex: 1,
                fontFamily: sans,
                fontSize: 12,
                fontWeight: 600,
                color: theme.accent,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Why this works · {read.min}-min read
            </span>
            <div
              style={{
                transform: open ? 'rotate(180deg)' : 'none',
                transition: 'transform .2s',
                display: 'flex',
              }}
            >
              {chevD({ s: 13, c: theme.accent })}
            </div>
          </div>
        )}
        {read && (
          <div
            style={{
              maxHeight: open ? 220 : 0,
              overflow: 'hidden',
              transition: 'max-height .3s ease',
            }}
          >
            <div
              style={{
                padding: '10px 14px 13px',
                borderTop: `1px solid rgba(45,42,38,0.06)`,
              }}
            >
              <div
                style={{
                  fontFamily: sans,
                  fontSize: 13,
                  lineHeight: '19px',
                  color: T.g600,
                  textWrap: 'pretty',
                }}
              >
                {read.body}
              </div>
              <div
                style={{
                  fontFamily: serif,
                  fontSize: 13.5,
                  fontStyle: 'italic',
                  color: T.g800,
                  marginTop: 8,
                  lineHeight: '19px',
                }}
              >
                {read.takeaway}
              </div>
              {cite && (
                <div
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 10.5,
                    color: T.g400,
                    marginTop: 8,
                  }}
                >
                  {cite}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  window.LibPathCard = function ({ p, onOpen, progress = null }) {
    return (
      <div
        className='tap'
        onClick={onOpen}
        style={{
          background: T.cardWhite,
          border: `1px solid rgba(45,42,38,0.07)`,
          borderRadius: T.rXl,
          boxShadow: T.shadowCard,
          overflow: 'hidden',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            padding: '14px 16px 12px',
            background: `linear-gradient(135deg, ${p.bg}, ${T.cardWhite} 70%)`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>{p.emoji}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: serif,
                  fontSize: 17.5,
                  fontWeight: 700,
                  letterSpacing: -0.2,
                  color: T.g800,
                }}
              >
                {p.name}
              </div>
              <div
                style={{
                  fontFamily: sans,
                  fontSize: 12,
                  color: T.g500,
                  marginTop: 1,
                }}
              >
                {p.tagline}
              </div>
            </div>
            {I.chevR({ s: 16 })}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 16px 12px',
          }}
        >
          {p.steps.map((s, i) => {
            const t = window.libById(s.habit);
            const state =
              progress === null
                ? 'preview'
                : i < progress
                  ? 'done'
                  : i === progress
                    ? 'active'
                    : 'locked';
            return (
              <React.Fragment key={i}>
                {i > 0 && (
                  <div
                    style={{
                      flex: 1,
                      height: 2,
                      background:
                        state === 'done' || state === 'active'
                          ? T.primary600
                          : T.g200,
                      opacity: state === 'locked' ? 0.6 : 0.35,
                    }}
                  />
                )}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 17,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      boxSizing: 'border-box',
                      background:
                        state === 'done'
                          ? T.primary100
                          : state === 'active'
                            ? T.cardWhite
                            : T.g50,
                      border:
                        state === 'active'
                          ? `2px solid ${T.primary600}`
                          : `1px solid ${T.borderMuted}`,
                      filter: state === 'locked' ? 'grayscale(1)' : 'none',
                      opacity: state === 'locked' ? 0.55 : 1,
                    }}
                  >
                    {state === 'done'
                      ? I.check({ s: 14, c: T.primary700, sw: 3 })
                      : t.icon}
                  </div>
                  <span
                    style={{
                      fontFamily: sans,
                      fontSize: 9.5,
                      fontWeight: 600,
                      letterSpacing: 0.3,
                      textTransform: 'uppercase',
                      color: state === 'active' ? T.primary700 : T.g400,
                    }}
                  >
                    wk {s.week}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
          <div style={{ flex: 2 }} />
          <span
            style={{
              fontFamily: sans,
              fontSize: 11.5,
              fontWeight: 600,
              color: T.g500,
              flexShrink: 0,
            }}
          >
            {p.weeks} weeks · {p.steps.length} habits
          </span>
        </div>
      </div>
    );
  };
})();
