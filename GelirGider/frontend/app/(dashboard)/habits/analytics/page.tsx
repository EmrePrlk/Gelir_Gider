'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import PageWrapper from '@/components/layout/PageWrapper'
import { Skeleton } from '@/components/ui/Skeleton'
import Button from '@/components/ui/Button'
import { habitsApi } from '@/lib/api/habits'
import { Habit } from '@/types/habits'
import { ArrowLeft, Flame, TrendingUp } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { cn } from '@/lib/utils'

const DAYS_TR = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cts']

function RateBar({ value, color = '#A78BFA' }: { value: number; color?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full progress-fill"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="font-mono text-xs text-text-secondary w-10 text-right tabular-nums">
        {value}%
      </span>
    </div>
  )
}

function rateColor(value: number): string {
  if (value >= 80) return 'var(--success)'
  if (value >= 50) return 'var(--accent-2)'
  if (value >= 30) return 'var(--warning)'
  return 'var(--danger)'
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div
      className="px-3 py-2 text-xs rounded border"
      style={{
        backgroundColor: 'var(--surface-2)',
        borderColor: 'var(--border)',
        color: 'var(--text-primary)',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <p className="font-semibold mb-0.5">{label}</p>
      <p className="text-text-muted">Ort. {payload[0].value.toFixed(1)} tamamlama</p>
    </div>
  )
}

export default function HabitsAnalyticsPage() {
  const { data: habits = [], isLoading: loadingHabits } = useQuery({
    queryKey: ['habits', 'list'],
    queryFn: habitsApi.list,
  })

  const { data: heatmapData = [], isLoading: loadingHeatmap } = useQuery({
    queryKey: ['habits', 'heatmap'],
    queryFn: habitsApi.logs.heatmap,
  })

  // Weekly pattern: average completions per day of week
  const weeklyPattern = useMemo(() => {
    const counts = Array(7).fill(0)
    const weeks = Array(7).fill(0)

    heatmapData.forEach(({ date, count }) => {
      const d = new Date(date)
      const day = d.getDay() // 0=Sun ... 6=Sat
      counts[day] += count
      weeks[day]++
    })

    return DAYS_TR.map((label, i) => ({
      day: label,
      avg: weeks[i] > 0 ? Math.round((counts[i] / weeks[i]) * 10) / 10 : 0,
    }))
  }, [heatmapData])

  const bestDay = weeklyPattern.reduce((a, b) => (a.avg > b.avg ? a : b), { day: '–', avg: 0 })
  const worstDay = weeklyPattern.reduce((a, b) => (a.avg < b.avg ? a : b), { day: '–', avg: Infinity })

  const sortedByStreak = [...habits].sort((a, b) => b.current_streak - a.current_streak)
  const sortedByRate = [...habits].sort((a, b) => b.completion_rate_30 - a.completion_rate_30)

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/habits">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
            Geri
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Alışkanlık Analitiği</h1>
          <p className="text-sm text-text-muted mt-0.5">Streak ve tamamlama oranları</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Aktif Alışkanlık', value: habits.filter((h) => h.is_active).length },
          {
            label: 'En Uzun Streak',
            value: Math.max(0, ...habits.map((h) => h.current_streak)),
            suffix: ' gün',
          },
          { label: 'En İyi Gün', value: bestDay.day },
          { label: 'En Zor Gün', value: worstDay.day === '–' || worstDay.avg === Infinity ? '–' : worstDay.day },
        ].map(({ label, value, suffix = '' }) => (
          <div
            key={label}
            className="rounded-card border p-4"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}
          >
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">{label}</p>
            <p className="font-mono text-xl font-bold text-text-primary">
              {value}{suffix}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Per-habit stats table */}
        <div
          className="rounded-card border overflow-hidden"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}
        >
          <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h2 className="font-display text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Alışkanlık Performansı
            </h2>
          </div>

          {loadingHabits ? (
            <div className="p-5 space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16" />)}
            </div>
          ) : habits.length === 0 ? (
            <div className="p-8 text-center text-text-muted text-sm">
              Henüz alışkanlık yok.
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {habits.map((habit) => (
                <div key={habit.id} className="px-5 py-4">
                  <div className="flex items-center gap-3 mb-3">
                    {/* Color dot */}
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: habit.color }}
                    />
                    <span className="font-display font-semibold text-sm text-text-primary truncate flex-1">
                      {habit.name}
                    </span>
                    {/* Current streak */}
                    {habit.current_streak > 0 && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Flame className="w-3.5 h-3.5 text-warning" />
                        <span className="font-mono text-sm font-semibold text-warning tabular-nums">
                          {habit.current_streak}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-text-muted w-14 flex-shrink-0">Son 30g</span>
                      <RateBar value={habit.completion_rate_30} color={rateColor(habit.completion_rate_30)} />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-text-muted w-14 flex-shrink-0">Son 90g</span>
                      <RateBar value={habit.completion_rate_90} color={rateColor(habit.completion_rate_90)} />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-text-muted w-14 flex-shrink-0">Tüm zamanlar</span>
                      <RateBar value={habit.completion_rate_all} color={rateColor(habit.completion_rate_all)} />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-text-muted">
                      En uzun streak:{' '}
                      <span className="font-mono text-text-secondary">{habit.longest_streak} gün</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Weekly pattern */}
        <div
          className="rounded-card border"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}
        >
          <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h2 className="font-display text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Haftalık Pattern
            </h2>
            <p className="text-xs text-text-muted mt-1">Güne göre ortalama tamamlama sayısı</p>
          </div>

          {loadingHeatmap ? (
            <div className="p-5">
              <Skeleton className="h-48" />
            </div>
          ) : (
            <div className="p-5">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={weeklyPattern} barSize={28}>
                  <XAxis
                    dataKey="day"
                    tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-dm-sans)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'var(--font-dm-mono)' }}
                    axisLine={false}
                    tickLine={false}
                    width={28}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                    {weeklyPattern.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.day === bestDay.day ? '#A78BFA' : '#2A2A38'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Pattern insight */}
              {bestDay.avg > 0 && (
                <div
                  className="mt-4 p-3 rounded-sm text-xs"
                  style={{ backgroundColor: 'var(--surface-2)', color: 'var(--text-secondary)' }}
                >
                  <TrendingUp className="w-3.5 h-3.5 inline mr-1.5 text-accent-2" />
                  En tutarlı günün:{' '}
                  <span className="font-semibold text-text-primary">{bestDay.day}</span>
                  {worstDay.day !== '–' && worstDay.avg !== Infinity && worstDay.avg < bestDay.avg && (
                    <>
                      {' · '}
                      En zorlandığın gün:{' '}
                      <span className="font-semibold text-text-primary">{worstDay.day}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
