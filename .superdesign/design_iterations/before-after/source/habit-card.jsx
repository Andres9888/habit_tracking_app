// Icons + Phone shell (subset of habit-card.jsx used by the Before & After canvas).
const { useState } = React;

window.Icon = {
  link: (c = '#fff', s = 22) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
    </svg>
  ),
  check: (c = '#fff', s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 12 10 18 20 6"/>
    </svg>
  ),
  plus: (c = '#fff', s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  chevron: (c = T.g400, s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  more: (c = T.g500, s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={c}>
      <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
    </svg>
  ),
};

// Phone shell — reusable
window.Phone = function({ children, label, width = 390, height = 780, dark = false }) {
  return (
    <div style={{
      width, height, borderRadius: 44, overflow: 'hidden', position: 'relative',
      background: dark ? '#1A1816' : T.bg,
      boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12), inset 0 0 0 8px #0A0908',
      padding: 8, boxSizing: 'border-box',
    }}>
      <div style={{ width:'100%', height:'100%', borderRadius:36, overflow:'hidden', background: dark ? '#1A1816' : T.bg, position:'relative' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:44, zIndex:10, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px' }}>
          <div style={{ ...Ty.bodySmall, fontWeight:600, color: dark?'#fff':T.g800, paddingTop:14 }}>9:41</div>
          <div style={{ position:'absolute', top:11, left:'50%', transform:'translateX(-50%)', width:110, height:30, borderRadius:20, background:'#000' }} />
          <div style={{ display:'flex', gap:5, alignItems:'center', paddingTop:14 }}>
            <svg width="17" height="11" viewBox="0 0 17 11"><rect x="0" y="6" width="3" height="5" rx="0.6" fill={dark?'#fff':T.g800}/><rect x="4.5" y="4" width="3" height="7" rx="0.6" fill={dark?'#fff':T.g800}/><rect x="9" y="2" width="3" height="9" rx="0.6" fill={dark?'#fff':T.g800}/><rect x="13.5" y="0" width="3" height="11" rx="0.6" fill={dark?'#fff':T.g800}/></svg>
            <svg width="24" height="11" viewBox="0 0 24 11"><rect x="0.5" y="0.5" width="21" height="10" rx="2.5" stroke={dark?'#fff':T.g800} strokeOpacity="0.4" fill="none"/><rect x="2" y="2" width="16" height="7" rx="1.2" fill={dark?'#fff':T.g800}/></svg>
          </div>
        </div>
        <div style={{ width:'100%', height:'100%', overflow:'hidden', paddingTop:44, boxSizing:'border-box' }}>
          {children}
        </div>
      </div>
    </div>
  );
};
