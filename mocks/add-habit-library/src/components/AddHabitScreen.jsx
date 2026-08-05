import LibraryBridge from './LibraryBridge.jsx'
import ProvenanceChip from './ProvenanceChip.jsx'
import Disclosure from './Disclosure.jsx'

export default function AddHabitScreen(p) {
  const canCreate = p.name.trim().length > 0

  return (
    <>
      <div className="hdr">
        <button className="iconbtn" title="Close">×</button>
        <h1>Add habit</h1>
        <button
          className={`btn-create ${canCreate ? 'on' : 'off'}`}
          disabled={!canCreate}
          onClick={p.create}
        >Create</button>
      </div>

      <div className="body">
        <div className="hero">What do you want to <span>show up for</span> every day?</div>

        <div className="label">Habit name</div>
        <input
          className="field"
          placeholder="e.g. Read before bed"
          value={p.name}
          onChange={(e) => p.setName(e.target.value)}
        />

        {p.selectedTemplate
          ? <ProvenanceChip
              template={p.selectedTemplate}
              onChange={p.changeTemplate}
              onUndo={p.undoTemplate}
            />
          : <LibraryBridge onOpen={p.openLibrary} />}

        <div className="chips">
          <span className="chip">{p.icon} Icon</span>
          <span className="chip"><i style={{ width: 10, height: 10, borderRadius: 999, background: p.color, display: 'inline-block' }} /> Color</span>
          <span className="chip">{p.reminderOn ? `⏰ ${p.reminderTime}` : '⏰ No reminder'}</span>
        </div>

        <Disclosure {...p} />
      </div>
    </>
  )
}
