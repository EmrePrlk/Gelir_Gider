'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import PageWrapper from '@/components/layout/PageWrapper'
import HabitCard from '@/components/modules/habits/HabitCard'
import HabitHeatmap from '@/components/modules/habits/HabitHeatmap'
import AddHabitModal from '@/components/modules/habits/AddHabitModal'
import { Skeleton } from '@/components/ui/Skeleton'
import Button from '@/components/ui/Button'
import { habitsApi } from '@/lib/api/habits'
import { Habit, HabitFormData } from '@/types/habits'
import { Plus, Download, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

const DAYS_TR = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cts']
const MONTHS_TR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']

function todayLabel(): string {
  const d = new Date()
  return `${DAYS_TR[d.getDay()]}, ${d.getDate()} ${MONTHS_TR[d.getMonth()]}`
}

export default function HabitsPage() {
  const [showModal, setShowModal] = useState(false)
  const [exporting, setExporting] = useState(false)
  const queryClient = useQueryClient()

  const { data: todayHabits = [], isLoading: loadingToday } = useQuery({
    queryKey: ['habits', 'today'],
    queryFn: habitsApi.today,
  })

  const { data: heatmapData = [], isLoading: loadingHeatmap } = useQuery({
    queryKey: ['habits', 'heatmap'],
    queryFn: habitsApi.logs.heatmap,
  })

  const toggleMutation = useMutation({
    mutationFn: (id: number) => habitsApi.logs.toggle(id),
    onMutate: async (habitId) => {
      await queryClient.cancelQueries({ queryKey: ['habits', 'today'] })
      const prev = queryClient.getQueryData<Habit[]>(['habits', 'today'])

      queryClient.setQueryData<Habit[]>(['habits', 'today'], (old = []) =>
        old.map((h) =>
          h.id === habitId
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
      return { prev }
    },
    onError: (_, __, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['habits', 'today'], ctx.prev)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['habits', 'today'] })
      queryClient.invalidateQueries({ queryKey: ['habits', 'heatmap'] })
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: HabitFormData) => habitsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      setShowModal(false)
    },
  })

  const completedCount = todayHabits.filter((h) => h.is_completed_today).length
  const totalCount = todayHabits.length
  const pct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  const handleExport = async () => {
    setExporting(true)
    try {
      await habitsApi.exportExcel()
    } finally {
      setExporting(false)
    }
  }

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Alışkanlıklar</h1>
          <p className="text-sm text-text-muted mt-0.5">{todayLabel()}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href="/habits/analytics">
            <Button variant="ghost" size="sm">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analitik</span>
            </Button>
          </Link>
          <Button variant="secondary" size="sm" onClick={handleExport} loading={exporting}>
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Excel</span>
          </Button>
          <Button size="sm" onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Yeni Alışkanlık</span>
          </Button>
        </div>
      </div>

      {/* Today section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest">
            Bugün
          </span>
          {totalCount > 0 && (
            <span className="font-mono text-xs text-text-muted">
              {completedCount} / {totalCount} tamamlandı
            </span>
          )}
        </div>

        {/* Progress bar */}
        {totalCount > 0 && (
          <div className="mb-4 h-[3px] bg-surface-2 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full progress-fill"
              style={{
                width: `${pct}%`,
                backgroundColor:
                  pct === 100
                    ? 'var(--success)'
                    : pct >= 50
                      ? 'var(--accent-2)'
                      : 'var(--accent)',
                transition: 'width 500ms ease-out',
              }}
            />
          </div>
        )}

        {loadingToday ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[68px] rounded-card" />
            ))}
          </div>
        ) : todayHabits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div
              className="w-14 h-14 rounded-card flex items-center justify-center mb-4"
              style={{ backgroundColor: 'var(--surface-2)' }}
            >
              <span className="text-2xl">🌱</span>
            </div>
            <p className="text-text-muted text-sm mb-1">Bugün için planlanmış alışkanlık yok.</p>
            <button
              className="text-accent-2 text-sm hover:underline mt-1"
              onClick={() => setShowModal(true)}
            >
              + İlk alışkanlığını ekle
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {todayHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggle={async (id) => { await toggleMutation.mutateAsync(id) }}
              />
            ))}
          </div>
        )}

        {/* Completion celebration */}
        {totalCount > 0 && completedCount === totalCount && (
          <div
            className="mt-4 px-4 py-3 rounded-card border text-sm font-medium text-center"
            style={{
              backgroundColor: 'var(--success)18',
              borderColor: 'var(--success)40',
              color: 'var(--success)',
            }}
          >
            Bugünün tüm alışkanlıklarını tamamladın! 🎯
          </div>
        )}
      </section>

      {/* Heatmap section */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <span className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest">
            Yıllık Görünüm
          </span>
          <span className="text-xs text-text-muted">Son 12 ay</span>
        </div>
        <div
          className="rounded-card border p-5"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {loadingHeatmap ? (
            <Skeleton className="h-36 w-full" />
          ) : (
            <HabitHeatmap data={heatmapData} />
          )}

          {/* Legend */}
          <div className="flex items-center justify-end gap-1.5 mt-4">
            <span className="text-xs text-text-muted mr-1">Az</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor:
                    level === 0
                      ? 'var(--surface-2)'
                      : `rgba(167, 139, 250, ${level * 0.22 + 0.1})`,
                }}
              />
            ))}
            <span className="text-xs text-text-muted ml-1">Çok</span>
          </div>
        </div>
      </section>

      {showModal && (
        <AddHabitModal
          onClose={() => setShowModal(false)}
          onSave={async (data) => { await createMutation.mutateAsync(data) }}
        />
      )}
    </PageWrapper>
  )
}
