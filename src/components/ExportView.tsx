import { exportJSON, exportCSV, exportExcel } from "../export";
import React from "react";

type Group = {
  id: string;
  name: string;
};

type Member = {
  id: string;
  name: string;
  groupId: string;
};

type Attendance = Record<string, Record<string, boolean>>;

type State = {
  groups: Group[];
  members: Member[];
  attendance: Attendance;
};

type Props = {
  state: State;
};

export default function ExportView({ state }: Props) {
  const dateCount = Object.keys(state.attendance).length;
  const memberCount = state.members.length;

  return (
    <div className="view">
      <div className="export-info">
        <p>
          Aktuell gespeichert:{" "}
          <strong>{memberCount} Mitglieder</strong>,{" "}
          <strong>{dateCount} Termine</strong>
        </p>

        <p className="hint">
          Alle Daten liegen lokal auf diesem Gerät. Mit dem Export kannst du sie
          sichern oder in anderen Programmen öffnen.
        </p>
      </div>

      <div className="export-cards">
        <div className="export-card">
          <div className="export-text">
            <strong>JSON</strong>
            <span>Vollständiger Datenexport. Kann wieder importiert werden.</span>
          </div>

          <button
            className="export-btn json"
            onClick={() => exportJSON(state)}
          >
            JSON exportieren
          </button>
        </div>

        <div className="export-card">
          <div className="export-text">
            <strong>CSV</strong>
            <span>Für Tabellenprogramme.</span>
          </div>

          <button
            className="export-btn csv"
            onClick={() => exportCSV(state)}
          >
            CSV exportieren
          </button>
        </div>

        <div className="export-card">
          <div className="export-text">
            <strong>Excel (.xlsx)</strong>
            <span>Mit zwei Tabellenblättern.</span>
          </div>

          <button
            className="export-btn excel"
            onClick={() => exportExcel(state)}
          >
            Excel exportieren
          </button>
        </div>
      </div>

      <div className="import-section">
        <p className="section-title">JSON importieren</p>

        <input
          type="file"
          accept=".json"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();

            reader.onload = (ev) => {
              try {
                const data = JSON.parse(
                  ev.target?.result as string
                );

                if (confirm("Alle aktuellen Daten überschreiben?")) {
                  localStorage.setItem(
                    "vereinsliste_v1",
                    JSON.stringify(data)
                  );
                  window.location.reload();
                }
              } catch {
                alert("Ungültige JSON-Datei.");
              }
            };

            reader.readAsText(file);
          }}
        />
      </div>
    </div>
  );
}