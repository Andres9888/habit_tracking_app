// Habit Detail screens — faithful "before" + improved "after" section components.
// Reuses window.T / window.Ty (tokens.js), Icon + Phone (habit-card.jsx).

const { useState: useStateD } = React;

window.STR_LEVELS = [
  { label:'Starting',   emoji:'🥉', color:T.strStarting,   min:0  },
  { label:'Building',   emoji:'🥈', color:T.strBuilding,   min:20 },
  { label:'Developing', emoji:'🥇', color:T.strDeveloping, min:40 },
  { label:'Strong',     emoji:'🏆', color:T.strStrong,     min:60 },
  { label:'Automatic',  emoji:'💎', color:T.strAuto,       min:80 },
];
window.strJourney = (s) => {
  let idx = 0;
  for (let i=0;i<STR_LEVELS.length;i++) if (s >= STR_LEVELS[i].min) idx = i;
  const next = STR_LEVELS[idx+1] || null;
  return { idx, current: STR_LEVELS[idx], next, pctToNext: next ? next.min - s : 0 };
};

window.Ring = function({ pct, color, size=120, stroke=10, label, big }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position:'relative', width:size, height:size }}>
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} stroke={T.g200} strokeWidth={stroke} fill="none"/>
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={c*(1-pct/100)} strokeLinecap="round"
          style={{ transition:'stroke-dashoffset .8s cubic-bezier(.2,.8,.2,1)' }}/>
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize: big?34:26, fontWeight:700, color:T.g800, lineHeight:1 }}>{pct}<span style={{ fontSize:big?18:14 }}>%</span></span>
      </div>
    </div>
  );
};

const dHabit = { icon:'🧘', name:'Evening meditation', streak:47, best:52, total:128, strength:68, day:61, accent:T.strStrong, goal:66 };

