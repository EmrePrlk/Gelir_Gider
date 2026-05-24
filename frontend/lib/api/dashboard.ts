import { api } from './client'
import { DashboardSummary } from '@/types/dashboard'

const AUTH = '/api/v1/auth'

type UserProfile = { id: number; email: string; username: string; first_name: string; last_name: string }

export const dashboardApi = {
  summary: () => api.get<DashboardSummary>(`${AUTH}/dashboard/summary/`),

  getMe: () => api.get<UserProfile>(`${AUTH}/me/`),

  updateProfile: (data: { username?: string; first_name?: string; last_name?: string }) =>
    api.patch<UserProfile>(`${AUTH}/me/`, data),

  changePassword: (data: { current_password: string; new_password: string }) =>
    api.post<{ detail: string }>(`${AUTH}/change-password/`, data),
}
