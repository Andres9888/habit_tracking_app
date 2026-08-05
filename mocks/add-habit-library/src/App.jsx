import { useState } from 'react'
import PhoneFrame from './components/PhoneFrame.jsx'
import AddHabitScreen from './components/AddHabitScreen.jsx'
import LibraryOverlay from './components/LibraryOverlay.jsx'
import CreatedView from './components/CreatedView.jsx'
import HandoffNotes from './components/HandoffNotes.jsx'

const DEFAULTS = { icon: '⭐', color: '#059669', reminderOn: false, reminderTime: '08:00' }

export default function App() {
  const [view, setView] = useState('add') // add | created
  const [libOpen, setLibOpen] = useState(false)
  const [name, setName] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [draftBackup, setDraftBackup] = useState(null)
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [icon, setIcon] = useState(DEFAULTS.icon)
  const [color, setColor] = useState(DEFAULTS.color)
  const [reminderOn, setReminderOn] = useState(DEFAULTS.reminderOn)
  const [reminderTime, setReminderTime] = useState(DEFAULTS.reminderTime)

  const openLibrary = () => setLibOpen(true)

  const selectTemplate = (t) => {
    setDraftBackup({ name, icon, color, reminderOn, reminderTime })
    setName(t.name)
    setIcon(t.icon)
    setColor(t.color)
    setSelectedTemplate(t)
    setLibOpen(false)
  }

  const undoTemplate = () => {
    if (draftBackup) {
      setName(draftBackup.name)
      setIcon(draftBackup.icon)
      setColor(draftBackup.color)
      setReminderOn(draftBackup.reminderOn)
      setReminderTime(draftBackup.reminderTime)
    }
    setSelectedTemplate(null)
    setDraftBackup(null)
  }

  const create = () => setView('created')

  const reset = () => {
    setView('add'); setName(''); setSelectedTemplate(null); setDraftBackup(null)
    setIcon(DEFAULTS.icon); setColor(DEFAULTS.color)
    setReminderOn(DEFAULTS.reminderOn); setReminderTime(DEFAULTS.reminderTime)
    setCategory('All'); setQuery('')
  }

  const state = {
    name, setName, selectedTemplate, category, setCategory, query, setQuery,
    icon, setIcon, color, setColor, reminderOn, setReminderOn, reminderTime, setReminderTime,
    openLibrary, selectTemplate, undoTemplate, changeTemplate: openLibrary, create,
  }

  return (
    <div className="stage">
      <PhoneFrame>
        {view === 'add'
          ? <AddHabitScreen {...state} />
          : <CreatedView name={name} icon={icon} color={color} reset={reset} />}
        <LibraryOverlay
          open={libOpen} category={category} setCategory={setCategory}
          query={query} setQuery={setQuery}
          onSelect={selectTemplate} onClose={() => setLibOpen(false)}
        />
      </PhoneFrame>
      <HandoffNotes />
    </div>
  )
}
