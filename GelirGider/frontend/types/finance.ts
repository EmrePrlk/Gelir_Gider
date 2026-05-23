export type TransactionType = 'income' | 'expense'
export type TransactionSource = 'manual' | 'import'

export interface Category {
  id: number
  name: string
  type: TransactionType
  color: string
  icon: string
}

export interface Transaction {
  id: number
  date: string
  amount: number
  description: string
  type: TransactionType
  source: TransactionSource
  notes: string
  created_at: string
  category: number | null
  category_detail: Category | null
}

export interface MonthlyTrendItem {
  month: string
  income: number
  expense: number
}

export interface FinanceSummary {
  income: number
  expense: number
  net: number
  monthly_trend: MonthlyTrendItem[]
}

export interface CategoryBreakdownItem {
  category_id: number | null
  category_name: string
  category_color: string
  category_icon: string
  total: number
  percentage: number
}

export interface UserExcelSchema {
  column_date: string
  column_amount: string
  column_description: string
  column_category: string
  date_format: string
  amount_decimal_separator: string
  updated_at: string
}

export interface ImportPreviewRow {
  date: string
  amount: number
  description: string
  category: string
  type: TransactionType
}

export interface TransactionFormData {
  date: string
  amount: number
  description: string
  type: TransactionType
  category?: number | null
  notes?: string
}

export interface CategoryFormData {
  name: string
  type: TransactionType
  color: string
  icon: string
}

export const CATEGORY_COLORS = [
  '#F87171', '#FB923C', '#FBBF24', '#34D399',
  '#4F8EF7', '#A78BFA', '#EC4899', '#8B5CF6',
]

export const CATEGORY_ICONS = [
  'ShoppingCart', 'UtensilsCrossed', 'Car', 'Zap',
  'Heart', 'Gamepad2', 'Shirt', 'Monitor',
  'Home', 'Briefcase', 'TrendingUp', 'MoreHorizontal',
]
