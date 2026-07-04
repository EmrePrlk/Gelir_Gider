import { api } from './client'
import { DashboardSummary, WeeklyInsight } from '@/types/dashboard'

const AUTH = '/api/v1/auth'

type UserProfile = { id: number; email: string; username: string; first_name: string; last_name: string }

export const dashboardApi = {
  summary: () => api.get<DashboardSummary>(`${AUTH}/dashboard/summary/`),

  weeklyInsight: () => api.get<WeeklyInsight>(`${AUTH}/dashboard/weekly-insight/`),

  generateWeeklyInsight: () => api.post<WeeklyInsight>(`${AUTH}/dashboard/weekly-insight/`, {}),

  getMe: () => api.get<UserProfile>(`${AUTH}/me/`),

  updateProfile: (data: { username?: string; first_name?: string; last_name?: string }) =>
    api.patch<UserProfile>(`${AUTH}/me/`, data),

  changePassword: (data: { current_password: string; new_password: string }) =>
    api.post<{ detail: string }>(`${AUTH}/change-password/`, data),
}
