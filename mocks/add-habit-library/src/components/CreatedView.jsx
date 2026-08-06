function tint(hex) { return hex + '22' }

export default function CreatedView({ name, icon, color, reset }) {
  return (
    <div className="created">
      <div className="badge">✓</div>
      <h2>You’re set</h2>
      <p>{name} is on your list. First check-in is today.</p>

      <div className="habitcard">
        <div className="row">
          <span className="tile" style={{ background: tint(color), color }}>{icon}</span>
          <span>
            <div className="t">{name}</div>
            <div className="s">Day 1 · streak starts today</div>
          </span>
        </div>
        <div className="chain">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={`cell ${i === 0 ? 'on' : ''}`} />
          ))}
        </div>
      </div>

      <button className="btn-ghost" onClick={reset}>Add another habit</button>
    </div>
  )
}
