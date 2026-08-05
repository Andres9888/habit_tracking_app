// habit-detail-live.jsx — interactive Habit Detail page (verbatim from claude.ai/design).
const { useState: useS, useEffect: useE, useRef: useR } = React;

function useLocal(key, init) {
  const [v, setV] = useS(() => {
    try { const r = localStorage.getItem(key); return r === null ? init : JSON.parse(r); } catch { return init; }
  });
  useE(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]);
  return [v, setV];
}

const HD = {
  base: 47,                 // streak when NOT done today
  icon: '🧘', name: 'Evening meditation',
  best: 52, total: 128, strength: 68,
};

// ── Confetti burst (only fires on celebrate/bold) ──
function Burst({ id, intense }) {
  if (!id) return null;
  const n = intense ? 22 : 14;
  const pieces = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + (i % 2 ? 0.3 : 0);
    const d = (intense ? 70 : 50) + (i % 3) * 14;
    return {
      tx: Math.cos(a) * d, ty: Math.sin(a) * d - 10,
      rot: (i % 2 ? 1 : -1) * (180 + i * 12),
      c: [T.primary500, T.streak500, T.streak300, T.primary600, T.strStrong][i % 5],
      s: i % 3 ? 6 : 8,
    };
  });
  return (
    <div key={id} style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none', zIndex: 6 }}>
      {pieces.map((p, i) => (
        <span key={i} style={{
          position: 'absolute', width: p.s, height: p.s, borderRadius: i % 2 ? p.s : 2, background: p.c,
          '--tx': `${p.tx}px`, '--ty': `${p.ty}px`, '--rot': `${p.rot}deg`,
          animation: `hd-confetti ${intense ? 720 : 600}ms cubic-bezier(.18,.7,.3,1) forwards`,
        }} />
      ))}
    </div>
  );
}

