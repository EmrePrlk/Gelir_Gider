'use client'

import { useState } from 'react'
import { Check, AlertCircle, Clock, CalendarDays, List, Plus, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Task, TaskPriority, PRIORITY_CONFIG, STATUS_CONFIG } from '@/types/tasks'

// ─── Mock data ───────────────────────────────────────────────────────────────

const today = new Date()
const fmt = (d: Date) => d.toISOString().split('T')[0]
const daysAgo = (n: number) => { const d = new Date(today); d.setDate(d.getDate() - n); return fmt(d) }
const daysLater = (n: number) => { const d = new Date(today); d.setDate(d.getDate() + n); return fmt(d) }

const INITIAL_TASKS: Task[] = [
  { id: 1, title: 'Proje sunumunu hazırla', description: '', status: 'todo', priority: 'urgent', due_date: fmt(today), due_time: '14:00', tags: ['iş'], is_recurring: false, recurrence_rule: null, parent_task: null, completed_at: null, created_at: '', is_overdue: false },
  { id: 2, title: 'Haftalık raporu gönder', description: '', status: 'in_progress', priority: 'high', due_date: fmt(today), due_time: null, tags: ['iş'], is_recurring: false, recurrence_rule: null, parent_task: null, completed_at: null, created_at: '', is_overdue: false },
  { id: 3, title: 'Spor salonu üyeliğini yenile', description: '', status: 'todo', priority: 'medium', due_date: fmt(today), due_time: null, tags: ['kişisel'], is_recurring: false, recurrence_rule: null, parent_task: null, completed_at: null, created_at: '', is_overdue: false },
  { id: 4, title: 'Kitap sipariş ver', description: '', status: 'done', priority: 'low', due_date: fmt(today), due_time: null, tags: [], is_recurring: false, recurrence_rule: null, parent_task: null, completed_at: fmt(today), created_at: '', is_overdue: false },
  { id: 5, title: 'Fatura öde', description: '', status: 'done', priority: 'high', due_date: fmt(today), due_time: null, tags: ['finans'], is_recurring: false, recurrence_rule: null, parent_task: null, completed_at: fmt(today), created_at: '', is_overdue: false },
  { id: 6, title: 'Doktor randevusu al', description: '', status: 'todo', priority: 'medium', due_date: daysAgo(2), due_time: null, tags: ['sağlık'], is_recurring: false, recurrence_rule: null, parent_task: null, completed_at: null, created_at: '', is_overdue: true },
  { id: 7, title: 'README güncelle', description: '', status: 'todo', priority: 'low', due_date: daysAgo(1), due_time: null, tags: ['iş'], is_recurring: false, recurrence_rule: null, parent_task: null, completed_at: null, created_at: '', is_overdue: true },
  { id: 8, title: 'Tasarım revizyonu', description: '', status: 'todo', priority: 'high', due_date: daysLater(1), due_time: null, tags: ['iş'], is_recurring: false, recurrence_rule: null, parent_task: null, completed_at: null, created_at: '', is_overdue: false },
  { id: 9, title: 'API dokümantasyonu', description: '', status: 'in_progress', priority: 'medium', due_date: daysLater(2), due_time: null, tags: ['iş'], is_recurring: false, recurrence_rule: null, parent_task: null, completed_at: null, created_at: '', is_overdue: false },
  { id: 10, title: 'Hafta sonu planla', description: '', status: 'todo', priority: 'low', due_date: daysLater(3), due_time: null, tags: ['kişisel'], is_recurring: false, recurrence_rule: null, parent_task: null, completed_at: null, created_at: '', is_overdue: false },
]

const DAYS_TR = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cts']
const DAYS_TR_FULL = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar']
const MONTHS_TR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
const MONTHS_SHORT = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']

function getWeekDays() {
  const t = new Date()
  const monday = new Date(t)
  monday.setDate(t.getDate() - t.getDay() + (t.getDay() === 0 ? -6 : 1))
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday); d.setDate(monday.getDate() + i); return d
  })
}

// ─── Mini card for columns ───────────────────────────────────────────────────

