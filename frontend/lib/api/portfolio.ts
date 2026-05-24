import { api } from './client'
import {
  AssetClass, Asset, PortfolioEntry, PortfolioSummary,
  DistributionItem, TargetAllocation, PortfolioEntryFormData,
} from '@/types/portfolio'

const BASE = '/api/v1/portfolio'

export const portfolioApi = {
  summary: () => api.get<PortfolioSummary>(`${BASE}/summary/`),

  entries: {
    list: () => api.get<PortfolioEntry[]>(`${BASE}/entries/`),
    create: (data: PortfolioEntryFormData) => api.post<PortfolioEntry>(`${BASE}/entries/`, data),
    update: (id: number, data: Partial<PortfolioEntryFormData>) =>
      api.patch<PortfolioEntry>(`${BASE}/entries/${id}/`, data),
    delete: (id: number) => api.delete<void>(`${BASE}/entries/${id}/`),
  },

  assetClasses: () => api.get<AssetClass[]>(`${BASE}/asset-classes/`),
  assets: (assetClass?: string) =>
    api.get<Asset[]>(`${BASE}/assets/`, assetClass ? { params: { asset_class: assetClass } } : undefined),

  distribution: () => api.get<DistributionItem[]>(`${BASE}/distribution/`),

  target: {
    list: () => api.get<TargetAllocation[]>(`${BASE}/target/`),
    save: (allocations: { asset_class_id: number; percentage: number }[]) =>
      api.post<TargetAllocation[]>(`${BASE}/target/`, { allocations }),
  },
}
