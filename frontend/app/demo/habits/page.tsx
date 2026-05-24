'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import HabitCard from '@/components/modules/habits/HabitCard'
import HabitHeatmap from '@/components/modules/habits/HabitHeatmap'
import AddHabitModal from '@/components/modules/habits/AddHabitModal'
import { Habit, HeatmapEntry, HabitFormData } from '@/types/habits'
import { Plus, Download, BarChart3, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

/* ── Mock data ─────────────────────────────────────────── */

const MOCK_HABITS_BASE: Habit[] = [
  {
    id: 1, name: 'Meditasyon', description: 'Günde 10 dakika',
    color: '#A78BFA', icon: 'Brain', frequency: 'daily', custom_days: [],
    target_streak: 30, is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    current_streak: 7, longest_streak: 21,
    completion_rate_30: 86.7, completion_rate_90: 78.9, completion_rate_all: 74.2,
    is_completed_today: true,
  },
  {
    id: 2, name: 'Sabah Koşusu', description: '5km yavaş tempo',
    color: '#4F8EF7', icon: 'Flame', frequency: 'weekdays', custom_days: [],
    target_streak: 20, is_active: true,
    created_at: '2025-02-01T00:00:00Z',
    current_streak: 3, longest_streak: 14,
    completion_rate_30: 60.0, completion_rate_90: 55.6, completion_rate_all: 61.1,
    is_completed_today: false,
  },
  {
    id: 3, name: 'Kitap Okuma', description: 'En az 20 sayfa',
    color: '#34D399', icon: 'BookOpen', frequency: 'daily', custom_days: [],
    target_streak: 100, is_active: true,
    created_at: '2024-09-01T00:00:00Z',
    current_streak: 15, longest_streak: 47,
    completion_rate_30: 93.3, completion_rate_90: 87.8, completion_rate_all: 82.4,
    is_completed_today: true,
  },
  {
    id: 4, name: '2L Su İçmek', description: '',
    color: '#F5C842', icon: 'Droplets', frequency: 'daily', custom_days: [],
    target_streak: 0, is_active: true,
    created_at: '2025-03-01T00:00:00Z',
    current_streak: 0, longest_streak: 8,
    completion_rate_30: 43.3, completion_rate_90: 38.9, completion_rate_all: 41.5,
    is_completed_today: false,
  },
  {
    id: 5, name: 'Spor / Ağırlık', description: 'Haftada 3 gün',
    color: '#F87171', icon: 'Dumbbell', frequency: 'custom', custom_days: [1, 3, 5],
    target_streak: 12, is_active: true,
    created_at: '2025-01-15T00:00:00Z',
    current_streak: 4, longest_streak: 10,
    completion_rate_30: 75.0, completion_rate_90: 68.5, completion_rate_all: 70.3,
    is_completed_today: true,
  },
]

/* Generate realistic heatmap data for 365 days */
function genHeatmap(): HeatmapEntry[] {
  const entries: HeatmapEntry[] = []
  const today = new Date()
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const dayOfWeek = d.getDay()
    // Weekend slightly less likely
    const prob = dayOfWeek === 0 || dayOfWeek === 6 ? 0.55 : 0.72
    if (Math.random() < prob) {
      const count = Math.min(5, Math.floor(Math.random() * 4) + 1)
      entries.push({ date: dateStr, count })
    }
  }
  return entries
}

const HEATMAP_DATA = genHeatmap()

const DAYS_TR = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cts']
const MONTHS_TR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']

function todayLabel() {
  const d = new Date()
  return `${DAYS_TR[d.getDay()]}, ${d.getDate()} ${MONTHS_TR[d.getMonth()]}`
}

function rateColor(v: number) {
  if (v >= 80) return 'var(--success)'
  if (v >= 50) return 'var(--accent-2)'
  if (v >= 30) return 'var(--warning)'
  return 'var(--danger)'
}

/* Weekly pattern from heatmap */
function computeWeekly(data: HeatmapEntry[]) {
  const counts = Array(7).fill(0)
  const weeks = Array(7).fill(0)
  data.forEach(({ date, count }) => {
    const day = new Date(date).getDay()
    counts[day] += count
    weeks[day]++
  })
  return DAYS_TR.map((label, i) => ({
    day: label,
    avg: weeks[i] > 0 ? Math.round((counts[i] / weeks[i]) * 10) / 10 : 0,
  }))
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="px-3 py-2 text-xs rounded border"
      style={{ backgroundColor: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)', boxShadow: 'var(--shadow-md)' }}>
      <p className="font-semibold mb-0.5">{label}</p>
      <p className="text-text-muted">Ort. {payload[0].value.toFixed(1)} tamamlama</p>
    </div>
  )
}

