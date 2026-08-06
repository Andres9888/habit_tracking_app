import { useState } from 'react'

const ICONS = ['⭐', '📖', '🎯', '🚶', '🧘', '💧', '🌙', '🏃', '🍎', '✍️']
const COLORS = ['#059669', '#3B5BDB', '#7C3AED', '#047857', '#1D6FA5', '#4F46E5', '#C9A227', '#DC2626']

export default function Disclosure(p) {
  const [open, setOpen] = useState(false)
  return (
    <div className="disc">
      <div className="disc-head" onClick={() => setOpen((o) => !o)}>
        <span className="t">Customize before creating</span>
        <span className={`chev ${open ? 'open' : ''}`}>⌄</span>
      </div>
      {open && (
        <div className="disc-body">
          <div className="grid-lbl">Icon</div>
          <div className="opt-grid">
            {ICONS.map((i) => (
              <button key={i} className={`opt ${p.icon === i ? 'sel' : ''}`} onClick={() => p.setIcon(i)}>{i}</button>
            ))}
          </div>

          <div className="grid-lbl" style={{ marginTop: 18 }}>Color</div>
          <div className="opt-grid">
            {COLORS.map((c) => (
              <button key={c} className={`swatch ${p.color === c ? 'sel' : ''}`}
                style={{ background: c }} onClick={() => p.setColor(c)} />
            ))}
          </div>

          <div className="rem-row">
            <span className="t">Daily reminder</span>
            <button className={`toggle ${p.reminderOn ? 'on' : ''}`} onClick={() => p.setReminderOn((v) => !v)}>
              <span className="knob" />
            </button>
          </div>
          {p.reminderOn && (
            <input type="time" className="field time-field" value={p.reminderTime}
              onChange={(e) => p.setReminderTime(e.target.value)} />
          )}
        </div>
      )}
    </div>
  )
}
