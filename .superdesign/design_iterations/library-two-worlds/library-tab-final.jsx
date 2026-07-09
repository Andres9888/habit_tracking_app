(function () {
  const { useState } = React;
  const I = window.LibIcon;
  const sans = '"DM Sans", system-ui, sans-serif';
  const serif = 'Literata, Georgia, serif';

  window.LibraryTwoWorlds = function ({ tweaks = {} }) {
    const { showTabs = false } = tweaks;
    const [tab, setTab] = useState('library');
    const [cat, setCat] = useState('All');
    const [added, setAdded] = useState([]);
    const add = (id) =>
      setAdded((a) =>
        a.includes(id) ? a.filter((x) => x !== id) : [...a, id]
      );
    const cats = ['All', 'Mind', 'Focus', 'Health', 'Sleep'];
    const list = window.LIB_TEMPLATES.filter(
      (t) => cat === 'All' || t.category === cat
    ).sort((a, b) => b.popularityScore - a.popularityScore);

    return (
      <window.LibShell>
        <div style={{ padding: '4px 20px 0' }} data-screen-label='Header'>
          <div
            style={{
              fontFamily: serif,
              fontSize: 25,
              fontWeight: 600,
              letterSpacing: -0.4,
              color: T.g800,
            }}
          >
            Habit Library
          </div>
          {showTabs && (
            <div
              style={{
                display: 'flex',
                background: T.g50,
                borderRadius: T.rFull,
                padding: 3,
                marginTop: 12,
              }}
            >
              {[
                ['paths', 'Paths'],
                ['library', 'Library'],
              ].map(([k, label]) => {
                const on = k === tab;
                return (
                  <div
                    key={k}
                    className='tap'
                    onClick={() => setTab(k)}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      padding: '8px 0',
                      borderRadius: T.rFull,
                      cursor: 'pointer',
                      background: on ? T.cardWhite : 'transparent',
                      boxShadow: on ? T.shadowSubtle : 'none',
                      fontFamily: sans,
                      fontSize: 13.5,
                      fontWeight: on ? 700 : 500,
                      color: on ? T.g800 : T.g500,
                    }}
                  >
                    {label}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {tab === 'paths' ? (
          <div
            style={{ padding: '14px 20px 24px' }}
            data-screen-label='Paths tab'
          >
            <div
              style={{
                fontFamily: sans,
                fontSize: 13,
                color: T.g500,
                marginBottom: 12,
              }}
            >
              Guided programs — one habit a week, backed by research.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {window.LIB_PATHS.map((p) => (
                <window.LibPathCard key={p.id} p={p} onOpen={() => {}} />
              ))}
            </div>
          </div>
        ) : (
          <div data-screen-label='Library'>
            <div style={{ padding: '12px 20px 0' }}>
              <window.LibSearchBar
                hint={`Search ${window.LIB_TOTAL} science-backed habits`}
              />
            </div>
            <div
              style={{
                display: 'flex',
                gap: 7,
                padding: '12px 20px 2px',
                overflowX: 'auto',
              }}
            >
              {cats.map((k) => {
                const meta = window.LIB_CATEGORIES.find((c) => c.key === k);
                const on = cat === k;
                return (
                  <button
                    key={k}
                    className='tap'
                    onClick={() => setCat(k)}
                    style={{
                      flexShrink: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '7px 13px',
                      borderRadius: T.rFull,
                      cursor: 'pointer',
                      border: `1px solid ${on ? 'transparent' : T.border}`,
                      background: on ? T.primary700 : T.cardWhite,
                      color: on ? '#fff' : T.g600,
                      fontFamily: sans,
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    {meta && (
                      <span style={{ fontSize: 13, lineHeight: 1 }}>
                        {meta.emoji}
                      </span>
                    )}
                    {k}
                  </button>
                );
              })}
            </div>
            <div style={{ padding: '12px 20px 24px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}
              >
                <window.LibOverline style={{ marginBottom: 0 }}>
                  {cat === 'All' ? 'Most added' : `${cat} · by popularity`}
                </window.LibOverline>
                <span
                  style={{
                    fontFamily: sans,
                    fontSize: 11.5,
                    fontWeight: 500,
                    color: T.g400,
                  }}
                >
                  {list.length} shown
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {list.map((t) => (
                  <React.Fragment key={t.id}>
                    <window.LibReadRow
                      t={t}
                      added={added.includes(t.id)}
                      onAdd={() => add(t.id)}
                    />
                    {added.includes(t.id) && (
                      <window.LibPairNudge
                        forId={t.id}
                        added={added}
                        onAdd={add}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div style={{ marginTop: 12 }}>
                <window.LibEndcap />
              </div>
            </div>
          </div>
        )}
      </window.LibShell>
    );
  };
})();