/* ── Page ───────────────────────────────────────────────── */

export default function DemoHabitsPage() {
  const [habits, setHabits] = useState<Habit[]>(MOCK_HABITS_BASE)
  const [tab, setTab] = useState<'today' | 'analytics'>('today')
  const [showModal, setShowModal] = useState(false)

  const completedCount = habits.filter((h) => h.is_completed_today).length
  const totalCount = habits.length
  const pct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  const handleToggle = async (id: number) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              is_completed_today: !h.is_completed_today,
              current_streak: !h.is_completed_today
                ? h.current_streak + 1
                : Math.max(0, h.current_streak - 1),
            }
          : h,
      ),
    )
  }

  const handleAddHabit = async (data: HabitFormData) => {
    const newHabit: Habit = {
      id: Date.now(),
      name: data.name,
      description: data.description ?? '',
      color: data.color,
      icon: data.icon,
      frequency: data.frequency,
      custom_days: data.custom_days ?? [],
      target_streak: data.target_streak ?? 0,
      is_active: true,
      created_at: new Date().toISOString(),
      current_streak: 0,
      longest_streak: 0,
      completion_rate_30: 0,
      completion_rate_90: 0,
      completion_rate_all: 0,
      is_completed_today: false,
    }
    setHabits((prev) => [...prev, newHabit])
    setShowModal(false)
  }

  const weeklyData = useMemo(() => computeWeekly(HEATMAP_DATA), [])
  const bestDay = weeklyData.reduce((a, b) => (a.avg > b.avg ? a : b), { day: '–', avg: 0 })

  return (
    <div className="flex min-h-screen bg-background">
      {/* Minimal sidebar */}
      <aside className="fixed left-0 top-0 h-full w-16 bg-surface border-r border-border flex flex-col items-center py-4 z-40">
        <div className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center shadow-glow-gold mb-6">
          <Zap className="w-4 h-4 text-background" />
        </div>
        <div className="text-[10px] text-text-muted text-center px-1 mt-auto mb-4">DEMO</div>
      </aside>

      <main className="flex-1 ml-16">
        <div className="max-w-dashboard mx-auto px-6 py-8 page-enter">
          {/* Demo banner */}
          <div
            className="mb-6 px-4 py-2.5 rounded-card border text-xs flex items-center gap-2"
            style={{ backgroundColor: '#A78BFA18', borderColor: '#A78BFA40', color: '#A78BFA' }}
          >
            <span className="font-semibold">Demo Modu</span>
            <span className="text-text-muted">— Backend bağlantısı olmadan çalışıyor. Tüm veriler sahte.</span>
          </div>

          {/* Tab toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setTab('today')}
              className={cn(
                'px-4 py-1.5 text-sm rounded-sm border transition-all duration-150',
                tab === 'today'
                  ? 'bg-accent-2/10 text-accent-2 border-accent-2/40'
                  : 'bg-surface text-text-muted border-border hover:text-text-primary',
              )}
            >
              Bugün
            </button>
            <button
              onClick={() => setTab('analytics')}
              className={cn(
                'px-4 py-1.5 text-sm rounded-sm border transition-all duration-150',
                tab === 'analytics'
                  ? 'bg-accent-2/10 text-accent-2 border-accent-2/40'
                  : 'bg-surface text-text-muted border-border hover:text-text-primary',
              )}
            >
              Analitik
            </button>
          </div>

          {tab === 'today' ? (
            <>
              {/* Header */}
              <div className="flex items-start justify-between mb-8 gap-4">
                <div>
                  <h1 className="font-display text-2xl font-bold text-text-primary">Alışkanlıklar</h1>
                  <p className="text-sm text-text-muted mt-0.5">{todayLabel()}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => setTab('analytics')}>
                    <BarChart3 className="w-4 h-4" />
                    Analitik
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Download className="w-4 h-4" />
                    Excel
                  </Button>
                  <Button size="sm" onClick={() => setShowModal(true)}>
                    <Plus className="w-4 h-4" />
                    Yeni Alışkanlık
                  </Button>
                </div>
              </div>

              {/* Today section */}
              <section className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest">Bugün</span>
                  <span className="font-mono text-xs text-text-muted">{completedCount} / {totalCount} tamamlandı</span>
                </div>

                {/* Progress bar */}
                <div className="mb-4 h-[3px] bg-surface-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full progress-fill"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: pct === 100 ? 'var(--success)' : pct >= 50 ? 'var(--accent-2)' : 'var(--accent)',
                      transition: 'width 500ms ease-out',
                    }}
                  />
                </div>

                <div className="space-y-2">
                  {habits.map((habit) => (
                    <HabitCard key={habit.id} habit={habit} onToggle={handleToggle} />
                  ))}
                </div>

                {completedCount === totalCount && (
                  <div className="mt-4 px-4 py-3 rounded-card border text-sm font-medium text-center"
                    style={{ backgroundColor: 'var(--success)18', borderColor: 'var(--success)40', color: 'var(--success)' }}>
                    Bugünün tüm alışkanlıklarını tamamladın! 🎯
                  </div>
                )}
              </section>

              {/* Heatmap */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest">Yıllık Görünüm</span>
                  <span className="text-xs text-text-muted">Son 12 ay</span>
                </div>
                <div className="rounded-card border p-5" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                  <HabitHeatmap data={HEATMAP_DATA} />
                  <div className="flex items-center justify-end gap-1.5 mt-4">
                    <span className="text-xs text-text-muted mr-1">Az</span>
                    {[0, 1, 2, 3, 4].map((level) => (
                      <div key={level} className="w-3 h-3 rounded-sm" style={{ backgroundColor: level === 0 ? 'var(--surface-2)' : `rgba(167, 139, 250, ${level * 0.22 + 0.1})` }} />
                    ))}
                    <span className="text-xs text-text-muted ml-1">Çok</span>
                  </div>
                </div>
              </section>
            </>
          ) : (
            /* Analytics tab */
            <>
              <div className="flex items-center gap-4 mb-8">
                <button onClick={() => setTab('today')} className="text-text-muted hover:text-text-primary text-sm flex items-center gap-1">
                  ← Geri
                </button>
                <div>
                  <h1 className="font-display text-2xl font-bold text-text-primary">Alışkanlık Analitiği</h1>
                  <p className="text-sm text-text-muted mt-0.5">Streak ve tamamlama oranları</p>
                </div>
              </div>

              {/* Summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {[
                  { label: 'Aktif Alışkanlık', value: habits.length },
                  { label: 'En Uzun Streak', value: `${Math.max(...habits.map((h) => h.current_streak))} gün` },
                  { label: 'En İyi Gün', value: bestDay.day },
                  { label: 'Ort. Tamamlama', value: `${Math.round(habits.reduce((s, h) => s + h.completion_rate_30, 0) / habits.length)}%` },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-card border p-4"
                    style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-1">{label}</p>
                    <p className="font-mono text-xl font-bold text-text-primary">{value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Per-habit table */}
                <div className="rounded-card border overflow-hidden" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                  <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                    <h2 className="font-display text-xs font-semibold text-text-secondary uppercase tracking-wider">Alışkanlık Performansı</h2>
                  </div>
                  <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                    {habits.map((h) => (
                      <div key={h.id} className="px-5 py-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: h.color }} />
                          <span className="font-display font-semibold text-sm text-text-primary truncate flex-1">{h.name}</span>
                          {h.current_streak > 0 && (
                            <span className="font-mono text-sm font-semibold text-warning flex items-center gap-1">
                              🔥 {h.current_streak}
                            </span>
                          )}
                        </div>
                        {[
                          { label: 'Son 30g', v: h.completion_rate_30 },
                          { label: 'Son 90g', v: h.completion_rate_90 },
                          { label: 'Tüm zamanlar', v: h.completion_rate_all },
                        ].map(({ label, v }) => (
                          <div key={label} className="flex items-center gap-3 mb-1.5">
                            <span className="text-xs text-text-muted w-20 flex-shrink-0">{label}</span>
                            <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                              <div className="h-full rounded-full progress-fill" style={{ width: `${v}%`, backgroundColor: rateColor(v) }} />
                            </div>
                            <span className="font-mono text-xs text-text-secondary w-10 text-right">{v}%</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weekly pattern */}
                <div className="rounded-card border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                  <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                    <h2 className="font-display text-xs font-semibold text-text-secondary uppercase tracking-wider">Haftalık Pattern</h2>
                    <p className="text-xs text-text-muted mt-1">Güne göre ortalama tamamlama sayısı</p>
                  </div>
                  <div className="p-5">
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={weeklyData} barSize={28}>
                        <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-dm-sans)' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                        <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                          {weeklyData.map((entry, i) => (
                            <Cell key={i} fill={entry.day === bestDay.day ? '#A78BFA' : '#2A2A38'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-4 p-3 rounded-sm text-xs" style={{ backgroundColor: 'var(--surface-2)', color: 'var(--text-secondary)' }}>
                      En tutarlı günün: <span className="font-semibold text-text-primary">{bestDay.day}</span> (ort. {bestDay.avg.toFixed(1)} alışkanlık)
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {showModal && (
        <AddHabitModal
          onClose={() => setShowModal(false)}
          onSave={handleAddHabit}
        />
      )}
    </div>
  )
}
