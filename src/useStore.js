import { useState, useEffect } from 'react'

const STORAGE_KEY = 'vereinsliste_v1'

const defaultState = {
  groups: [
    { id: 'g1', name: 'U12' },
    { id: 'g2', name: 'U15' },
    { id: 'g3', name: 'Herren' },
  ],
  members: [],
  attendance: {}, // { "YYYY-MM-DD": { memberId: true/false } }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...defaultState, ...JSON.parse(raw) } : defaultState
  } catch {
    return defaultState
  }
}

function save(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function useStore() {
  const [state, setState] = useState(load)

  useEffect(() => {
    save(state)
  }, [state])

  const update = (fn) => setState(prev => {
    const next = fn(prev)
    return next
  })

  // --- Groups ---
  const addGroup = (name) => update(s => ({
    ...s,
    groups: [...s.groups, { id: crypto.randomUUID(), name: name.trim() }]
  }))

  const deleteGroup = (id) => update(s => ({
    ...s,
    groups: s.groups.filter(g => g.id !== id),
    members: s.members.filter(m => m.groupId !== id)
  }))

  const renameGroup = (id, name) => update(s => ({
    ...s,
    groups: s.groups.map(g => g.id === id ? { ...g, name } : g)
  }))

  // --- Members ---
  const addMember = (name, groupId) => update(s => ({
    ...s,
    members: [...s.members, { id: crypto.randomUUID(), name: name.trim(), groupId }]
  }))

  const deleteMember = (id) => update(s => {
    const next = { ...s, members: s.members.filter(m => m.id !== id) }
    // clean attendance
    Object.keys(next.attendance).forEach(date => {
      delete next.attendance[date][id]
    })
    return next
  })

  const updateMember = (id, patch) => update(s => ({
    ...s,
    members: s.members.map(m => m.id === id ? { ...m, ...patch } : m)
  }))

  // --- Attendance ---
  const toggleAttendance = (date, memberId) => update(s => {
    const day = s.attendance[date] || {}
    return {
      ...s,
      attendance: {
        ...s.attendance,
        [date]: { ...day, [memberId]: !day[memberId] }
      }
    }
  })

  const setAllAttendance = (date, memberIds, value) => update(s => {
    const day = s.attendance[date] || {}
    const updated = { ...day }
    memberIds.forEach(id => { updated[id] = value })
    return { ...s, attendance: { ...s.attendance, [date]: updated } }
  })

  return {
    ...state,
    addGroup, deleteGroup, renameGroup,
    addMember, deleteMember, updateMember,
    toggleAttendance, setAllAttendance,
  }
}
