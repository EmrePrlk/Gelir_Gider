'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import { Wallet, TrendingUp, TrendingDown, CheckSquare, Flame } from 'lucide-react'

/* ── Mock Data ─────────────────────────────────────────────────── */

const TREND = [
  { name: 'Haz', Gelir: 22000, Gider: 8500 },
  { name: 'Tem', Gelir: 24500, Gider: 9200 },
  { name: 'Ağu', Gelir: 21000, Gider: 11000 },
  { name: 'Eyl', Gelir: 26000, Gider: 8800 },
  { name: 'Eki', Gelir: 23500, Gider: 10500 },
  { name: 'Kas', Gelir: 25000, Gider: 9700 },
  { name: 'Ara', Gelir: 28000, Gider: 12000 },
  { name: 'Oca', Gelir: 24000, Gider: 9100 },
  { name: 'Şub', Gelir: 26500, Gider: 10200 },
  { name: 'Mar', Gelir: 27000, Gider: 9500 },
  { name: 'Nis', Gelir: 28500, Gider: 10800 },
  { name: 'May', Gelir: 29320, Gider: 2356 },
]

const DISTRIBUTION = [
  { name: 'Kripto', color: '#A78BFA', value: 167500, percentage: 47.8 },
  { name: 'Fon', color: '#4F8EF7', value: 74000, percentage: 21.1 },
  { name: 'Hisse', color: '#34D399', value: 62400, percentage: 17.8 },
  { name: 'Döviz', color: '#EC4899', value: 38200, percentage: 10.9 },
  { name: 'Altın', color: '#F59E0B', value: 8125, percentage: 2.3 },
]

const INIT_TASKS = [
  { id: 1, title: 'Proje sunumunu hazırla', priority: 'urgent', status: 'todo' },
  { id: 2, title: 'Haftalık rapor gönder', priority: 'high', status: 'todo' },
  { id: 3, title: 'Spor salonu üyeliğini yenile', priority: 'medium', status: 'todo' },
  { id: 4, title: 'Kitap sipariş ver', priority: 'low', status: 'done' },
]

const INIT_HABITS = [
  { id: 1, name: 'Meditasyon', color: '#A78BFA', completed: true, streak: 7 },
  { id: 2, name: 'Sabah Koşusu', color: '#34D399', completed: false, streak: 3 },
  { id: 3, name: 'Kitap Okuma', color: '#4F8EF7', completed: true, streak: 15 },
  { id: 4, name: '2L Su İçmek', color: '#F59E0B', completed: false, streak: 0 },
]

const TOP_PORTFOLIO = [
  { symbol: 'BTC', name: 'Bitcoin', value: 167500, pnl_pct: 19.64 },
  { symbol: 'TKF', name: 'Türkiye Karma Fon', value: 74000, pnl_pct: 18.40 },
  { symbol: 'THYAO', name: 'Türk Hava Yolları', value: 62400, pnl_pct: 9.47 },
]

const PRIORITY_COLOR: Record<string, string> = {
  urgent: 'var(--danger)',
  high: 'var(--warning)',
  medium: 'var(--accent)',
  low: 'var(--text-muted)',
}

function fmt(n: number) {
  return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)
}

/* ── Page ──────────────────────────────────────────────────────── */

export default function DemoDashboardPage() {
  const [tasks, setTasks] = useState(INIT_TASKS)
  const [habits, setHabits] = useState(INIT_HABITS)

  const toggleTask = (id: number) => setTasks((prev) =>
    prev.map((t) => t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t)
  )
  const toggleHabit = (id: number) => setHabits((prev) =>
    prev.map((h) => h.id === id ? { ...h, completed: !h.completed } : h)
  )

  const completedTasks = tasks.filter((t) => t.status === 'done').length
  const bestStreak = Math.max(...habits.map((h) => h.streak))

  const metricCards = [
    { label: 'Net Servet', value: '350.225 ₺', icon: Wallet, color: 'var(--accent)', sub: 'Toplam portföy değeri' },
    { label: 'Bu Ay Net', value: '+26.964 ₺', icon: TrendingUp, color: 'var(--success)', sub: 'Gelir eksi gider' },
    { label: 'Bugün Görev', value: `${completedTasks} / ${tasks.length}`, icon: CheckSquare, color: 'var(--success)', sub: 'Tamamlanan / Toplam' },
    { label: 'En Uzun Streak', value: `${bestStreak} gün`, icon: Flame, color: '#F97316', sub: 'Aktif alışkanlık serisi' },
  ]

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Banner */}
        <div
          className="rounded-card px-4 py-2.5 mb-6 flex items-center justify-between text-sm"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--accent)', color: 'var(--accent)' }}
        >
          <span className="font-medium">Demo Modu — gerçek veri yok</span>
          <Link href="/dashboard" className="text-xs hover:underline opacity-70">Gerçek dashboard'a git →</Link>
        </div>

        {/* Header */}
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
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
                <p className="text-xs text-text-muted">{label}</p>
              </div>
              <p className="font-mono text-xl font-bold" style={{ color }}>{value}</p>
              <p className="text-xs text-text-muted mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {/* Row 2 — Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div
            className="lg:col-span-2 rounded-card border p-5"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <p className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest mb-4">
              Son 12 Ay — Gelir vs Gider
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={TREND} barSize={8} barGap={2}>
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
          </div>

          <div
            className="rounded-card border p-5"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <p className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest mb-4">
              Portföy Dağılımı
            </p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={DISTRIBUTION} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value">
                  {DISTRIBUTION.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [`${fmt(v)} ₺`]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-1">
              {DISTRIBUTION.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-text-secondary">{d.name}</span>
                  </div>
                  <span className="font-mono text-text-muted">{d.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3 — Lists */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tasks */}
          <div
            className="rounded-card border p-5"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <p className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest mb-4">
              Bugünün Görevleri
            </p>
            <div className="space-y-2">
              {tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="w-full flex items-center gap-3 text-left"
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
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: PRIORITY_COLOR[task.priority] }} />
                </button>
              ))}
            </div>
          </div>

          {/* Habits */}
          <div
            className="rounded-card border p-5"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <p className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest mb-4">
              Bugünün Alışkanlıkları
            </p>
            <div className="space-y-2">
              {habits.map((habit) => (
                <button
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
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
          </div>

          {/* Portfolio */}
          <div
            className="rounded-card border p-5"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <p className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest mb-4">
              Portföy Performansı
            </p>
            <div className="space-y-3">
              {TOP_PORTFOLIO.map((entry) => (
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
          </div>
        </div>
      </div>
    </div>
  )
}