// ── The completion control — the heart of the screen ──
function CompleteControl({ done, pressing, feel, affordance, undoHint, on, setPressing }) {
  const showHalo = !done && affordance === 'pulse';
  const showGlow = !done && affordance === 'glow';
  const showArrow = !done && affordance === 'arrow';
  return (
    <div style={{ margin: `${T.base}px ${T.lg}px 0`, position: 'relative' }}>
      <div style={{ height: 18, textAlign: 'center', marginBottom: 8 }}>
        {!done && (
          <span style={{ ...Ty.caption, color: T.g500, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {showArrow && <span style={{ display: 'inline-block', animation: 'hd-arrow 1.2s ease-in-out infinite' }}>👇</span>}
            Tap to log today
          </span>
        )}
      </div>
      <button
        onClick={on}
        onPointerDown={() => setPressing(true)}
        onPointerUp={() => setPressing(false)}
        onPointerLeave={() => setPressing(false)}
        style={{
          appearance: 'none', WebkitAppearance: 'none', margin: 0, font: 'inherit', outline: 'none',
          boxSizing: 'border-box', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 11,
          width: '100%', padding: '17px 0', borderRadius: T.rLg,
          border: `2px solid ${T.success}`,
          backgroundColor: done ? T.success : 'transparent',
          transform: `scale(${pressing ? 0.97 : 1})`,
          boxShadow: showHalo ? undefined : (showGlow ? `0 0 0 4px ${T.primary100}, 0 6px 20px rgba(5,150,105,0.22)` : 'none'),
          transition: 'background .32s cubic-bezier(.3,0,.2,1), transform .12s ease, box-shadow .3s',
          animation: showHalo ? 'hd-pulse 2s ease-out infinite' : 'none',
          position: 'relative', overflow: 'visible',
        }}
      >
        {(feel === 'celebrate' || feel === 'bold') && <Burst id={done ? undefined : undefined} />}
        <span style={{ position: 'relative', width: 24, height: 24, flexShrink: 0 }}>
          <span style={{
            position: 'absolute', inset: 0, borderRadius: 12,
            border: `2px solid ${T.success}`, opacity: done ? 0 : 1,
            transform: `scale(${done ? 0.6 : 1})`, transition: 'all .25s',
          }} />
          <span style={{
            position: 'absolute', inset: 0, borderRadius: 12, background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: done ? 1 : 0, transform: `scale(${done ? 1 : 0.2})`,
            transition: 'transform .28s cubic-bezier(.2,1.5,.4,1) .04s, opacity .2s',
          }}>{Icon.check(T.success, 15)}</span>
        </span>
        <span style={{ ...Ty.body, fontWeight: 600, color: done ? '#fff' : T.success }}>
          {done ? 'Done for Today' : 'Mark as done'}
        </span>
      </button>
      <div style={{ height: 18, textAlign: 'center', marginTop: 8 }}>
        {done && undoHint && (
          <span style={{ ...Ty.caption, color: T.g400 }}>Tap again to undo</span>
        )}
      </div>
    </div>
  );
}

// ── Today's chain ──
function ChainStrip({ done, feel, burst }) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 7, marginTop: T.base }}>
      {days.map((d, i) => {
        const isToday = i === 6;
        const filled = isToday ? done : true;
        const isNew = isToday && done;
        const pop = isNew && (feel === 'celebrate' || feel === 'bold');
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: filled ? T.primary600 : T.g200,
              border: isToday ? `2px solid ${isToday && !done ? T.primary600 : 'transparent'}` : 'none',
              boxShadow: isNew ? `0 0 0 4px ${T.primary100}` : 'none',
              transform: `scale(${pop ? 1.18 : 1})`,
              transition: 'background .3s, transform .3s cubic-bezier(.2,1.5,.4,1), box-shadow .3s',
              animation: pop && burst ? 'hd-pop .45s cubic-bezier(.2,1.5,.4,1)' : 'none',
            }}>
              {filled && Icon.link('#fff', 12)}
            </div>
            <span style={{ ...Ty.caption, fontSize: 10, color: isToday ? T.g700 : T.g400, fontWeight: isToday ? 700 : 500 }}>{isToday ? 'Today' : d}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Mini month calendar ──
function CalCard({ done, on }) {
  const todayIdx = 27;
  const pattern = [2,3,4,6,8,9,10,11,13,15,16,17,18,20,22,23,24,25,26];
  return (
    <div style={{ background: T.g50, border: `1px solid ${T.border}`, borderRadius: T.rLg, boxShadow: T.shadowCard, margin: `${T.base}px ${T.base}px 0`, padding: T.base }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: T.md }}>
        <span style={{ ...Ty.heading3, fontSize: 16, color: T.g800 }}>June</span>
        <span style={{ ...Ty.caption, color: T.g500 }}>Tap any day to edit</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6 }}>
        {['S','M','T','W','T','F','S'].map((d,i) => (
          <div key={i} style={{ ...Ty.caption, fontSize: 10, color: T.g400, textAlign: 'center', marginBottom: 2 }}>{d}</div>
        ))}
        {Array.from({ length: 35 }).map((_, i) => {
          const isToday = i === todayIdx;
          const past = i < todayIdx;
          const filled = isToday ? done : pattern.includes(i);
          const future = i > todayIdx;
          return (
            <div key={i}
              onClick={isToday ? on : undefined}
              style={{
                aspectRatio: '1', borderRadius: 8, cursor: isToday ? 'pointer' : 'default',
                background: filled ? T.primary600 : (future ? 'transparent' : T.g200),
                border: isToday ? `2px solid ${T.primary600}` : (future ? `1px dashed ${T.border}` : 'none'),
                opacity: future ? 0.5 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background .3s, transform .12s',
              }}>
              {isToday && !done && <span style={{ width: 5, height: 5, borderRadius: 3, background: T.primary600 }} />}
              {filled && isToday && Icon.check('#fff', 12)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Compact strength card ──
function StrengthMini() {
  const j = strJourney(HD.strength);
  return (
    <div style={{ background: T.g50, border: `1px solid ${T.border}`, borderRadius: T.rLg, boxShadow: T.shadowCard, margin: `${T.base}px ${T.base}px ${T.lg}px`, padding: T.base, display: 'flex', alignItems: 'center', gap: T.base }}>
      <Ring pct={HD.strength} color={j.current.color} size={72} stroke={8} />
      <div style={{ flex: 1 }}>
        <div style={{ ...Ty.caption, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: T.g500 }}>Habit strength</div>
        <div style={{ ...Ty.heading3, fontSize: 18, color: j.current.color, marginTop: 2 }}>{j.current.label}</div>
        <div style={{ ...Ty.caption, color: T.g500, marginTop: 3 }}>Up 6% this month — keep showing up</div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// THE LIVE SCREEN
// ════════════════════════════════════════════════════════════
window.HabitDetailLive = function ({ feel = 'celebrate', affordance = 'pulse', undoHint = true }) {
  const [done, setDone] = useLocal('hd_done', false);
  const [pressing, setPressing] = useS(false);
  const [burst, setBurst] = useS(0);
  const streak = done ? HD.base + 1 : HD.base;

  const toggle = () => {
    setDone(d => {
      const nd = !d;
      if (nd && feel !== 'calm') setBurst(b => b + 1);
      return nd;
    });
  };

  return (
    <div style={{ height: '100%', background: T.bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 16px 10px', flexShrink: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: 18, background: T.card, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.g700} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </div>
        <div style={{ ...Ty.caption, color: T.g400, fontWeight: 600 }}>Daily · Evening</div>
        <div style={{ width: 36, height: 36, borderRadius: 18, background: T.card, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icon.more(T.g600, 18)}</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: `${T.sm}px 16px 0` }}>
          <div style={{
            width: 72, height: 72, borderRadius: T.rLg, background: done ? T.primary100 : T.card,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36,
            position: 'relative', transition: 'background .4s',
          }}>
            {HD.icon}
            {done && (
              <div style={{ position: 'absolute', right: -4, bottom: -4, width: 26, height: 26, borderRadius: 13, background: T.success, border: '2.5px solid ' + T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'hd-pop .4s cubic-bezier(.2,1.5,.4,1)' }}>
                {Icon.check('#fff', 12)}
              </div>
            )}
          </div>
          <div style={{ fontFamily: 'Literata, Georgia, serif', fontSize: 23, fontWeight: 700, letterSpacing: -0.3, color: T.g800, marginTop: T.md }}>{HD.name}</div>

          <div style={{ ...Ty.caption, fontSize: 11, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase', color: T.g500, marginTop: T.base }}>Current streak</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 2, position: 'relative' }}>
            <Burst id={burst} intense={feel === 'bold'} />
            <span key={streak} style={{
              fontFamily: 'Literata, Georgia, serif', fontSize: 60, fontWeight: 600, letterSpacing: -2, lineHeight: '64px',
              color: done ? T.streak700 : T.g800,
              animation: burst ? 'hd-tick .5s cubic-bezier(.2,1.2,.4,1)' : 'none',
              transition: 'color .4s',
            }}>{streak}</span>
            <span style={{ fontSize: 22 }}>🔥</span>
          </div>
          <div style={{ ...Ty.bodySmall, color: T.g500, marginTop: 6 }}>best <b style={{ color: T.g700 }}>{HD.best}</b> · {HD.total} total</div>

          <ChainStrip done={done} feel={feel} burst={burst} />
        </div>

        <CompleteControl done={done} pressing={pressing} feel={feel} affordance={affordance} undoHint={undoHint} on={toggle} setPressing={setPressing} />

        <CalCard done={done} on={toggle} />
        <StrengthMini />
      </div>
    </div>
  );
};
