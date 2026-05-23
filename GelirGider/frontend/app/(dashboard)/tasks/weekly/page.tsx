'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import PageWrapper from '@/components/layout/PageWrapper'
import TaskCard from '@/components/modules/tasks/TaskCard'
import TaskModal from '@/components/modules/tasks/TaskModal'
import Button from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { tasksApi } from '@/lib/api/tasks'
import { Task } from '@/types/tasks'
import { ArrowLeft, Plus } from 'lucide-react'

const DAYS_TR_FULL = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar']
const MONTHS_TR = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']

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

export default function WeeklyPage() {
  const [showModal, setShowModal] = useState(false)
  const [modalDate, setModalDate] = useState<string | undefined>()
  const queryClient = useQueryClient()

  const { data: weeklyData = {}, isLoading } = useQuery({
    queryKey: ['tasks', 'weekly'],
    queryFn: tasksApi.weekly,
  })

  const completeMutation = useMutation({
    mutationFn: (id: number) => tasksApi.complete(id),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })

  const createMutation = useMutation({
    mutationFn: tasksApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setShowModal(false)
    },
  })

  const weekDays = getWeekDays()
  const todayStr = new Date().toISOString().split('T')[0]

  const handleAddForDay = (dateStr: string) => {
    setModalDate(dateStr)
    setShowModal(true)
  }

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <Link href="/tasks">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-text-primary">Haftalık Görünüm</h1>
            <p className="text-sm text-text-muted mt-0.5">
              {weekDays[0].getDate()} {MONTHS_TR[weekDays[0].getMonth()]} — {weekDays[6].getDate()} {MONTHS_TR[weekDays[6].getMonth()]}
            </p>
          </div>
        </div>
        <Button size="sm" onClick={() => { setModalDate(todayStr); setShowModal(true) }}>
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Yeni Görev</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-card" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {weekDays.map((day, idx) => {
            const key = day.toISOString().split('T')[0]
            const tasks: Task[] = (weeklyData as Record<string, Task[]>)[key] ?? []
            const done = tasks.filter((t) => t.status === 'done').length
            const isToday = key === todayStr
            const isPast = key < todayStr

            return (
              <div
                key={key}
                className="rounded-card border flex flex-col"
                style={{
                  backgroundColor: isToday ? 'var(--surface-2)' : 'var(--surface)',
                  borderColor: isToday ? 'var(--accent)' : 'var(--border)',
                  minHeight: '180px',
                }}
              >
                {/* Day header */}
                <div
                  className="px-3 py-2.5 border-b flex items-center justify-between"
                  style={{ borderColor: isToday ? 'var(--accent)40' : 'var(--border)' }}
                >
                  <div>
                    <p
                      className="text-xs font-semibold font-display"
                      style={{ color: isToday ? 'var(--accent)' : isPast ? 'var(--text-muted)' : 'var(--text-secondary)' }}
                    >
                      {DAYS_TR_FULL[idx]}
                    </p>
                    <p
                      className="font-mono text-sm font-bold"
                      style={{ color: isToday ? 'var(--text-primary)' : 'var(--text-muted)' }}
                    >
                      {day.getDate()}
                    </p>
                  </div>
                  {tasks.length > 0 && (
                    <span
                      className="font-mono text-xs px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: done === tasks.length ? 'var(--success)20' : 'var(--surface-2)',
                        color: done === tasks.length ? 'var(--success)' : 'var(--text-muted)',
                      }}
                    >
                      {done}/{tasks.length}
                    </span>
                  )}
                </div>

                {/* Tasks */}
                <div className="flex-1 p-2 space-y-1.5">
                  {tasks.length === 0 ? (
                    <div className="flex items-center justify-center h-16">
                      <p className="text-xs text-text-muted">Boş</p>
                    </div>
                  ) : (
                    tasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        compact
                        onComplete={async (id) => { await completeMutation.mutateAsync(id) }}
                      />
                    ))
                  )}
                </div>

                {/* Add button */}
                <button
                  onClick={() => handleAddForDay(key)}
                  className="px-3 py-2 text-xs text-text-muted hover:text-text-secondary transition-colors border-t text-left"
                  style={{ borderColor: 'var(--border)' }}
                >
                  + Ekle
                </button>
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <TaskModal
          defaultDate={modalDate}
          onClose={() => setShowModal(false)}
          onSave={async (data) => { await createMutation.mutateAsync(data) }}
        />
      )}
    </PageWrapper>
  )
}
