export interface TodayTask {
  id: number
  title: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'todo' | 'in_progress' | 'done' | 'cancelled'
}

export interface TodayHabit {
  id: number
  name: string
  color: string
  icon: string
  completed: boolean
  streak: number
}

export interface TopPortfolioEntry {
  symbol: string
  name: string
  value: number
  pnl_pct: number
}

export interface PortfolioDistributionItem {
  name: string
  color: string
  value: number
  percentage: number
}

export interface FinanceTrendItem {
  month: string
  income: number
  expense: number
}

export interface DashboardSummary {
  net_worth: number
  month_net: number
  today_tasks: { completed: number; total: number }
  best_streak: number
  finance_trend: FinanceTrendItem[]
  portfolio_distribution: PortfolioDistributionItem[]
  today_habits: TodayHabit[]
  today_tasks_list: TodayTask[]
  top_portfolio: TopPortfolioEntry[]
}
