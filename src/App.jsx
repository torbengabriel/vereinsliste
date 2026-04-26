import { useState } from 'react'
import { useStore } from './useStore.js'
import AttendanceView from './components/AttendanceView.jsx'
import MembersView from './components/MembersView.jsx'
import StatsView from './components/StatsView.jsx'
import ExportView from './components/ExportView.jsx'
import { IoIosAddCircleOutline } from "react-icons/io";

const TABS = [
  { id: 'attendance', label: 'Anwesenheit', icon: '✓' },
  { id: 'members',    label: 'Mitglieder',  icon: '👥' },
  { id: 'stats',      label: 'Statistik',   icon: '📊' },
  { id: 'export',     label: 'Export',      icon: '⬇' },
]

export default function App() {
  const [tab, setTab] = useState('attendance')
  const store = useStore()

  return (
    <div className="app">
      <header className="app-header">
        <div style={{ width: 28 }} />
        <h1 className="app-title">Meine Vereinsliste</h1>
        <IoIosAddCircleOutline size={28} color="var(--surface)" />
      </header>

      <main className="app-main">
        {tab === 'attendance' && <AttendanceView {...store} />}
        {tab === 'members'    && <MembersView {...store} />}
        {tab === 'stats'      && <StatsView groups={store.groups} members={store.members} attendance={store.attendance} />}
        {tab === 'export'     && <ExportView state={{ groups: store.groups, members: store.members, attendance: store.attendance }} />}
      </main>

      <nav className="tab-bar">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`tab-btn ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span className="tab-icon">{t.icon}</span>
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
