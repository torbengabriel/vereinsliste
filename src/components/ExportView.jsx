import { exportJSON, exportCSV, exportExcel } from '../export.js'

export default function ExportView({ state }) {
  const dateCount = Object.keys(state.attendance).length
  const memberCount = state.members.length

  return (
    <div className="view">
      <div className="export-info">
        <p>Aktuell gespeichert: <strong>{memberCount} Mitglieder</strong>, <strong>{dateCount} Termine</strong></p>
        <p className="hint">Alle Daten liegen lokal auf diesem Gerät. Mit dem Export kannst du sie sichern oder in anderen Programmen öffnen.</p>
      </div>

      <div className="export-cards">
        <div className="export-card">
          <div className="export-icon">{ }</div>
          <div className="export-icon json">{ }</div>
          <div className="export-text">
            <strong>JSON</strong>
            <span>Vollständiger Datenexport. Kann wieder importiert werden.</span>
          </div>
          <button className="export-btn json" onClick={() => exportJSON(state)}>
            JSON exportieren
          </button>
        </div>

        <div className="export-card">
          <div className="export-text">
            <strong>CSV</strong>
            <span>Für Numbers, Google Sheets oder andere Tabellenprogramme.</span>
          </div>
          <button className="export-btn csv" onClick={() => exportCSV(state)}>
            CSV exportieren
          </button>
        </div>

        <div className="export-card">
          <div className="export-text">
            <strong>Excel (.xlsx)</strong>
            <span>Mit zwei Tabellenblättern: Anwesenheit & Mitgliederübersicht.</span>
          </div>
          <button className="export-btn excel" onClick={() => exportExcel(state)}>
            Excel exportieren
          </button>
        </div>
      </div>

      <div className="import-section">
        <p className="section-title">JSON importieren</p>
        <p className="hint">Lade eine zuvor exportierte JSON-Datei wieder hoch.</p>
        <input
          type="file"
          accept=".json"
          className="file-input"
          onChange={e => {
            const file = e.target.files[0]
            if (!file) return
            const reader = new FileReader()
            reader.onload = ev => {
              try {
                const data = JSON.parse(ev.target.result)
                if (confirm('Alle aktuellen Daten überschreiben?')) {
                  localStorage.setItem('vereinsliste_v1', JSON.stringify(data))
                  window.location.reload()
                }
              } catch {
                alert('Ungültige JSON-Datei.')
              }
            }
            reader.readAsText(file)
          }}
        />
      </div>
    </div>
  )
}
