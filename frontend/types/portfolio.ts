export interface AssetClass {
  id: number
  name: string
  key: string
  color: string
}

export interface Asset {
  id: number
  name: string
  symbol: string
  asset_class: AssetClass
  data_source: string
}

export interface PortfolioEntry {
  id: number
  asset: Asset
  quantity: number
  purchase_price: number
  current_price: number | null
  purchase_date: string
  notes: string
  created_at: string
  value: number
  cost: number
  pnl: number
  pnl_pct: number
}

export interface PortfolioSummary {
  total_value: number
  total_cost: number
  pnl: number
  pnl_pct: number
  entry_count: number
}

export interface DistributionItem {
  asset_class_id: number
  asset_class_name: string
  asset_class_color: string
  total_value: number
  percentage: number
}

export interface TargetAllocation {
  id: number
  asset_class: AssetClass
  percentage: number
}

export interface PortfolioEntryFormData {
  asset_id?: number
  asset_name?: string
  asset_symbol?: string
  asset_class_id?: number
  quantity: number
  purchase_price: number
  current_price?: number
  purchase_date: string
  notes?: string
}
