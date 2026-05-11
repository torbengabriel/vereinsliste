import * as XLSX from "xlsx";

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

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function exportJSON(state: State) {
  const data = {
    exportedAt: new Date().toISOString(),
    groups: state.groups,
    members: state.members,
    attendance: state.attendance,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });

  download(blob, `vereinsliste_${today()}.json`);
}

export function exportCSV(state: State) {
  const rows: (string | number)[][] = [
    ["Datum", "Gruppe", "Name", "Anwesend"],
  ];

  const sortedDates = Object.keys(state.attendance).sort();

  for (const date of sortedDates) {
    const day = state.attendance[date];

    for (const member of state.members) {
      const group = state.groups.find((g) => g.id === member.groupId);

      rows.push([
        date,
        group?.name || "",
        member.name,
        day?.[member.id] ? "Ja" : "Nein",
      ]);
    }
  }

  const csv = rows
    .map((r) => r.map((c) => `"${c}"`).join(","))
    .join("\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8",
  });

  download(blob, `vereinsliste_${today()}.csv`);
}

export function exportExcel(state: State) {
  const wb = XLSX.utils.book_new();

  const sortedDates = Object.keys(state.attendance).sort();

  // Sheet 1: Attendance
  const rows: (string | number)[][] = [
    ["Datum", "Gruppe", "Name", "Anwesend"],
  ];

  for (const date of sortedDates) {
    const day = state.attendance[date];

    for (const member of state.members) {
      const group = state.groups.find((g) => g.id === member.groupId);

      rows.push([
        date,
        group?.name || "",
        member.name,
        day?.[member.id] ? "Ja" : "Nein",
      ]);
    }
  }

  const ws1 = XLSX.utils.aoa_to_sheet(rows);
  ws1["!cols"] = [
    { wch: 12 },
    { wch: 12 },
    { wch: 24 },
    { wch: 10 },
  ];

  XLSX.utils.book_append_sheet(wb, ws1, "Anwesenheit");

  // Sheet 2: Members
  const memberRows: (string | number)[][] = [
    ["Name", "Gruppe", "Gesamt Anwesend", "Gesamt Termine"],
  ];

  const totalDates = sortedDates.length;

  for (const member of state.members) {
    const group = state.groups.find((g) => g.id === member.groupId);

    const present = sortedDates.filter(
      (d) => state.attendance[d]?.[member.id]
    ).length;

    memberRows.push([
      member.name,
      group?.name || "",
      present,
      totalDates,
    ]);
  }

  const ws2 = XLSX.utils.aoa_to_sheet(memberRows);
  ws2["!cols"] = [
    { wch: 24 },
    { wch: 12 },
    { wch: 18 },
    { wch: 16 },
  ];

  XLSX.utils.book_append_sheet(wb, ws2, "Mitglieder");

  XLSX.writeFile(wb, `vereinsliste_${today()}.xlsx`);
}