function MiniCard({ task, onToggle }: { task: Task; onToggle: (id: number) => void }) {
  const cfg = PRIORITY_CONFIG[task.priority]
  const isDone = task.status === 'done'
  return (
    <div
      className="flex items-center gap-2 rounded px-2 py-1.5 border"
      style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderLeftWidth: '3px', borderLeftColor: isDone ? 'var(--border)' : cfg.border, opacity: isDone ? 0.55 : 1 }}
    >
      <button
        onClick={() => onToggle(task.id)}
        className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: isDone ? 'var(--success)' : 'transparent', borderColor: isDone ? 'var(--success)' : cfg.border }}
      >
        {isDone && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
      </button>
      <span className={cn('text-xs truncate', isDone ? 'line-through text-text-muted' : 'text-text-primary')}>{task.title}</span>
    </div>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────

type Tab = 'today' | 'weekly' | 'backlog'

export default function DemoTasksPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const [tab, setTab] = useState<Tab>('today')
  const [quickTitle, setQuickTitle] = useState('')
  const [search, setSearch] = useState('')

  const todayStr = fmt(today)
  const weekDays = getWeekDays()

  const toggle = (id: number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'done' ? 'todo' : 'done', completed_at: t.status === 'done' ? null : fmt(today) }
          : t,
      ),
    )
  }

  const quickAdd = () => {
    const title = quickTitle.trim()
    if (!title) return
    const newTask: Task = {
      id: Date.now(), title, description: '', status: 'todo', priority: 'medium',
      due_date: todayStr, due_time: null, tags: [], is_recurring: false,
      recurrence_rule: null, parent_task: null, completed_at: null, created_at: todayStr, is_overdue: false,
    }
    setTasks((prev) => [newTask, ...prev])
    setQuickTitle('')
  }

  const todayTasks = tasks.filter((t) => t.due_date === todayStr && t.status !== 'cancelled')
  const overdueTasks = tasks.filter((t) => t.due_date && t.due_date < todayStr && !['done', 'cancelled'].includes(t.status))
  const doneTodayTasks = todayTasks.filter((t) => t.status === 'done')
  const activeTodayTasks = todayTasks.filter((t) => t.status !== 'done')
  const pct = todayTasks.length > 0 ? (doneTodayTasks.length / todayTasks.length) * 100 : 0

  const filteredAll = tasks.filter((t) => !search || t.title.toLowerCase().includes(search.toLowerCase()))

  const weeklyByDay: Record<string, Task[]> = {}
  weekDays.forEach((d) => {
    const k = fmt(d)
    weeklyByDay[k] = tasks.filter((t) => t.due_date === k && t.status !== 'cancelled')
  })

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Demo banner */}
      <div className="py-2 px-4 text-center text-xs font-medium" style={{ backgroundColor: 'var(--accent)20', color: 'var(--accent)', borderBottom: '1px solid var(--accent)30' }}>
        Demo Modu — Backend bağlantısı olmadan çalışıyor. Tüm veriler sahte.
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-text-primary">Görevler</h1>
            <p className="text-sm text-text-muted mt-0.5">
              {DAYS_TR[today.getDay()]}, {today.getDate()} {MONTHS_TR[today.getMonth()]}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(['today', 'weekly', 'backlog'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all"
                style={{
                  backgroundColor: tab === t ? 'var(--accent)' : 'var(--surface)',
                  color: tab === t ? '#fff' : 'var(--text-secondary)',
                  border: '1px solid',
                  borderColor: tab === t ? 'var(--accent)' : 'var(--border)',
                }}
              >
                {t === 'today' && <Check className="w-3.5 h-3.5" />}
                {t === 'weekly' && <CalendarDays className="w-3.5 h-3.5" />}
                {t === 'backlog' && <List className="w-3.5 h-3.5" />}
                {t === 'today' ? 'Bugün' : t === 'weekly' ? 'Haftalık' : 'Tümü'}
              </button>
            ))}
          </div>
        </div>

        {/* ── TODAY ── */}
        {tab === 'today' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {/* Overdue */}
              {overdueTasks.length > 0 && (
                <section>
                  <p className="font-display text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--danger)' }}>
                    Gecikmiş ({overdueTasks.length})
                  </p>
                  <div className="space-y-2">
                    {overdueTasks.map((t) => {
                      const cfg = PRIORITY_CONFIG[t.priority]
                      return (
                        <div key={t.id} className="flex items-center gap-3 rounded-card border px-4 py-3" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderLeftWidth: '3px', borderLeftColor: 'var(--danger)' }}>
                          <button onClick={() => toggle(t.id)} className="w-5 h-5 rounded border-2 flex items-center justify-center" style={{ borderColor: 'var(--danger)' }}>
                            {t.status === 'done' && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-primary truncate">{t.title}</p>
                            <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: 'var(--danger)' }}>
                              <AlertCircle className="w-3 h-3" />{t.due_date}
                            </p>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${cfg.color}18`, color: cfg.color }}>{cfg.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}

              {/* Today */}
              <section>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest">Bugün</span>
                  <span className="font-mono text-xs text-text-muted">{doneTodayTasks.length} / {todayTasks.length} tamamlandı</span>
                </div>

                {todayTasks.length > 0 && (
                  <div className="mb-3 h-[3px] bg-surface-2 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: pct === 100 ? 'var(--success)' : pct >= 50 ? 'var(--accent)' : 'var(--warning)' }} />
                  </div>
                )}

                {/* Quick add */}
                <div className="flex items-center gap-2 rounded-card border px-3 py-2.5 mb-3" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                  <Plus className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                  <input
                    value={quickTitle}
                    onChange={(e) => setQuickTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && quickAdd()}
                    placeholder="Yeni görev ekle... (Enter)"
                    className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
                  />
                </div>

                <div className="space-y-2">
                  {activeTodayTasks.map((t) => {
                    const cfg = PRIORITY_CONFIG[t.priority]
                    return (
                      <div key={t.id} className="flex items-center gap-3 rounded-card border px-4 py-3 transition-all hover:-translate-y-px" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderLeftWidth: '3px', borderLeftColor: cfg.border, boxShadow: 'var(--shadow-sm)' }}>
                        <button onClick={() => toggle(t.id)} className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 hover:border-accent transition-all" style={{ borderColor: cfg.border }}>
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">{t.title}</p>
                          {t.due_time && (
                            <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" />{t.due_time}
                            </p>
                          )}
                        </div>
                        {t.tags.length > 0 && <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--surface-2)', color: 'var(--text-secondary)' }}>{t.tags[0]}</span>}
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0" style={{ backgroundColor: `${cfg.color}18`, color: cfg.color }}>{cfg.label}</span>
                      </div>
                    )
                  })}

                  {doneTodayTasks.length > 0 && (
                    <>
                      <div className="flex items-center gap-2 pt-1">
                        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
                        <span className="text-xs text-text-muted">Tamamlananlar</span>
                        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
                      </div>
                      {doneTodayTasks.map((t) => (
                        <div key={t.id} className="flex items-center gap-3 rounded-card border px-4 py-3 opacity-50" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                          <button onClick={() => toggle(t.id)} className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--success)', borderColor: 'var(--success)' }}>
                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                          </button>
                          <p className="text-sm text-text-muted line-through truncate">{t.title}</p>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                {pct === 100 && todayTasks.length > 0 && (
                  <div className="mt-4 px-4 py-3 rounded-card border text-sm font-medium text-center" style={{ backgroundColor: 'var(--success)18', borderColor: 'var(--success)40', color: 'var(--success)' }}>
                    Bugünün tüm görevleri tamamlandı! 🎯
                  </div>
                )}
              </section>
            </div>

            {/* Right: Weekly overview */}
            <div className="hidden lg:block">
              <div className="sticky top-6">
                <span className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest block mb-3">Bu Hafta</span>
                <div className="rounded-card border p-4 space-y-2" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                  {weekDays.map((day) => {
                    const k = fmt(day)
                    const dayTasks = weeklyByDay[k] ?? []
                    const done = dayTasks.filter((t) => t.status === 'done').length
                    const isToday = k === todayStr
                    const isPast = k < todayStr
                    return (
                      <div key={k} className="flex items-center gap-3 py-1.5 px-2 rounded-lg" style={{ backgroundColor: isToday ? 'var(--surface-2)' : 'transparent' }}>
                        <div className="w-8 text-center">
                          <p className="text-xs font-medium" style={{ color: isToday ? 'var(--accent)' : 'var(--text-secondary)' }}>{DAYS_TR[day.getDay()]}</p>
                          <p className="font-mono text-xs" style={{ color: isToday ? 'var(--text-primary)' : 'var(--text-muted)' }}>{day.getDate()}</p>
                        </div>
                        <div className="flex-1">
                          {dayTasks.length === 0 ? (
                            <p className="text-xs text-text-muted">—</p>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                                <div className="h-full rounded-full" style={{ width: `${(done / dayTasks.length) * 100}%`, backgroundColor: done === dayTasks.length ? 'var(--success)' : isPast ? 'var(--danger)' : 'var(--accent)' }} />
                              </div>
                              <span className="font-mono text-xs text-text-muted w-8 text-right">{done}/{dayTasks.length}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-card border p-3" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                    <p className="font-mono text-xl font-bold text-text-primary">{todayTasks.length}</p>
                    <p className="text-xs text-text-muted mt-0.5">Bugün toplam</p>
                  </div>
                  <div className="rounded-card border p-3" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                    <p className="font-mono text-xl font-bold" style={{ color: overdueTasks.length > 0 ? 'var(--danger)' : 'var(--text-primary)' }}>{overdueTasks.length}</p>
                    <p className="text-xs text-text-muted mt-0.5">Gecikmiş</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── WEEKLY ── */}
        {tab === 'weekly' && (
          <div>
            <p className="text-sm text-text-muted mb-4">
              {weekDays[0].getDate()} {MONTHS_SHORT[weekDays[0].getMonth()]} — {weekDays[6].getDate()} {MONTHS_SHORT[weekDays[6].getMonth()]}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
              {weekDays.map((day, idx) => {
                const k = fmt(day)
                const dayTasks = weeklyByDay[k] ?? []
                const done = dayTasks.filter((t) => t.status === 'done').length
                const isToday = k === todayStr
                const isPast = k < todayStr
                return (
                  <div key={k} className="rounded-card border flex flex-col" style={{ backgroundColor: isToday ? 'var(--surface-2)' : 'var(--surface)', borderColor: isToday ? 'var(--accent)' : 'var(--border)', minHeight: 180 }}>
                    <div className="px-3 py-2.5 border-b flex items-center justify-between" style={{ borderColor: isToday ? 'var(--accent)40' : 'var(--border)' }}>
                      <div>
                        <p className="text-xs font-semibold font-display" style={{ color: isToday ? 'var(--accent)' : isPast ? 'var(--text-muted)' : 'var(--text-secondary)' }}>{DAYS_TR_FULL[idx]}</p>
                        <p className="font-mono text-sm font-bold" style={{ color: isToday ? 'var(--text-primary)' : 'var(--text-muted)' }}>{day.getDate()}</p>
                      </div>
                      {dayTasks.length > 0 && (
                        <span className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: done === dayTasks.length ? 'var(--success)20' : 'var(--surface-2)', color: done === dayTasks.length ? 'var(--success)' : 'var(--text-muted)' }}>
                          {done}/{dayTasks.length}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 p-2 space-y-1.5">
                      {dayTasks.length === 0 ? (
                        <div className="flex items-center justify-center h-16"><p className="text-xs text-text-muted">Boş</p></div>
                      ) : (
                        dayTasks.map((t) => <MiniCard key={t.id} task={t} onToggle={toggle} />)
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── BACKLOG ── */}
        {tab === 'backlog' && (
          <div>
            <div className="flex items-center gap-2 rounded-card border px-3 py-2.5 mb-4" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
              <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Görev ara..." className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none" />
            </div>

            <div className="rounded-card border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface-2)' }}>
                    <th className="w-8 px-4 py-2.5"></th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-muted">Başlık</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-muted hidden sm:table-cell">Öncelik</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-muted hidden md:table-cell">Tarih</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-muted">Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAll.map((t, idx) => {
                    const cfg = PRIORITY_CONFIG[t.priority]
                    const isDone = t.status === 'done'
                    return (
                      <tr key={t.id} style={{ borderBottom: idx < filteredAll.length - 1 ? '1px solid var(--border)' : undefined, backgroundColor: 'var(--surface)' }}>
                        <td className="px-4 py-3">
                          <button onClick={() => toggle(t.id)} className="w-5 h-5 rounded border-2 flex items-center justify-center" style={{ backgroundColor: isDone ? 'var(--success)' : 'transparent', borderColor: isDone ? 'var(--success)' : cfg.border }}>
                            {isDone && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-0.5 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.color }} />
                            <span className={cn('text-sm', isDone ? 'line-through text-text-muted' : 'text-text-primary')}>{t.title}</span>
                            {t.is_overdue && <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--danger)' }} />}
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${cfg.color}18`, color: cfg.color }}>{cfg.label}</span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          {t.due_date ? (
                            <span className="text-xs flex items-center gap-1" style={{ color: t.is_overdue ? 'var(--danger)' : 'var(--text-muted)' }}>
                              <Clock className="w-3 h-3" />{t.due_date}
                            </span>
                          ) : <span className="text-xs text-text-muted">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-text-secondary">{STATUS_CONFIG[t.status].label}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
