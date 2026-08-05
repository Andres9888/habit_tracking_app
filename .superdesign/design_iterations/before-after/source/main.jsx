// main.jsx — the Before & After canvas app (verbatim from the original file's inline script).
function Intro() {
  return (
    <div style={{ width:820, padding:'48px 56px', marginBottom:60, background:'#fff', borderRadius:2, boxShadow:'0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)' }}>
      <div style={{ fontSize:12, fontWeight:600, color:T.primary700, letterSpacing:1.5, textTransform:'uppercase' }}>Habit Detail · before &amp; after</div>
      <div style={{ fontFamily:'Literata, Georgia, serif', fontSize:42, fontWeight:700, color:T.g800, letterSpacing:-1, lineHeight:1.06, marginTop:16 }}>Making the screen do more, not just look nicer</div>
      <div style={{ fontSize:17, lineHeight:1.55, color:T.g600, marginTop:20 }}>
        The current Detail screen is calm but mostly read-only — the complete action scrolls away, the chain is a static graphic, and every state looks like a healthy habit. The redesign turns it into a place you <b style={{color:T.g800}}>act</b> and <b style={{color:T.g800}}>reflect</b>: a sticky complete bar, an interactive chain you can backfill and annotate, and a real at-risk state. Same tokens, same brand.
      </div>
    </div>
  );
}
function Notes({ items }) {
  return (
    <div style={{ width:300, padding:'8px 0 0 8px' }}>
      <div style={{ fontSize:11, fontWeight:600, color:T.primary700, letterSpacing:1.2, textTransform:'uppercase', marginBottom:12 }}>What changed</div>
      {items.map((n,i)=>(
        <div key={i} style={{ padding:'10px 0', borderTop:i===0?'none':`1px solid ${T.border}`, display:'flex', gap:10 }}>
          <div style={{ flexShrink:0, width:18, height:18, borderRadius:9, background:T.primary100, color:T.primary700, fontSize:11, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', marginTop:2 }}>{i+1}</div>
          <div style={{ fontSize:13, color:T.g700, lineHeight:1.5 }}>{n}</div>
        </div>
      ))}
    </div>
  );
}

function App() {
  return (
    <DesignCanvas>
      <div style={{ padding:'0 60px' }}><Intro/></div>

      <DCSection title="Full screen" subtitle="The whole Habit Detail screen, scrollable. Scroll either phone — note where the complete action lives in each.">
        <div style={{ display:'flex', gap:56, alignItems:'flex-start' }}>
          <DCArtboard label="Before — current" width={390} height={800}><Phone height={800}><DetailScreenBefore/></Phone></DCArtboard>
          <DCArtboard label="After — redesigned" width={390} height={800}><Phone height={800}><DetailScreenAfter/></Phone></DCArtboard>
          <Notes items={[
            'Complete action moved from an inline button (scrolls below the fold) to a sticky bar pinned over the scroll — always one tap away.',
            'Hero leads with the streak numeral (47🔥) instead of a 3-up equal stat band.',
            'The month chain becomes interactive: tap a done day to read its note, tap a missed day to backfill.',
            'Header gains a ••• overflow for Edit · Share · Archive.',
            'Strength keeps the projection card; nothing else removed, just re-prioritised.',
          ]}/>
        </div>
      </DCSection>

      <DCSection title="The new interactions, up close" subtitle="Three states the current screen doesn’t express at all.">
        <div style={{ display:'flex', gap:56, alignItems:'flex-start' }}>
          <DCArtboard label="Tap a day → note + backfill" width={390} height={560}><Phone height={560}><ChainCloseUp/></Phone></DCArtboard>
          <DCArtboard label="At-risk tonight" width={390} height={560}><Phone height={560}><AtRiskFrame/></Phone></DCArtboard>
          <DCArtboard label="Completed — bar settles" width={390} height={560}><Phone height={560}><DoneCloseUp/></Phone></DCArtboard>
        </div>
      </DCSection>
    </DesignCanvas>
  );
}

function ChainCloseUp() {
  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg, position:'relative' }}>
      <NavHeaderProxy/>
      <div style={{ flex:1, overflowY:'auto', paddingBottom:110 }}>
        <ChainCalendar interactive selected={10}/>
      </div>
      <StickyComplete/>
    </div>
  );
}
function DoneCloseUp() {
  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg, position:'relative' }}>
      <NavHeaderProxy/>
      <div style={{ flex:1, overflowY:'auto', paddingBottom:110 }}>
        <DetailHeroAfter/>
        <ChainCalendar interactive selected={null}/>
      </div>
      <StickyComplete done/>
    </div>
  );
}
function NavHeaderProxy() {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:`${T.sm}px ${T.base}px` }}>
      <div style={{ width:32, height:32, borderRadius:T.rFull, background:T.card, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.g700} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </div>
      <div style={{ ...Ty.bodySmall, fontWeight:600, color:T.g700 }}>Evening meditation</div>
      <div style={{ width:32, height:32, borderRadius:T.rFull, background:T.card, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.more(T.g700, 18)}</div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
