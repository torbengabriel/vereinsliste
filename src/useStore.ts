import { useState, useEffect } from "react";

const STORAGE_KEY = "vereinsliste_v1";

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

const defaultState: State = {
  groups: [
    { id: "g1", name: "U12" },
    { id: "g2", name: "U15" },
    { id: "g3", name: "Herren" },
  ],
  members: [],
  attendance: {},
};

function load(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultState, ...JSON.parse(raw) } : defaultState;
  } catch {
    return defaultState;
  }
}

function save(state: State) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useStore() {
  const [state, setState] = useState<State>(load);

  useEffect(() => {
    save(state);
  }, [state]);

  const update = (fn: (prev: State) => State) =>
    setState((prev) => fn(prev));

  // --- Groups ---
  const addGroup = (name: string) =>
    update((s) => ({
      ...s,
      groups: [
        ...s.groups,
        { id: crypto.randomUUID(), name: name.trim() },
      ],
    }));

  const deleteGroup = (id: string) =>
    update((s) => ({
      ...s,
      groups: s.groups.filter((g) => g.id !== id),
      members: s.members.filter((m) => m.groupId !== id),
    }));

  const renameGroup = (id: string, name: string) =>
    update((s) => ({
      ...s,
      groups: s.groups.map((g) =>
        g.id === id ? { ...g, name } : g
      ),
    }));

  // --- Members ---
  const addMember = (name: string, groupId: string) =>
    update((s) => ({
      ...s,
      members: [
        ...s.members,
        { id: crypto.randomUUID(), name: name.trim(), groupId },
      ],
    }));

  const deleteMember = (id: string) =>
    update((s) => {
      const next = {
        ...s,
        members: s.members.filter((m) => m.id !== id),
      };

      Object.keys(next.attendance).forEach((date) => {
        delete next.attendance[date][id];
      });

      return next;
    });

  const updateMember = (
    id: string,
    patch: Partial<Member>
  ) =>
    update((s) => ({
      ...s,
      members: s.members.map((m) =>
        m.id === id ? { ...m, ...patch } : m
      ),
    }));

  // --- Attendance ---
  const toggleAttendance = (date: string, memberId: string) =>
    update((s) => {
      const day = s.attendance[date] || {};
      return {
        ...s,
        attendance: {
          ...s.attendance,
          [date]: {
            ...day,
            [memberId]: !day[memberId],
          },
        },
      };
    });

  const setAllAttendance = (
    date: string,
    memberIds: string[],
    value: boolean
  ) =>
    update((s) => {
      const day = s.attendance[date] || {};
      const updated = { ...day };

      memberIds.forEach((id) => {
        updated[id] = value;
      });

      return {
        ...s,
        attendance: {
          ...s.attendance,
          [date]: updated,
        },
      };
    });

  return {
    ...state,
    addGroup,
    deleteGroup,
    renameGroup,
    addMember,
    deleteMember,
    updateMember,
    toggleAttendance,
    setAllAttendance,
  };
}