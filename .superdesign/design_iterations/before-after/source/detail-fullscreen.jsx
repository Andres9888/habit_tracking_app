// Habit Detail — full-screen BEFORE/AFTER assemblies for the redesign mock.
// Reuses window.T / Ty (tokens), Icon + Phone (habit-card), and the section
// components from detail-screens.jsx (DetailHeroBefore/After, etc).

const { useState: useStateF } = React;

function NavHeader({ title, withActions }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
                  padding:`${T.sm}px ${T.base}px`, gap:T.sm }}>
      <div style={{ width:32, height:32, borderRadius:T.rFull, background:T.card,
                    display:'flex', alignItems:'center', justifyContent:'center' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.g700} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </div>
      <div style={{ ...Ty.bodySmall, fontWeight:600, color:T.g700, flex:1, textAlign:'center', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{title}</div>
      <div style={{ width:32, height:32, borderRadius:T.rFull, background: withActions?T.card:'transparent',
                    display:'flex', alignItems:'center', justifyContent:'center' }}>
        {withActions && Icon.more(T.g700, 18)}
      </div>
    </div>
  );
}

// CHAIN CALENDAR — the month grid of chain links
const DAY_LABELS = ['S','M','T','W','T','F','S'];

// 35-cell pattern; first 4 are spacer. d=done x=miss T=today f=future e=empty
const CAL = [
  'e','e','e','e','d','d','d',
  'd','x','d','d','d','d','d',
  'd','d','d','d','d','x','d',
  'd','d','d','d','d','d','d',
  'd','d','d','T','f','f','f',
];

function ChainCell({ kind, interactive, selected, dim }) {
  const base = { width:34, height:34, borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', boxSizing:'border-box' };
  if (kind === 'e') return <div style={base}/>;
  if (kind === 'f') return <div style={{ ...base, background:T.g100, opacity:0.5 }}/>;
  if (kind === 'd') return (
    <div style={{ ...base, background:T.primary600, boxShadow: selected?`0 0 0 3px ${T.primary100}`:'none', opacity:dim?0.5:1 }}>
      {Icon.link('#fff', 15)}
    </div>
  );
  if (kind === 'x') return interactive ? (
    <div style={{ ...base, background:'transparent', border:`1.5px dashed ${T.g300}`, color:T.g400 }}>
      {Icon.plus(T.g400, 14)}
    </div>
  ) : (
    <div style={{ ...base, background:T.g100, border:`1px solid ${T.border}` }}/>
  );
  if (kind === 'T') return (
    <div style={{ ...base, background: T.streak100, border:`2px solid ${T.streak300}` }}>
      <span style={{ fontSize:13 }}>🔥</span>
    </div>
  );
  return <div style={base}/>;
}

function DayNote({ compact }) {
  return (
    <div style={{ marginTop:T.md, padding:`12px ${T.md}px`, background:T.cardWhite, border:`1px solid ${T.border}`, borderRadius:T.rMd,
                  display:'flex', gap:T.md, alignItems:'flex-start' }}>
      <div style={{ width:30, height:30, borderRadius:9, background:T.primary100, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:15 }}>🧘</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ ...Ty.caption, color:T.g500 }}>Tue, Jan 28 · <b style={{color:T.primary700}}>completed</b></div>
        <div style={{ fontFamily:'Literata, Georgia, serif', fontSize:14, fontStyle:'italic', color:T.g800, lineHeight:'20px', marginTop:2 }}>“Sat 20 min before bed — felt genuinely calm for once.”</div>
      </div>
    </div>
  );
}

window.ChainCalendar = function({ interactive, selected, atRisk }) {
  return (
    <div style={{ background:T.g50, border:`1px solid ${T.border}`, borderRadius:T.rXl, boxShadow:T.shadowCard,
                  margin:`${T.base}px ${T.base}px 0`, padding:T.base }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:T.md }}>
        <span style={{ ...Ty.heading3, fontSize:17, color:T.g800 }}>January</span>
        <span style={{ ...Ty.caption, color:T.g500 }}>30 of 31 days</span>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:6, marginBottom:6 }}>
        {DAY_LABELS.map((d,i)=>(
          <div key={i} style={{ textAlign:'center', ...Ty.caption, fontSize:10, color:T.g400 }}>{d}</div>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:6, justifyItems:'center' }}>
        {CAL.map((k,i)=>(
          <ChainCell key={i} kind={k} interactive={interactive} selected={interactive && selected===i}/>
        ))}
      </div>
      {interactive ? (
        <>
          <div style={{ display:'flex', alignItems:'center', gap:T.md, marginTop:T.md, ...Ty.caption, color:T.g500, flexWrap:'wrap' }}>
            <span style={{ display:'flex', alignItems:'center', gap:5 }}><span style={{ width:12, height:12, borderRadius:4, background:T.primary600, display:'inline-block' }}/>done</span>
            <span style={{ display:'flex', alignItems:'center', gap:5 }}><span style={{ width:12, height:12, borderRadius:4, border:`1.5px dashed ${T.g300}`, display:'inline-block' }}/>tap to backfill</span>
          </div>
          {selected!=null && <DayNote/>}
        </>
      ) : (
        <div style={{ marginTop:T.md, ...Ty.caption, color:T.g400, textAlign:'center' }}>Read-only overview</div>
      )}
    </div>
  );
};

