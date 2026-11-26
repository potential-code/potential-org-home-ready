import { update } from '../db'

export function markNotificationRead(id: string) {
  update((db) => ({
    ...db,
    notifications: db.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
  }))
}

/** Mark all read for a persona id and its role. */
export function markAllNotificationsRead(personaId: string, role: string) {
  update((db) => ({
    ...db,
    notifications: db.notifications.map((n) =>
      n.to === personaId || n.to === role ? { ...n, read: true } : n,
    ),
  }))
}
