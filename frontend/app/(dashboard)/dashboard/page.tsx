'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import PageWrapper from '@/components/layout/PageWrapper'
import { Skeleton } from '@/components/ui/Skeleton'
import { dashboardApi } from '@/lib/api/dashboard'
import { financeApi } from '@/lib/api/finance'
import { habitsApi } from '@/lib/api/habits'
import { tasksApi } from '@/lib/api/tasks'
import { TodayTask, TodayHabit } from '@/types/dashboard'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import {
  Wallet, TrendingUp, TrendingDown, CheckSquare,
  Flame, Circle, CheckCircle2,
} from 'lucide-react'

const MONTHS_SHORT = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']

function fmt(n: number) {
  return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)
}

function monthLabel(m: string) {
  const [, month] = m.split('-')
  return MONTHS_SHORT[parseInt(month) - 1]
}

const PRIORITY_COLOR: Record<string, string> = {
  urgent: 'var(--danger)',
  high: 'var(--warning)',
  medium: 'var(--accent)',
  low: 'var(--text-muted)',
}

export default function DashboardPage() {
  const queryClient = useQueryClient()

  const { data: summary, isLoading } = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: dashboardApi.summary,
  })

  const toggleTaskMutation = useMutation({
    mutationFn: (id: number) => tasksApi.complete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dashboard', 'summary'] }),
  })

  const toggleHabitMutation = useMutation({
    mutationFn: (id: number) => habitsApi.logs.toggle(id, new Date().toISOString().slice(0, 10)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dashboard', 'summary'] }),
  })

  const trendData = (summary?.finance_trend ?? []).map((m) => ({
    name: monthLabel(m.month),
    Gelir: m.income,
    Gider: m.expense,
  }))

  const donutData = (summary?.portfolio_distribution ?? []).map((d) => ({
    name: d.name,
    value: d.value,
    color: d.color,
  }))

  const metricCards = [
    {
      label: 'Net Servet',
      value: summary ? `${fmt(summary.net_worth)} ₺` : null,
      icon: Wallet,
      color: 'var(--accent)',
      sub: 'Toplam portföy değeri',
    },
    {
      label: 'Bu Ay Net',
      value: summary ? `${summary.month_net >= 0 ? '+' : ''}${fmt(summary.month_net)} ₺` : null,
      icon: summary?.month_net !== undefined && summary.month_net >= 0 ? TrendingUp : TrendingDown,
      color: summary?.month_net !== undefined ? (summary.month_net >= 0 ? 'var(--success)' : 'var(--danger)') : 'var(--text-muted)',
      sub: 'Gelir eksi gider',
    },
    {
      label: 'Bugün Görev',
      value: summary ? `${summary.today_tasks.completed} / ${summary.today_tasks.total}` : null,
      icon: CheckSquare,
      color: 'var(--success)',
      sub: 'Tamamlanan / Toplam',
    },
    {
      label: 'En Uzun Streak',
      value: summary ? `${summary.best_streak} gün` : null,
      icon: Flame,
      color: '#F97316',
      sub: 'Aktif alışkanlık serisi',
    },
  ]

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-muted mt-0.5">Bugün, {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </div>

      {/* Row 1 — Hero metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metricCards.map(({ label, value, icon: Icon, color, sub }) => (
          <div
            key={label}
            className="rounded-card border p-4"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}
          >
            {isLoading ? (
              <Skeleton className="h-14" />
            ) : (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
                  <p className="text-xs text-text-muted">{label}</p>
                </div>
                <p className="font-mono text-xl font-bold" style={{ color }}>{value ?? '—'}</p>
                <p className="text-xs text-text-muted mt-0.5">{sub}</p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Row 2 — Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Bar chart */}
        <div
          className="lg:col-span-2 rounded-card border p-5"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <p className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest mb-4">
            Son 12 Ay — Gelir vs Gider
          </p>
          {isLoading ? (
            <Skeleton className="h-48" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={trendData} barSize={8} barGap={2}>
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [`${fmt(v)} ₺`]}
                />
                <Bar dataKey="Gelir" fill="var(--success)" radius={[3, 3, 0, 0]} opacity={0.85} />
                <Bar dataKey="Gider" fill="var(--danger)" radius={[3, 3, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Donut */}
        <div
          className="rounded-card border p-5"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <p className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest mb-4">
            Portföy Dağılımı
          </p>
          {isLoading ? (
            <Skeleton className="h-48" />
          ) : donutData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-text-muted text-sm">Veri yok</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={donutData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value">
                    {donutData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                    formatter={(v: number) => [`${fmt(v)} ₺`]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-1">
                {(summary?.portfolio_distribution ?? []).map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-text-secondary">{d.name}</span>
                    </div>
                    <span className="font-mono text-text-muted">{d.percentage}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Row 3 — Lists */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Today's tasks */}
        <div
          className="rounded-card border p-5"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <p className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest mb-4">
            Bugünün Görevleri
          </p>
          {isLoading ? (
            <div className="space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-8" />)}</div>
          ) : (summary?.today_tasks_list ?? []).length === 0 ? (
            <p className="text-text-muted text-sm">Bugün için görev yok.</p>
          ) : (
            <div className="space-y-2">
              {(summary?.today_tasks_list ?? []).map((task: TodayTask) => (
                <button
                  key={task.id}
                  onClick={() => toggleTaskMutation.mutate(task.id)}
                  className="w-full flex items-center gap-3 text-left group"
                >
                  <div
                    className="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all"
                    style={{
                      borderColor: task.status === 'done' ? 'var(--success)' : PRIORITY_COLOR[task.priority],
                      backgroundColor: task.status === 'done' ? 'var(--success)' : 'transparent',
                    }}
                  >
                    {task.status === 'done' && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span
                    className="text-sm flex-1"
                    style={{
                      color: task.status === 'done' ? 'var(--text-muted)' : 'var(--text-primary)',
                      textDecoration: task.status === 'done' ? 'line-through' : 'none',
                    }}
                  >
                    {task.title}
                  </span>
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: PRIORITY_COLOR[task.priority] }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Today's habits */}
        <div
          className="rounded-card border p-5"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <p className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest mb-4">
            Bugünün Alışkanlıkları
          </p>
          {isLoading ? (
            <div className="space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-8" />)}</div>
          ) : (summary?.today_habits ?? []).length === 0 ? (
            <p className="text-text-muted text-sm">Bugün için alışkanlık yok.</p>
          ) : (
            <div className="space-y-2">
              {(summary?.today_habits ?? []).map((habit: TodayHabit) => (
                <button
                  key={habit.id}
                  onClick={() => toggleHabitMutation.mutate(habit.id)}
                  className="w-full flex items-center gap-3 text-left"
                >
                  <div
                    className="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all"
                    style={{
                      borderColor: habit.color,
                      backgroundColor: habit.completed ? habit.color : 'transparent',
                    }}
                  >
                    {habit.completed && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span
                    className="text-sm flex-1"
                    style={{
                      color: habit.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                      textDecoration: habit.completed ? 'line-through' : 'none',
                    }}
                  >
                    {habit.name}
                  </span>
                  {habit.streak > 0 && (
                    <span className="text-xs font-mono flex items-center gap-0.5" style={{ color: '#F97316' }}>
                      <Flame className="w-3 h-3" />
                      {habit.streak}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Top portfolio */}
        <div
          className="rounded-card border p-5"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <p className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest mb-4">
            Portföy Performansı
          </p>
          {isLoading ? (
            <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-10" />)}</div>
          ) : (summary?.top_portfolio ?? []).length === 0 ? (
            <p className="text-text-muted text-sm">Henüz varlık eklenmemiş.</p>
          ) : (
            <div className="space-y-3">
              {(summary?.top_portfolio ?? []).map((entry) => (
                <div key={entry.symbol} className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-sm font-bold text-text-primary">{entry.symbol}</p>
                    <p className="text-xs text-text-muted">{fmt(entry.value)} ₺</p>
                  </div>
                  <span
                    className="font-mono text-sm font-medium flex items-center gap-0.5"
                    style={{ color: entry.pnl_pct >= 0 ? 'var(--success)' : 'var(--danger)' }}
                  >
                    {entry.pnl_pct >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {entry.pnl_pct >= 0 ? '+' : ''}{entry.pnl_pct.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
