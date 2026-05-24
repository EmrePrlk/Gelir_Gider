export interface Habit {
  id: number
  name: string
  description: string
  color: string
  icon: string
  frequency: 'daily' | 'weekdays' | 'custom'
  custom_days: number[]
  target_streak: number
  is_active: boolean
  created_at: string
  current_streak: number
  longest_streak: number
  completion_rate_30: number
  completion_rate_90: number
  completion_rate_all: number
  is_completed_today: boolean
}

export interface HabitLog {
  id: number
  habit: number
  date: string
  completed: boolean
  notes: string
}

export interface HeatmapEntry {
  date: string
  count: number
}

export interface HabitFormData {
  name: string
  description?: string
  color: string
  icon: string
  frequency: 'daily' | 'weekdays' | 'custom'
  custom_days?: number[]
  target_streak?: number
}

export interface ToggleResult {
  completed: boolean
  action: 'completed' | 'uncompleted'
}
