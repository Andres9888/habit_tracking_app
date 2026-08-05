(function () {
  const I = window.LibIcon;

  window.LIB_TEMPLATES.push(
    {
      id: 'noscreens',
      icon: '📵',
      name: 'No screens before bed',
      category: 'Sleep',
      tagline: 'Park the phone an hour before sleep.',
      frequency: 'Daily',
      estimatedMinutes: 0,
      growthType: 'average',
      popularityScore: 5100,
      authored: false,
      description:
        'Put every screen away 60 minutes before bed so melatonin can do its job.',
      scientificReference:
        'Chang AM, et al. (2015) — Evening use of light-emitting eReaders',
      startSmallVersion: 'Phone out of the bedroom tonight.',
    },
    {
      id: 'hydration',
      icon: '💧',
      name: 'Hydration first',
      category: 'Health',
      tagline: 'A full glass of water before coffee.',
      frequency: 'Daily',
      estimatedMinutes: 1,
      growthType: 'simple',
      popularityScore: 4400,
      authored: false,
      description:
        'Rehydrate before caffeine — a big glass of water within minutes of waking.',
      scientificReference:
        'Popkin BM, et al. (2010) — Water, hydration, and health',
      startSmallVersion: 'One sip before anything else.',
    },
    {
      id: 'journal',
      icon: '📓',
      name: 'Evening journal',
      category: 'Mind',
      tagline: 'Three lines to close the day.',
      frequency: 'Daily',
      estimatedMinutes: 5,
      growthType: 'simple',
      popularityScore: 2600,
      authored: false,
      description:
        'Three quick lines — what happened, what you felt, what tomorrow needs.',
      scientificReference:
        'Pennebaker JW (1997) — Writing about emotional experiences',
      startSmallVersion: 'One sentence before bed.',
    }
  );
  window.libById = (id) => window.LIB_TEMPLATES.find((t) => t.id === id);

  window.LIB_GOALS = [
    {
      id: 'more-energy',
      emoji: '⚡',
      problemLabel: 'More energy',
      promise: 'Morning routines that keep you sharp all day',
      bg: '#FEF3C7',
      fg: '#78350F',
    },
    {
      id: 'sleep-better',
      emoji: '😴',
      problemLabel: 'Sleep better',
      promise: 'Wind down, rest fully, wake refreshed',
      bg: '#EFF6FF',
      fg: '#1E3A5F',
    },
    {
      id: 'less-stress',
      emoji: '🧘',
      problemLabel: 'Stress less',
      promise: 'Calm your mind and regulate your system',
      bg: '#F0FDF4',
      fg: '#14532D',
    },
    {
      id: 'be-productive',
      emoji: '🎯',
      problemLabel: 'Focus deeper',
      promise: 'Beat distraction and do deeper work',
      bg: '#FAF5FF',
      fg: '#581C87',
    },
    {
      id: 'get-healthier',
      emoji: '💪',
      problemLabel: 'Get healthier',
      promise: 'Lasting habits for a longer life',
      bg: '#FFF1F2',
      fg: '#881337',
    },
  ];
  window.LIB_GOAL_TEMPLATES = {
    'more-energy': ['hydration', 'walk', 'coldshower'],
    'sleep-better': ['noscreens', 'meditation', 'breath'],
    'less-stress': ['breath', 'meditation', 'journal'],
    'be-productive': ['deepwork', 'read', 'noscreens'],
    'get-healthier': ['walk', 'coldshower', 'hydration'],
  };
  window.LIB_RX = {
    'sleep-better': {
      insight: 'Start with a wind-down, not a wake-up',
      why: 'Most sleep problems are evening problems. These two habits fix the input — when and how your body powers down.',
      steps: [
        ['noscreens', 'Blue light delays melatonin ~90 min'],
        ['read', 'Replaces scrolling, drops heart rate · 10 min'],
      ],
    },
    'more-energy': {
      insight: 'Light first, then move',
      why: 'Energy is a circadian problem before it is a motivation problem. Lock in hydration and a quick burst of movement.',
      steps: [
        ['hydration', 'Rehydration kickstarts metabolism after sleep'],
        ['walk', 'Morning light sets your body clock · 15 min'],
      ],
    },
    'less-stress': {
      insight: 'Regulate the body, then the mind',
      why: 'Stress lives in your nervous system. Slow breathing calms it in minutes; a short sit builds the buffer.',
      steps: [
        ['breath', 'Slow exhales activate the vagus nerve · 3 min'],
        ['meditation', 'Small daily sits lower baseline anxiety · 5 min'],
      ],
    },
    'be-productive': {
      insight: 'Protect one block, ignore the rest',
      why: 'Focus is a scheduling problem before a willpower problem. One guarded block beats a fragmented day.',
      steps: [
        ['deepwork', 'Unbroken attention compounds · 90 min'],
        ['noscreens', 'Better sleep is better focus tomorrow'],
      ],
    },
    'get-healthier': {
      insight: 'Start smaller than feels useful',
      why: 'Consistency beats intensity. Two tiny anchors make the bigger changes stick later.',
      steps: [
        ['walk', 'Daylight + movement, zero equipment · 15 min'],
        ['hydration', 'The easiest win in the whole library'],
      ],
    },
  };
  window.LIB_PAIRS = {
    meditation: 'journal',
    walk: 'hydration',
    deepwork: 'read',
    breath: 'meditation',
    noscreens: 'read',
    coldshower: 'walk',
    read: 'noscreens',
    hydration: 'walk',
    journal: 'meditation',
  };

  window.LIB_CATEGORIES = [
    { key: 'Mind', emoji: '🧠', count: 48 },
    { key: 'Focus', emoji: '🎯', count: 39 },
    { key: 'Health', emoji: '💪', count: 74 },
    { key: 'Sleep', emoji: '😴', count: 53 },
  ];
  window.LIB_TOTAL = 214;

  const sans = '"DM Sans", system-ui, sans-serif';

  window.LibShell = function ({ children }) {
    return (
      <window.LibThemeCtx.Provider value={window.LIB_PAL.light}>
        <div
          style={{
            height: '100%',
            background: T.bg,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 16px 2px',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                ...Ty.caption,
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: T.primary700,
              }}
            >
              Chain Day
            </span>
            <div
              className='tap'
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                background: T.card,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {I.x({ s: 15, c: T.g500 })}
            </div>
          </div>
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
            {children}
          </div>
        </div>
      </window.LibThemeCtx.Provider>
    );
  };

  window.LibOverline = function ({ children, style = {} }) {
    return (
      <div
        style={{
          fontFamily: sans,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          color: T.g400,
          marginBottom: 10,
          ...style,
        }}
      >
        {children}
      </div>
    );
  };

  window.LibSearchBar = function ({
    hint = 'Or search any habit…',
    style = {},
  }) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '11px 13px',
          background: T.cardWhite,
          border: `1px solid ${T.border}`,
          borderRadius: T.rMd,
          ...style,
        }}
      >
        {I.search({ s: 16, c: T.g400 })}
        <span style={{ fontFamily: sans, fontSize: 14.5, color: T.g400 }}>
          {hint}
        </span>
      </div>
    );
  };

  window.LibGoalChip = function ({ goal, selected, onSelect, size = 'md' }) {
    const pad = size === 'lg' ? '10px 16px' : '8px 13px';
    return (
      <button
        className='tap'
        onClick={() => onSelect(goal.id)}
        style={{
          flexShrink: 0,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: pad,
          borderRadius: T.rFull,
          cursor: 'pointer',
          border: selected
            ? `1.5px solid ${goal.fg}`
            : '1.5px solid transparent',
          background: goal.bg,
          opacity: selected === false ? 1 : 1,
          fontFamily: sans,
          fontSize: size === 'lg' ? 14.5 : 13.5,
          fontWeight: 600,
          color: goal.fg,
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ fontSize: size === 'lg' ? 15 : 14 }}>{goal.emoji}</span>
        {goal.problemLabel}
      </button>
    );
  };

  window.LibAddBtn = function ({ added, onAdd, size = 34 }) {
    return (
      <div
        className='tap'
        onClick={(e) => {
          e.stopPropagation();
          onAdd();
        }}
        style={{
          width: added ? 'auto' : size,
          height: size,
          borderRadius: size / 2,
          padding: added ? '0 12px' : 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 5,
          cursor: 'pointer',
          flexShrink: 0,
          background: added ? T.primary100 : T.primary600,
          boxShadow: added ? 'none' : '0 2px 8px rgba(5,150,105,0.25)',
          transition: 'all .2s',
        }}
      >
        {added
          ? I.check({ s: 13, c: T.primary700, sw: 3 })
          : I.plus({ s: 16, c: '#fff' })}
        {added && (
          <span
            style={{
              fontFamily: sans,
              fontSize: 12,
              fontWeight: 700,
              color: T.primary700,
            }}
          >
            Added
          </span>
        )}
      </div>
    );
  };

  window.LibRow = function ({ t, added, onAdd, dense = false }) {
    const theme = window.libTheme(t.category, false);
    const cite = window.shortCitation(t.scientificReference);
    return (
      <div
        className='tap'
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 11,
          padding: dense ? '10px 12px' : '12px 12px',
          background: T.cardWhite,
          border: `1px solid rgba(45,42,38,0.07)`,
          borderRadius: T.rLg,
          boxShadow: T.shadowSubtle,
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            width: dense ? 40 : 46,
            height: dense ? 40 : 46,
            borderRadius: dense ? 12 : 14,
            background: `${theme.accent}14`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: dense ? 20 : 23,
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
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              marginTop: 2,
              minWidth: 0,
            }}
          >
            <span
              style={{
                fontFamily: sans,
                fontSize: 12,
                color: T.g500,
                flexShrink: 0,
              }}
            >
              {t.estimatedMinutes ? `${t.estimatedMinutes} min · ` : ''}
              {t.frequency}
            </span>
            {cite && !dense ? (
              <>
                <span style={{ color: T.g300, flexShrink: 0 }}>·</span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 3,
                    minWidth: 0,
                  }}
                >
                  {I.flask({ s: 11, c: theme.accent })}
                  <span
                    style={{
                      fontFamily: sans,
                      fontSize: 12,
                      fontWeight: 600,
                      color: theme.accent,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {cite}
                  </span>
                </span>
              </>
            ) : null}
          </div>
        </div>
        <window.LibAddBtn added={added} onAdd={onAdd} size={dense ? 30 : 34} />
      </div>
    );
  };

  window.LibCategoryGrid = function () {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {window.LIB_CATEGORIES.map((c) => (
          <div
            key={c.key}
            className='tap'
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 13px',
              background: T.cardWhite,
              border: `1px solid rgba(45,42,38,0.07)`,
              borderRadius: T.rLg,
              boxShadow: T.shadowSubtle,
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 20 }}>{c.emoji}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: sans,
                  fontSize: 14,
                  fontWeight: 600,
                  color: T.g800,
                }}
              >
                {c.key}
              </div>
              <div style={{ fontFamily: sans, fontSize: 11.5, color: T.g500 }}>
                {c.count} habits
              </div>
            </div>
            {I.chevR({ s: 15 })}
          </div>
        ))}
      </div>
    );
  };

  window.LibEndcap = function ({ label }) {
    return (
      <div
        className='tap'
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          padding: '13px 0',
          background: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: T.rLg,
          cursor: 'pointer',
        }}
      >
        <span
          style={{
            fontFamily: sans,
            fontSize: 14,
            fontWeight: 600,
            color: T.g600,
          }}
        >
          {label || `See all ${window.LIB_TOTAL} habits`}
        </span>
        {I.chevR({ s: 16, c: T.g400 })}
      </div>
    );
  };

  window.LibRxCard = function ({
    goalId,
    added,
    onAdd,
    onAddAll,
    showAddAll = false,
  }) {
    const rx = window.LIB_RX[goalId];
    const goal = window.LIB_GOALS.find((g) => g.id === goalId);
    if (!rx) return null;
    const allAdded = rx.steps.every(([id]) => added.includes(id));
    return (
      <div
        style={{
          background: T.cardWhite,
          border: `1px solid rgba(45,42,38,0.07)`,
          borderRadius: T.rXl,
          boxShadow: T.shadowCard,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '14px 16px 12px',
            background: `linear-gradient(135deg, ${goal.bg}, ${T.cardWhite})`,
          }}
        >
          <window.LibOverline style={{ color: goal.fg, marginBottom: 6 }}>
            Your way in
          </window.LibOverline>
          <div
            style={{
              fontFamily: 'Literata, Georgia, serif',
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: -0.2,
              color: T.g800,
              lineHeight: '23px',
            }}
          >
            {rx.insight}
          </div>
          <div
            style={{
              fontFamily: sans,
              fontSize: 12.5,
              color: T.g500,
              lineHeight: '17px',
              marginTop: 5,
              textWrap: 'pretty',
            }}
          >
            {rx.why}
          </div>
        </div>
        <div>
          {rx.steps.map(([id, reason], i) => {
            const t = window.libById(id);
            return (
              <div
                key={id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 11,
                  padding: '11px 16px',
                  borderTop: `1px solid rgba(45,42,38,0.06)`,
                }}
              >
                <span style={{ fontSize: 21, flexShrink: 0 }}>{t.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: sans,
                      fontSize: 14.5,
                      fontWeight: 600,
                      color: T.g800,
                    }}
                  >
                    {t.name}
                  </div>
                  <div
                    style={{
                      fontFamily: sans,
                      fontSize: 11.5,
                      color: T.g500,
                      marginTop: 1,
                    }}
                  >
                    {reason}
                  </div>
                </div>
                <window.LibAddBtn
                  added={added.includes(id)}
                  onAdd={() => onAdd(id)}
                  size={30}
                />
              </div>
            );
          })}
        </div>
        {showAddAll ? (
          <div style={{ padding: '10px 16px 14px' }}>
            <div
              className='tap'
              onClick={() => onAddAll(rx.steps.map(([id]) => id))}
              style={{
                height: 44,
                borderRadius: T.rFull,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 7,
                cursor: 'pointer',
                background: allAdded ? T.primary100 : T.primary600,
                border: allAdded ? `1px solid rgba(4,120,87,0.25)` : 'none',
                boxShadow: allAdded
                  ? 'none'
                  : '0 4px 12px rgba(5,150,105,0.28)',
                transition: 'all .25s',
              }}
            >
              {allAdded && I.check({ s: 15, c: T.primary700, sw: 3 })}
              <span
                style={{
                  fontFamily: sans,
                  fontSize: 14.5,
                  fontWeight: 700,
                  color: allAdded ? T.primary700 : '#fff',
                }}
              >
                {allAdded
                  ? 'Plan started — see Today'
                  : 'Start this plan · both habits'}
              </span>
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  window.LibPairNudge = function ({ forId, added, onAdd }) {
    const pairId = window.LIB_PAIRS[forId];
    if (!pairId || added.includes(pairId)) return null;
    const t = window.libById(pairId);
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          padding: '9px 12px',
          background: T.streak100,
          border: `1px solid rgba(125,89,7,0.15)`,
          borderRadius: T.rLg,
          marginTop: -4,
        }}
      >
        <span style={{ fontSize: 16 }}>{t.icon}</span>
        <span
          style={{
            flex: 1,
            fontFamily: sans,
            fontSize: 12.5,
            fontWeight: 500,
            color: T.streak700,
          }}
        >
          Pairs well with <b>{t.name}</b>
        </span>
        <span
          className='tap'
          onClick={() => onAdd(pairId)}
          style={{
            fontFamily: sans,
            fontSize: 12.5,
            fontWeight: 700,
            color: T.primary700,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          + Add
        </span>
      </div>
    );
  };
})();
