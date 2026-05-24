export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'cancelled'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Task {
  id: number
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  due_date: string | null
  due_time: string | null
  tags: string[]
  is_recurring: boolean
  recurrence_rule: Record<string, unknown> | null
  parent_task: number | null
  completed_at: string | null
  created_at: string
  is_overdue: boolean
}

export interface TaskFormData {
  title: string
  description?: string
  priority?: TaskPriority
  due_date?: string | null
  due_time?: string | null
  tags?: string[]
}

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; border: string }> = {
  urgent: { label: 'Acil',   color: 'var(--danger)',   border: 'var(--danger)' },
  high:   { label: 'Yüksek', color: 'var(--warning)',  border: 'var(--warning)' },
  medium: { label: 'Orta',   color: 'var(--accent)',   border: 'var(--accent)' },
  low:    { label: 'Düşük',  color: 'var(--text-muted)', border: 'var(--border)' },
}

export const STATUS_CONFIG: Record<TaskStatus, { label: string }> = {
  todo:        { label: 'Yapılacak' },
  in_progress: { label: 'Devam Ediyor' },
  done:        { label: 'Tamamlandı' },
  cancelled:   { label: 'İptal' },
}