// HERO
window.DetailHeroBefore = function({ h=dHabit }) {
  return (
    <div style={{ background:T.g50, border:`1px solid ${T.border}`, borderRadius:T.rLg, boxShadow:T.shadowCard,
                  margin:`${T.sm}px ${T.base}px 0`, padding:`${T.lg}px ${T.base}px`, display:'flex', flexDirection:'column', alignItems:'center' }}>
      <div style={{ width:64, height:64, borderRadius:T.rLg, background:T.primary100, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32 }}>{h.icon}</div>
      <div style={{ fontFamily:'Literata, Georgia, serif', fontSize:24, fontWeight:700, letterSpacing:-0.3, color:T.g800, marginTop:T.base }}>{h.name}</div>
      <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:`6px ${T.md}px`, background:T.streak100, borderRadius:T.rFull, marginTop:T.sm }}>
        <span style={{ fontSize:13 }}>🔥</span>
        <span style={{ ...Ty.caption, fontWeight:600, color:T.streak700 }}>{h.streak} day streak</span>
      </div>
      <div style={{ ...Ty.caption, color:T.g400, marginTop:T.sm }}>Day {h.day} of your journey</div>
      <div style={{ display:'flex', width:'100%', marginTop:T.lg, padding:`${T.base}px 0`, background:T.bg, border:`1px solid ${T.border}`, borderRadius:T.rLg }}>
        {[['streak',h.streak],['best',h.best],['total',h.total]].map((s,i)=>(
          <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', borderLeft: i?`1px solid ${T.border}`:'none' }}>
            <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:20, fontWeight:700, color:T.g800 }}>{s[1]}</span>
            <span style={{ ...Ty.caption, fontSize:11, color:T.g500, marginTop:2 }}>{s[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

window.DetailHeroAfter = function({ h=dHabit, streakOverride, celebrate }) {
  const streak = streakOverride ?? h.streak;
  return (
    <div style={{ background:T.g50, border:`1px solid ${T.border}`, borderRadius:T.rLg, boxShadow:T.shadowCard,
                  margin:`${T.sm}px ${T.base}px 0`, padding:`${T.lg}px ${T.base}px`, display:'flex', flexDirection:'column', alignItems:'center', position:'relative', overflow:'hidden' }}>
      <div style={{ display:'flex', alignItems:'center', gap:T.sm }}>
        <div style={{ width:44, height:44, borderRadius:T.rMd, background:T.primary100, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>{h.icon}</div>
        <div style={{ fontFamily:'Literata, Georgia, serif', fontSize:22, fontWeight:700, letterSpacing:-0.3, color:T.g800 }}>{h.name}</div>
      </div>
      <div style={{ ...Ty.caption, fontSize:11, fontWeight:700, letterSpacing:1.6, textTransform:'uppercase', color:T.g500, marginTop:T.base }}>Current streak</div>
      <div style={{ display:'flex', alignItems:'baseline', gap:8, marginTop:2, position:'relative' }}>
        <span style={{ fontFamily:'Literata, Georgia, serif', fontSize:64, fontWeight:600, letterSpacing:-2, lineHeight:'64px', color:T.streak700,
                       transform: celebrate?'scale(1.06)':'scale(1)', transition:'transform .4s cubic-bezier(.2,1.4,.4,1)' }}>{streak}</span>
        <span style={{ fontSize:24 }}>🔥</span>
      </div>
      <div style={{ ...Ty.bodySmall, color:T.g500, marginTop:6, whiteSpace:'nowrap' }}>best <b style={{color:T.g700}}>{h.best}</b> · {h.total} total</div>
      <div style={{ ...Ty.caption, color:T.g400, marginTop:T.sm, whiteSpace:'nowrap' }}>Day {h.day} of your journey 🔗</div>
    </div>
  );
};

// GOAL — "Your why" reused by strength section's narrative
function GoalWhy() {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:T.md, padding:`14px ${T.base}px`, background:T.bg, border:`1px solid ${T.border}`, borderRadius:T.rLg }}>
      <div style={{ width:36, height:36, borderRadius:10, background:T.card, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>💭</div>
      <div style={{ flex:1 }}>
        <div style={{ ...Ty.caption, fontWeight:700, letterSpacing:0.6, textTransform:'uppercase', color:T.g400 }}>Your why</div>
        <div style={{ fontFamily:'Literata, Georgia, serif', fontSize:15, fontStyle:'italic', color:T.g800, lineHeight:'21px', marginTop:2 }}>“To stay calm and present for my family.”</div>
      </div>
    </div>
  );
}

// STRENGTH
function MilestoneTrackMock({ idx }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start' }}>
      {STR_LEVELS.map((lv,i)=>{
        const reached = i<=idx, current=i===idx;
        return (
          <React.Fragment key={i}>
            {i>0 && <div style={{ flex:1, height:2, borderRadius:1, marginTop:18, background: reached?T.primary600:T.border }}/>}
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:44 }}>
              <div style={{ width:36, height:36, borderRadius:18, display:'flex', alignItems:'center', justifyContent:'center',
                background: reached?'rgba(5,150,105,0.1)':T.bg, border:`${current?2:1}px solid ${reached?T.primary600:T.border}`,
                opacity: reached?1:0.55, fontSize: current?18:15 }}>{lv.emoji}</div>
              <span style={{ fontSize:9, marginTop:6, fontWeight: current?700:500, color: current?T.g800:T.g400, textAlign:'center' }}>{lv.label}</span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

function StrengthChartMock({ color, projected, targetMin=80, targetEmoji='💎', currentPct=68 }) {
  const pts = [8,12,18,22,30,38,42,48,52,58,62,currentPct];
  const W=260, H=64, max=100;
  const sx = i => (i/(pts.length-1))*(projected?W*0.66:W);
  const sy = v => H - (v/max)*H;
  const path = pts.map((v,i)=>`${i?'L':'M'}${sx(i).toFixed(1)},${sy(v).toFixed(1)}`).join(' ');
  const fx0 = sx(pts.length-1), fy0 = sy(currentPct);
  const fx1 = W, fy1 = sy(targetMin);
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display:'block' }}>
      {[0.25,0.5,0.75].map((g,i)=><line key={i} x1="0" y1={H*g} x2={W} y2={H*g} stroke={T.g200} strokeWidth="1" strokeDasharray="2 4"/>)}
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {projected && <>
        <path d={`M${fx0},${fy0} L${fx1},${fy1}`} fill="none" stroke={T.strAuto} strokeWidth="2.5" strokeDasharray="3 4" strokeLinecap="round" opacity="0.8"/>
        <circle cx={fx1} cy={fy1} r="4" fill={T.strAuto}/>
        <text x={fx1-2} y={fy1-7} fontSize="11" fontWeight="700" fill={T.strAuto} textAnchor="end" fontFamily='"DM Sans"'>{targetEmoji} {targetMin}%</text>
      </>}
      <circle cx={fx0} cy={fy0} r="4" fill={color} stroke="#fff" strokeWidth="1.5"/>
    </svg>
  );
}

window.StrengthBefore = function({ h=dHabit }) {
  const j = strJourney(h.strength);
  return (
    <div style={{ background:T.g50, border:`1px solid ${T.border}`, borderRadius:T.rXl, boxShadow:T.shadowCard, padding:T.base }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:T.base }}>
        <span style={{ ...Ty.heading3, fontSize:17, color:T.g800 }}>Habit strength</span>
        <div style={{ display:'flex', gap:4, background:T.bg, borderRadius:T.rFull, padding:3 }}>
          {['1M','1Y','All'].map((t,i)=><span key={i} style={{ ...Ty.caption, padding:'3px 10px', borderRadius:T.rFull, background:i===1?T.cardWhite:'transparent', color:i===1?T.g800:T.g500, fontWeight:i===1?700:500 }}>{t}</span>)}
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:T.base }}>
        <Ring pct={h.strength} color={j.current.color} size={116}/>
        <span style={{ ...Ty.heading3, color:T.g800, marginTop:8 }}>{j.current.label}</span>
      </div>
      <div style={{ marginBottom:T.base }}><MilestoneTrackMock idx={j.idx}/></div>
      <div style={{ marginBottom:T.md }}><StrengthChartMock color={j.current.color}/></div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, marginBottom:T.md }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.success} strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
        <span style={{ ...Ty.bodySmall, fontWeight:500, color:T.success }}>Up 6% this month — keep showing up</span>
      </div>
      <div style={{ display:'flex', paddingTop:T.md, borderTop:`1px solid ${T.border}` }}>
        {[['since start','+68%'],['last month','+6%'],['last week','+2%']].map((s,i)=>(
          <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', borderLeft:i?`1px solid ${T.border}`:'none' }}>
            <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:15, fontWeight:700, color:T.success }}>{s[1]}</span>
            <span style={{ ...Ty.caption, fontSize:11, color:T.g500, marginTop:2 }}>{s[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

window.StrengthAfter = function({ h=dHabit }) {
  const j = strJourney(h.strength);
  return (
    <div style={{ background:T.g50, border:`1px solid ${T.border}`, borderRadius:T.rXl, boxShadow:T.shadowCard, padding:T.base }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:T.base }}>
        <span style={{ ...Ty.heading3, fontSize:17, color:T.g800 }}>Habit strength</span>
        <div style={{ display:'flex', gap:4, background:T.bg, borderRadius:T.rFull, padding:3 }}>
          {['1M','1Y','All'].map((t,i)=><span key={i} style={{ ...Ty.caption, padding:'3px 10px', borderRadius:T.rFull, background:i===1?T.cardWhite:'transparent', color:i===1?T.g800:T.g500, fontWeight:i===1?700:500 }}>{t}</span>)}
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:T.base }}>
        <Ring pct={h.strength} color={j.current.color} size={116}/>
        <span style={{ ...Ty.heading3, color:T.g800, marginTop:8 }}>{j.current.label}</span>
      </div>
      <div style={{ marginBottom:T.base }}><MilestoneTrackMock idx={j.idx}/></div>
      <div style={{ marginBottom:T.sm }}><StrengthChartMock color={j.current.color} projected={!!j.next} targetMin={j.next?j.next.min:80} targetEmoji={j.next?j.next.emoji:'💎'} currentPct={h.strength}/></div>

      {(() => {
        const nx = j.next;
        const est = nx ? Math.max(5, Math.round((nx.min - h.strength) * 1.6)) : 0;
        return (
          <div style={{ display:'flex', alignItems:'center', gap:T.md, padding:T.md, marginBottom:T.md,
                        background:T.cardWhite, border:`1px solid ${nx?nx.color:T.strAuto}`, borderRadius:T.rMd }}>
            <div style={{ width:38, height:38, borderRadius:T.rSm, background: nx?`${nx.color}1A`:T.strAutoLight, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>{nx?nx.emoji:'💎'}</div>
            <div style={{ flex:1 }}>
              <div style={{ ...Ty.bodySmall, fontWeight:700, color:T.g800 }}>
                {nx ? <>~{est} days to <span style={{color:nx.color}}>{nx.label}</span></> : <span style={{color:T.strAuto}}>Automatic — locked in</span>}
              </div>
              <div style={{ ...Ty.caption, color:T.g600, marginTop:1 }}>{nx ? "At your current pace. Don't break the chain." : "You've reached the summit — keep the chain alive."}</div>
            </div>
          </div>
        );
      })()}

      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, marginBottom:T.md }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.success} strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
        <span style={{ ...Ty.bodySmall, fontWeight:500, color:T.success }}>Up 6% this month — keep showing up</span>
      </div>
      <div style={{ display:'flex', paddingTop:T.md, borderTop:`1px solid ${T.border}` }}>
        {[['since start','+68%'],['last month','+6%'],['last week','+2%']].map((s,i)=>(
          <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', borderLeft:i?`1px solid ${T.border}`:'none' }}>
            <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:15, fontWeight:700, color:T.success }}>{s[1]}</span>
            <span style={{ ...Ty.caption, fontSize:11, color:T.g500, marginTop:2 }}>{s[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
