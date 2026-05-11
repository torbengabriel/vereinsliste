import { useState } from "react";
import PresentButton from "./PresentButton/PresentButton";

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

type Props = {
  groups: Group[];
  members: Member[];
  attendance: Attendance;
  toggleAttendance: (date: string, memberId: string) => void;
  setAllAttendance: (
    date: string,
    memberIds: string[],
    value: boolean
  ) => void;
};

export default function AttendanceView({
  groups,
  members,
  attendance,
  toggleAttendance,
  setAllAttendance,
}: Props) {
  const [selectedDate, setSelectedDate] = useState<string>(
    () => new Date().toISOString().slice(0, 10)
  );

  const [activeGroup, setActiveGroup] = useState<string>("all");

  const dayAttendance = attendance[selectedDate] || {};

  const filteredMembers =
    activeGroup === "all"
      ? members
      : members.filter((m) => m.groupId === activeGroup);

  const presentCount = filteredMembers.filter(
    (m) => dayAttendance[m.id]
  ).length;

  const allPresent =
    filteredMembers.length > 0 &&
    filteredMembers.every((m) => dayAttendance[m.id]);

  const toggleAll = () => {
    setAllAttendance(
      selectedDate,
      filteredMembers.map((m) => m.id),
      !allPresent
    );
  };

  return (
    <div className="view">
      <div className="attendance-header">
        <div className="date-row">
          <label className="date-label">Datum</label>
          <input
            type="date"
            className="date-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="stats-row">
          <span className="stat-badge present">
            {presentCount} anwesend
          </span>
          <span className="stat-badge total">
            {filteredMembers.length} gesamt
          </span>
        </div>
      </div>

      <div className="group-tabs">
        <button
          className={`group-tab ${
            activeGroup === "all" ? "active" : ""
          }`}
          onClick={() => setActiveGroup("all")}
        >
          Alle
        </button>

        {groups.map((g) => (
          <button
            key={g.id}
            className={`group-tab ${
              activeGroup === g.id ? "active" : ""
            }`}
            onClick={() => setActiveGroup(g.id)}
          >
            {g.name}
          </button>
        ))}
      </div>

      {filteredMembers.length === 0 ? (
        <div className="empty-state">
          <span>Keine Mitglieder in dieser Gruppe.</span>
          <small>
            Gehe zu „Mitglieder" um welche hinzuzufügen.
          </small>

          {/* optionaler Button im Empty-State */}
          <PresentButton
            active={false}
            onClick={() => console.log("empty state click")}
          />
        </div>
      ) : (
        <>
          <button className="toggle-all-btn" onClick={toggleAll}>
            {allPresent ? "✗ Alle abwesend" : "✓ Alle anwesend"}
          </button>

          <div className="member-list">
            {filteredMembers.map((member) => {
              const isPresent = !!dayAttendance[member.id];
              const group = groups.find(
                (g) => g.id === member.groupId
              );

              return (
                <button
                  key={member.id}
                  className={`member-card ${
                    isPresent ? "present" : ""
                  }`}
                  onClick={() =>
                    toggleAttendance(selectedDate, member.id)
                  }
                >
                  <div className="member-info">
                    <span className="member-name">
                      {member.name}
                    </span>

                    {activeGroup === "all" && (
                      <span className="member-group">
                        {group?.name}
                      </span>
                    )}
                  </div>

                  <div
                    className={`check-circle ${
                      isPresent ? "checked" : ""
                    }`}
                  >
                    {isPresent ? "✓" : ""}
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}