export default function LibraryBridge({ onOpen }) {
  return (
    <button className="bridge" onClick={onOpen}>
      <span className="tile">📚</span>
      <span>
        <span className="t">Choose from Habit Library</span>
        <span className="s">Start from a proven template</span>
      </span>
      <span className="chev">›</span>
    </button>
  )
}
