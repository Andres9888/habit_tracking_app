export default function ProvenanceChip({ template, onChange, onUndo }) {
  return (
    <div className="prov">
      <div className="top">
        <span className="pill">From Habit Library</span>
        <span className="sel">Selected — not created yet</span>
      </div>
      <div className="name">{template.icon} {template.name}</div>
      <div className="acts">
        <button className="change" onClick={onChange}>Change template</button>
        <button className="undo" onClick={onUndo}>Undo</button>
      </div>
    </div>
  )
}
