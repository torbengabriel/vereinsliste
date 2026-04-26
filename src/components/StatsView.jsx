export default function StatsView({ groups, members, attendance }) {
  const allDates = Object.keys(attendance).sort()
  const totalDays = allDates.length

  const getMemberStats = (member) => {
    const present = allDates.filter(d => attendance[d]?.[member.id]).length
    const pct = totalDays > 0 ? Math.round((present / totalDays) * 100) : 0
    return { present, pct }
  }

  const getGroupStats = (group) => {
    const groupMembers = members.filter(m => m.groupId === group.id)
    if (groupMembers.length === 0) return { avg: 0, members: [] }
    const withStats = groupMembers.map(m => ({ ...m, ...getMemberStats(m) }))
    const avg = Math.round(withStats.reduce((s, m) => s + m.pct, 0) / withStats.length)
    return { avg, members: withStats.sort((a, b) => b.pct - a.pct) }
  }

  if (totalDays === 0) {
    return (
      <div className="view">
        <div className="empty-state tall">
          <span>📊</span>
          <span>Noch keine Anwesenheitsdaten.</span>
          <small>Gehe zu „Anwesenheit" und hake Mitglieder ab.</small>
        </div>
      </div>
    )
  }

  return (
    <div className="view">
      <div className="stats-summary">
        <div className="summary-card">
          <span className="summary-num">{totalDays}</span>
          <span className="summary-label">Termine</span>
        </div>
        <div className="summary-card">
          <span className="summary-num">{members.length}</span>
          <span className="summary-label">Mitglieder</span>
        </div>
        <div className="summary-card">
          <span className="summary-num">{groups.length}</span>
          <span className="summary-label">Gruppen</span>
        </div>
      </div>

      {groups.map(group => {
        const { avg, members: gm } = getGroupStats(group)
        return (
          <div key={group.id} className="stats-group">
            <div className="stats-group-header">
              <span className="stats-group-name">{group.name}</span>
              <span className="stats-avg-badge" style={{ '--pct': avg + '%' }}>
                Ø {avg}%
              </span>
            </div>
            {gm.length === 0 ? (
              <p className="no-members">Keine Mitglieder</p>
            ) : (
              <div className="stats-member-list">
                {gm.map(m => (
                  <div key={m.id} className="stats-member-row">
                    <span className="stats-name">{m.name}</span>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: m.pct + '%', '--pct': m.pct / 100 }} />
                    </div>
                    <span className="stats-pct">{m.pct}%</span>
                    <span className="stats-sub">{m.present}/{totalDays}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
