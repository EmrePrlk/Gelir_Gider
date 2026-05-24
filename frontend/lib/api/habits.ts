import { api } from './client'
import { getSession } from 'next-auth/react'
import { Habit, HabitLog, HeatmapEntry, HabitFormData, ToggleResult } from '@/types/habits'

const BASE = '/api/v1/habits'

export const habitsApi = {
  list: () => api.get<Habit[]>(`${BASE}/habits/`),

  today: () => api.get<Habit[]>(`${BASE}/habits/today/`),

  get: (id: number) => api.get<Habit>(`${BASE}/habits/${id}/`),

  create: (data: HabitFormData) => api.post<Habit>(`${BASE}/habits/`, data),

  update: (id: number, data: Partial<HabitFormData>) =>
    api.patch<Habit>(`${BASE}/habits/${id}/`, data),

  delete: (id: number) => api.delete<void>(`${BASE}/habits/${id}/`),

  logs: {
    list: (habitId?: number) =>
      api.get<HabitLog[]>(`${BASE}/logs/`, habitId ? { params: { habit: habitId } } : undefined),

    toggle: (habitId: number, date?: string) =>
      api.post<ToggleResult>(`${BASE}/logs/toggle/`, {
        habit: habitId,
        date: date ?? new Date().toISOString().split('T')[0],
      }),

    heatmap: () => api.get<HeatmapEntry[]>(`${BASE}/logs/heatmap/`),
  },

  async exportExcel(): Promise<void> {
    const session = await getSession()
    const token = (session as any)?.accessToken as string | undefined
    const url = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'}${BASE}/habits/export_excel/`

    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    if (!res.ok) throw new Error('Export başarısız')

    const blob = await res.blob()
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = 'aliskanliklar.xlsx'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(blobUrl)
  },
}
