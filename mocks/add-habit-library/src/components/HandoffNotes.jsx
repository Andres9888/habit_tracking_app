export default function HandoffNotes() {
  return (
    <aside className="notes">
      <h3>Add Habit → Library</h3>
      <div className="sub">Bridge mock — how the flow maps to the real app.</div>

      <h4>The flow</h4>
      <ul>
        <li>1 · Add Habit ships a <b>library bridge row</b> under the name field.</li>
        <li>2 · Tap it → full <b>Habit Library</b> slides up (search + categories).</li>
        <li>3 · Pick a card → a <b>draft</b> returns to Add Habit with a provenance chip.</li>
        <li>4 · Create still required. Undo restores the pre-selection draft.</li>
      </ul>

      <h4>Maps to real app</h4>
      <ul>
        <li>Add flow → <code>src/components/CreateHabitModal/</code></li>
        <li>Library → <code>src/screens/TemplatesScreen/</code></li>
        <li>Entry → <code>TemplatesModalSection.tsx</code></li>
      </ul>

      <div className="rule">Selected ≠ Added — From Add Habit returns a draft; Direct Library imports.</div>
    </aside>
  )
}
