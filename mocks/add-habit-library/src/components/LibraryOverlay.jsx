import { CATEGORIES, TEMPLATES } from '../data/templates.js'
import TemplateCard from './TemplateCard.jsx'

export default function LibraryOverlay({ open, category, setCategory, query, setQuery, onSelect, onClose }) {
  const q = query.trim().toLowerCase()
  const list = TEMPLATES.filter((t) => {
    const catOk = category === 'All' || t.category === category
    const qOk = !q || t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)
    return catOk && qOk
  })

  return (
    <div className={`overlay ${open ? 'open' : ''}`}>
      <div className="ov-hdr">
        <button className="iconbtn" onClick={onClose} title="Back">‹</button>
        <h2>Habit Library</h2>
      </div>

      <div className="searchwrap">
        <input className="field search" placeholder="Search templates"
          value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="rail">
        {CATEGORIES.map((c) => (
          <button key={c} className={`catchip ${category === c ? 'on' : ''}`} onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>

      <div className="cards">
        {list.length === 0
          ? <div className="empty">No templates match “{query}”.</div>
          : list.map((t) => <TemplateCard key={t.id} t={t} onSelect={() => onSelect(t)} />)}
      </div>
    </div>
  )
}
