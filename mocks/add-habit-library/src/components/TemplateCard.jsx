function tint(hex) {
  return hex + '22'
}

export default function TemplateCard({ t, onSelect }) {
  return (
    <button className="tcard" onClick={onSelect}>
      <span className="tile" style={{ background: tint(t.color), color: t.color }}>{t.icon}</span>
      <span style={{ flex: 1 }}>
        <span className="t">{t.name}</span>
        <span className="d">{t.desc}</span>
        <span className="pills">
          {t.pills.map((p) => <span key={p} className="p">{p}</span>)}
        </span>
      </span>
    </button>
  )
}
