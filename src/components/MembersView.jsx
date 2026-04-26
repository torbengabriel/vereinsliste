import { useState } from 'react'

export default function MembersView({ groups, members, addMember, deleteMember, updateMember, addGroup, deleteGroup, renameGroup }) {
  const [activeGroup, setActiveGroup] = useState(groups[0]?.id || '')
  const [newMemberName, setNewMemberName] = useState('')
  const [newGroupName, setNewGroupName] = useState('')
  const [editingGroup, setEditingGroup] = useState(null)
  const [editingMember, setEditingMember] = useState(null)
  const [showGroupForm, setShowGroupForm] = useState(false)

  const handleAddMember = () => {
    if (!newMemberName.trim() || !activeGroup) return
    addMember(newMemberName, activeGroup)
    setNewMemberName('')
  }

  const handleAddGroup = () => {
    if (!newGroupName.trim()) return
    addGroup(newGroupName)
    setNewGroupName('')
    setShowGroupForm(false)
  }

  const groupMembers = members.filter(m => m.groupId === activeGroup)

  return (
    <div className="view">
      {/* Group sidebar */}
      <div className="members-layout">
        <div className="groups-panel">
          <div className="panel-header">
            <span className="panel-title">Gruppen</span>
            <button className="icon-btn" onClick={() => setShowGroupForm(v => !v)}>+</button>
          </div>

          {showGroupForm && (
            <div className="inline-form">
              <input
                className="inline-input"
                placeholder="Gruppenname"
                value={newGroupName}
                onChange={e => setNewGroupName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddGroup()}
                autoFocus
              />
              <button className="inline-btn" onClick={handleAddGroup}>OK</button>
            </div>
          )}

          <div className="group-list">
            {groups.map(g => (
              <div key={g.id} className={`group-item ${activeGroup === g.id ? 'active' : ''}`}>
                {editingGroup === g.id ? (
                  <input
                    className="inline-input small"
                    defaultValue={g.name}
                    autoFocus
                    onBlur={e => { renameGroup(g.id, e.target.value); setEditingGroup(null) }}
                    onKeyDown={e => { if (e.key === 'Enter') { renameGroup(g.id, e.target.value); setEditingGroup(null) } }}
                  />
                ) : (
                  <button className="group-select-btn" onClick={() => setActiveGroup(g.id)}>
                    <span>{g.name}</span>
                    <span className="group-count">{members.filter(m => m.groupId === g.id).length}</span>
                  </button>
                )}
                <div className="group-actions">
                  <button className="micro-btn" onClick={() => setEditingGroup(g.id)}>✎</button>
                  <button className="micro-btn danger" onClick={() => {
                    if (confirm(`Gruppe „${g.name}" und alle Mitglieder löschen?`)) deleteGroup(g.id)
                  }}>✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Members panel */}
        <div className="members-panel">
          <div className="panel-header">
            <span className="panel-title">
              {groups.find(g => g.id === activeGroup)?.name || 'Mitglieder'}
            </span>
          </div>

          <div className="inline-form">
            <input
              className="inline-input"
              placeholder="Name eingeben…"
              value={newMemberName}
              onChange={e => setNewMemberName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddMember()}
              disabled={!activeGroup}
            />
            <button className="inline-btn" onClick={handleAddMember} disabled={!activeGroup}>
              Hinzufügen
            </button>
          </div>

          {groupMembers.length === 0 ? (
            <div className="empty-state">
              <span>Noch keine Mitglieder.</span>
              <small>Oben einen Namen eingeben und Enter drücken.</small>
            </div>
          ) : (
            <div className="member-list flat">
              {groupMembers.map(m => (
                <div key={m.id} className="member-row">
                  {editingMember === m.id ? (
                    <input
                      className="inline-input small"
                      defaultValue={m.name}
                      autoFocus
                      onBlur={e => { updateMember(m.id, { name: e.target.value }); setEditingMember(null) }}
                      onKeyDown={e => { if (e.key === 'Enter') { updateMember(m.id, { name: e.target.value }); setEditingMember(null) } }}
                    />
                  ) : (
                    <span className="member-name">{m.name}</span>
                  )}
                  <div className="row-actions">
                    <button className="micro-btn" onClick={() => setEditingMember(m.id)}>✎</button>
                    <button className="micro-btn danger" onClick={() => {
                      if (confirm(`„${m.name}" löschen?`)) deleteMember(m.id)
                    }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
