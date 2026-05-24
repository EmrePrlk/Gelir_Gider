import { api } from './client'
import { Task, TaskFormData } from '@/types/tasks'

const BASE = '/api/v1/tasks'

export const tasksApi = {
  list: (params?: Record<string, string>) =>
    api.get<Task[]>(`${BASE}/tasks/`, params ? { params } : undefined),

  today: () => api.get<Task[]>(`${BASE}/tasks/today/`),

  overdue: () => api.get<Task[]>(`${BASE}/tasks/overdue/`),

  weekly: () => api.get<Record<string, Task[]>>(`${BASE}/tasks/weekly/`),

  get: (id: number) => api.get<Task>(`${BASE}/tasks/${id}/`),

  create: (data: TaskFormData) => api.post<Task>(`${BASE}/tasks/`, data),

  update: (id: number, data: Partial<TaskFormData & { status: string }>) =>
    api.patch<Task>(`${BASE}/tasks/${id}/`, data),

  delete: (id: number) => api.delete<void>(`${BASE}/tasks/${id}/`),

  complete: (id: number) => api.post<Task>(`${BASE}/tasks/${id}/complete/`, {}),
}
