// Strength journey + Ring — the subset of detail-screens.jsx that HabitDetailLive depends on.
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
