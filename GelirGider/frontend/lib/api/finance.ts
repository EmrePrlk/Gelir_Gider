import { api } from './client'
import { getSession } from 'next-auth/react'
import {
  Category, Transaction, FinanceSummary, CategoryBreakdownItem,
  UserExcelSchema, ImportPreviewRow, TransactionFormData, CategoryFormData,
} from '@/types/finance'

const BASE = '/api/v1/finance'

export const financeApi = {
  categories: {
    list: (type?: string) => api.get<Category[]>(`${BASE}/categories/`, type ? { params: { type } } : undefined),
    create: (data: CategoryFormData) => api.post<Category>(`${BASE}/categories/`, data),
    update: (id: number, data: Partial<CategoryFormData>) => api.patch<Category>(`${BASE}/categories/${id}/`, data),
    delete: (id: number) => api.delete<void>(`${BASE}/categories/${id}/`),
  },

  transactions: {
    list: (params?: Record<string, string>) =>
      api.get<Transaction[]>(`${BASE}/transactions/`, params ? { params } : undefined),
    create: (data: TransactionFormData) => api.post<Transaction>(`${BASE}/transactions/`, data),
    update: (id: number, data: Partial<TransactionFormData>) => api.patch<Transaction>(`${BASE}/transactions/${id}/`, data),
    delete: (id: number) => api.delete<void>(`${BASE}/transactions/${id}/`),
  },

  summary: () => api.get<FinanceSummary>(`${BASE}/summary/`),

  breakdown: (params?: Record<string, string>) =>
    api.get<CategoryBreakdownItem[]>(`${BASE}/breakdown/`, params ? { params } : undefined),

  schema: {
    get: () => api.get<UserExcelSchema | null>(`${BASE}/excel-schema/`),
    save: (data: Partial<UserExcelSchema>) => api.put<UserExcelSchema>(`${BASE}/excel-schema/`, data),
  },

  import: async (file: File): Promise<{ preview: ImportPreviewRow[]; count: number }> => {
    const session = await getSession()
    const token = (session as any)?.accessToken as string | undefined
    const url = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'}${BASE}/import/`

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch(url, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Import başarısız' }))
      throw new Error(err.detail)
    }
    return res.json()
  },

  importConfirm: (rows: ImportPreviewRow[]) =>
    api.post<{ created: number }>(`${BASE}/import/confirm/`, { rows }),

  async exportExcel(params?: Record<string, string>): Promise<void> {
    const session = await getSession()
    const token = (session as any)?.accessToken as string | undefined
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'}${BASE}/export/`)
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

    const res = await fetch(url.toString(), {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    if (!res.ok) throw new Error('Export başarısız')

    const blob = await res.blob()
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = 'islemler.xlsx'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(blobUrl)
  },
}