// STICKY COMPLETE BAR (AFTER) — pinned over the scroll
window.StickyComplete = function({ atRisk, done }) {
  if (done) {
    return (
      <div style={{ position:'absolute', left:0, right:0, bottom:0, padding:`${T.md}px ${T.base}px calc(${T.base}px + 6px)`,
                    background:'linear-gradient(to top, rgba(245,241,237,1) 70%, rgba(245,241,237,0))' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'13px 0',
                      borderRadius:T.rLg, background:T.primary100, border:`1px solid ${T.primary500}` }}>
          {Icon.check(T.primary700, 16)}
          <span style={{ ...Ty.body, fontWeight:600, fontSize:15, color:T.primary700 }}>Done for today</span>
        </div>
      </div>
    );
  }
  return (
    <div style={{ position:'absolute', left:0, right:0, bottom:0, padding:`${T.md}px ${T.base}px calc(${T.base}px + 6px)`,
                  background:'linear-gradient(to top, rgba(245,241,237,1) 70%, rgba(245,241,237,0))' }}>
      {atRisk && (
        <div style={{ textAlign:'center', ...Ty.caption, color:T.warning, fontWeight:600, marginBottom:T.sm }}>
          ⚠ 47-day chain at risk — don’t break it tonight
        </div>
      )}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, padding:'15px 0',
                    borderRadius:T.rLg, background: atRisk?T.streak700:T.primary600,
                    boxShadow:`0 6px 18px ${atRisk?'rgba(125,89,7,0.32)':'rgba(5,150,105,0.28)'}` }}>
        <div style={{ width:22, height:22, borderRadius:11, border:'2px solid rgba(255,255,255,0.9)' }}/>
        <span style={{ ...Ty.body, fontWeight:700, color:'#fff' }}>Mark today complete</span>
      </div>
    </div>
  );
};

// FULL SCREENS
window.DetailScreenBefore = function() {
  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <NavHeader title="Evening meditation"/>
      <div style={{ flex:1, overflowY:'auto', paddingBottom:T.lg }}>
        <DetailHeroBefore/>
        <div style={{ margin:`${T.base}px ${T.base}px 0` }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, padding:'14px 0',
                        borderRadius:T.rLg, border:`2px solid ${T.success}`, background:'transparent' }}>
            <div style={{ width:22, height:22, borderRadius:11, border:`2px solid ${T.success}` }}/>
            <span style={{ ...Ty.body, fontWeight:600, color:T.success }}>Mark as done</span>
          </div>
        </div>
        <ChainCalendar/>
        <div style={{ margin:`${T.base}px ${T.base}px 0` }}><StrengthBefore/></div>
      </div>
    </div>
  );
};

window.DetailScreenAfter = function({ atRisk, done, selected=10 }) {
  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg, position:'relative' }}>
      <NavHeader title="Evening meditation" withActions/>
      <div style={{ flex:1, overflowY:'auto', paddingBottom:120 }}>
        <DetailHeroAfter/>
        <ChainCalendar interactive selected={selected}/>
        <div style={{ margin:`${T.base}px ${T.base}px 0` }}><StrengthAfter/></div>
      </div>
      <StickyComplete atRisk={atRisk} done={done}/>
    </div>
  );
};

window.AtRiskFrame = function() {
  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg, position:'relative' }}>
      <NavHeader title="Evening meditation" withActions/>
      <div style={{ flex:1, overflowY:'auto', paddingBottom:130 }}>
        <div style={{ background:T.g50, border:`1px solid ${T.streak300}`, borderRadius:T.rLg, boxShadow:T.shadowCard,
                      margin:`${T.sm}px ${T.base}px 0`, padding:`${T.lg}px ${T.base}px`, display:'flex', flexDirection:'column', alignItems:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:T.sm }}>
            <div style={{ width:44, height:44, borderRadius:T.rMd, background:T.primary100, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>🧘</div>
            <div style={{ fontFamily:'Literata, Georgia, serif', fontSize:22, fontWeight:700, letterSpacing:-0.3, color:T.g800 }}>Evening meditation</div>
          </div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:`5px ${T.md}px`, background:T.streak100, borderRadius:T.rFull, marginTop:T.base }}>
            <span style={{ fontSize:12 }}>⚠</span>
            <span style={{ ...Ty.caption, fontWeight:700, color:T.warning }}>Not done yet today</span>
          </div>
          <div style={{ display:'flex', alignItems:'baseline', gap:8, marginTop:T.md }}>
            <span style={{ fontFamily:'Literata, Georgia, serif', fontSize:64, fontWeight:600, letterSpacing:-2, lineHeight:'64px', color:T.streak700 }}>47</span>
            <span style={{ fontSize:24 }}>🔥</span>
          </div>
          <div style={{ ...Ty.bodySmall, color:T.warning, marginTop:6, fontWeight:600 }}>Ends at midnight if not completed</div>
        </div>
        <ChainCalendar interactive selected={null}/>
      </div>
      <StickyComplete atRisk/>
    </div>
  );
};
