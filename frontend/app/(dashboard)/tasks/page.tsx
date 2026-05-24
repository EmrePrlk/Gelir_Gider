'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import PageWrapper from '@/components/layout/PageWrapper'
import TaskCard from '@/components/modules/tasks/TaskCard'
import QuickAdd from '@/components/modules/tasks/QuickAdd'
import TaskModal from '@/components/modules/tasks/TaskModal'
import { Skeleton } from '@/components/ui/Skeleton'
import Button from '@/components/ui/Button'
import { tasksApi } from '@/lib/api/tasks'
import { Task, TaskPriority } from '@/types/tasks'
import { CalendarDays, List, Plus } from 'lucide-react'

const DAYS_TR = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cts']
const MONTHS_TR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']

function todayLabel() {
  const d = new Date()
  return `${DAYS_TR[d.getDay()]}, ${d.getDate()} ${MONTHS_TR[d.getMonth()]}`
}

function getWeekDays() {
  const today = new Date()
  const monday = new Date(today)
  monday.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1))
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

export default function TasksPage() {
  const [showModal, setShowModal] = useState(false)
  const queryClient = useQueryClient()

  const { data: todayTasks = [], isLoading: loadingToday } = useQuery({
    queryKey: ['tasks', 'today'],
    queryFn: tasksApi.today,
  })

  const { data: overdueTasks = [] } = useQuery({
    queryKey: ['tasks', 'overdue'],
    queryFn: tasksApi.overdue,
  })

  const { data: weeklyData = {} } = useQuery({
    queryKey: ['tasks', 'weekly'],
    queryFn: tasksApi.weekly,
  })

  const completeMutation = useMutation({
    mutationFn: (id: number) => tasksApi.complete(id),
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ['tasks', 'today'] })
      const prev = queryClient.getQueryData<Task[]>(['tasks', 'today'])
      queryClient.setQueryData<Task[]>(['tasks', 'today'], (old = []) =>
        old.map((t) =>
          t.id === taskId
            ? { ...t, status: t.status === 'done' ? 'todo' : 'done' }
            : t,
        ),
      )
      return { prev }
    },
    onError: (_, __, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['tasks', 'today'], ctx.prev)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const createMutation = useMutation({
    mutationFn: tasksApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })

  const handleQuickAdd = async (title: string, priority: TaskPriority) => {
    await createMutation.mutateAsync({
      title,
      priority,
      due_date: new Date().toISOString().split('T')[0],
    })
  }

  const doneTasks = todayTasks.filter((t) => t.status === 'done')
  const activeTasks = todayTasks.filter((t) => t.status !== 'done')
  const pct = todayTasks.length > 0 ? (doneTasks.length / todayTasks.length) * 100 : 0

  const weekDays = getWeekDays()
  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <PageWrapper>
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Görevler</h1>
          <p className="text-sm text-text-muted mt-0.5">{todayLabel()}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href="/tasks/weekly">
            <Button variant="ghost" size="sm">
              <CalendarDays className="w-4 h-4" />
              <span className="hidden sm:inline">Haftalık</span>
            </Button>
          </Link>
          <Link href="/tasks/backlog">
            <Button variant="ghost" size="sm">
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Tümü</span>
            </Button>
          </Link>
          <Button size="sm" onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Yeni</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Today's tasks */}
        <div className="lg:col-span-2 space-y-4">
          {/* Overdue */}
          {overdueTasks.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-display text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--danger)' }}>
                  Gecikmiş
                </span>
                <span className="font-mono text-xs" style={{ color: 'var(--danger)' }}>{overdueTasks.length}</span>
              </div>
              <div className="space-y-2">
                {overdueTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={async (id) => { await completeMutation.mutateAsync(id) }}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Today */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <span className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest">
                Bugün
              </span>
              {todayTasks.length > 0 && (
                <span className="font-mono text-xs text-text-muted">
                  {doneTasks.length} / {todayTasks.length} tamamlandı
                </span>
              )}
            </div>

            {todayTasks.length > 0 && (
              <div className="mb-3 h-[3px] bg-surface-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: pct === 100 ? 'var(--success)' : pct >= 50 ? 'var(--accent)' : 'var(--warning)',
                    transition: 'width 500ms ease-out',
                  }}
                />
              </div>
            )}

            {/* Quick add */}
            <div className="mb-3">
              <QuickAdd onAdd={handleQuickAdd} />
            </div>

            {loadingToday ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-[52px] rounded-card" />)}
              </div>
            ) : activeTasks.length === 0 && doneTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div
                  className="w-14 h-14 rounded-card flex items-center justify-center mb-4"
                  style={{ backgroundColor: 'var(--surface-2)' }}
                >
                  <span className="text-2xl">✅</span>
                </div>
                <p className="text-text-muted text-sm">Bugün için görev yok.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {activeTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={async (id) => { await completeMutation.mutateAsync(id) }}
                  />
                ))}
                {doneTasks.length > 0 && (
                  <>
                    <div className="flex items-center gap-2 pt-1">
                      <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
                      <span className="text-xs text-text-muted">Tamamlananlar</span>
                      <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
                    </div>
                    {doneTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onComplete={async (id) => { await completeMutation.mutateAsync(id) }}
                      />
                    ))}
                  </>
                )}
              </div>
            )}

            {pct === 100 && todayTasks.length > 0 && (
              <div
                className="mt-4 px-4 py-3 rounded-card border text-sm font-medium text-center"
                style={{
                  backgroundColor: 'var(--success)18',
                  borderColor: 'var(--success)40',
                  color: 'var(--success)',
                }}
              >
                Bugünün tüm görevleri tamamlandı! 🎯
              </div>
            )}
          </section>
        </div>

        {/* Right: Weekly mini-overview */}
        <div className="hidden lg:block">
          <div className="sticky top-6">
            <span className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest block mb-3">
              Bu Hafta
            </span>
            <div
              className="rounded-card border p-4 space-y-2"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              {weekDays.map((day) => {
                const key = day.toISOString().split('T')[0]
                const dayTasks = (weeklyData as Record<string, Task[]>)[key] ?? []
                const done = dayTasks.filter((t) => t.status === 'done').length
                const total = dayTasks.length
                const isToday = key === todayStr
                const isPast = key < todayStr

                return (
                  <div
                    key={key}
                    className="flex items-center gap-3 py-1.5 px-2 rounded-lg"
                    style={{ backgroundColor: isToday ? 'var(--surface-2)' : 'transparent' }}
                  >
                    <div className="w-8 text-center">
                      <p
                        className="text-xs font-medium"
                        style={{ color: isToday ? 'var(--accent)' : 'var(--text-secondary)' }}
                      >
                        {DAYS_TR[day.getDay()]}
                      </p>
                      <p
                        className="font-mono text-xs"
                        style={{ color: isToday ? 'var(--text-primary)' : 'var(--text-muted)' }}
                      >
                        {day.getDate()}
                      </p>
                    </div>

                    <div className="flex-1">
                      {total === 0 ? (
                        <p className="text-xs text-text-muted">—</p>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: total > 0 ? `${(done / total) * 100}%` : '0%',
                                backgroundColor: done === total ? 'var(--success)' : isPast ? 'var(--danger)' : 'var(--accent)',
                              }}
                            />
                          </div>
                          <span className="font-mono text-xs text-text-muted w-8 text-right">
                            {done}/{total}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Quick stats */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div
                className="rounded-card border p-3"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <p className="font-mono text-xl font-bold text-text-primary">{todayTasks.length}</p>
                <p className="text-xs text-text-muted mt-0.5">Bugün toplam</p>
              </div>
              <div
                className="rounded-card border p-3"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <p className="font-mono text-xl font-bold" style={{ color: overdueTasks.length > 0 ? 'var(--danger)' : 'var(--text-primary)' }}>
                  {overdueTasks.length}
                </p>
                <p className="text-xs text-text-muted mt-0.5">Gecikmiş</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <TaskModal
          onClose={() => setShowModal(false)}
          onSave={async (data) => {
            await createMutation.mutateAsync(data)
            setShowModal(false)
          }}
        />
      )}
    </PageWrapper>
  )
}
