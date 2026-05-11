import { useState } from "react";
import { useStore } from "./useStore";

import AttendanceView from "./components/AttendanceView";
import MembersView from "./components/MembersView";
import StatsView from "./components/StatsView";
import ExportView from "./components/ExportView";

import FloatingActionButton from "./components/FloatingActionButton/FloatingActionButton";
import UserModal from "./components/modals/UserModal/UserModal";

import { IoIosAddCircleOutline } from "react-icons/io";

const TABS = [
  { id: "attendance", label: "Anwesenheit", icon: "✓" },
  { id: "members", label: "Mitglieder", icon: "👥" },
  { id: "stats", label: "Statistik", icon: "📊" },
  { id: "export", label: "Export", icon: "⬇" },
];

export default function App() {
  const [tab, setTab] = useState<string>("attendance");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const store = useStore();

  return (
    <div className="app">
      <header className="app-header">
        <div style={{ width: 28 }} />
        <h1 className="app-title">Meine Vereinsliste</h1>
        <IoIosAddCircleOutline size={28} color="var(--surface)" />
      </header>

      <main className="app-main">
        {tab === "attendance" && <AttendanceView {...store} />}
        {tab === "members" && <MembersView {...store} />}
        {tab === "stats" && (
          <StatsView
            groups={store.groups}
            members={store.members}
            attendance={store.attendance}
          />
        )}
        {tab === "export" && (
          <ExportView
            state={{
              groups: store.groups,
              members: store.members,
              attendance: store.attendance,
            }}
          />
        )}
      </main>

      <FloatingActionButton
        onCreateUser={() => setIsModalOpen(true)}
        onDeactivateUser={() => alert("User deaktivieren")}
      />

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => {
          console.log("User:", data);

          // optional: hier direkt in store schreiben
          store.addMember(data.firstName + " " + data.lastName, "");

          setIsModalOpen(false);
        }}
      />

      <nav className="tab-bar">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab-btn ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            <span className="tab-icon">{t.icon}</span>
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}