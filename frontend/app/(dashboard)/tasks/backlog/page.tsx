'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import PageWrapper from '@/components/layout/PageWrapper'
import TaskModal from '@/components/modules/tasks/TaskModal'
import { Skeleton } from '@/components/ui/Skeleton'
import Button from '@/components/ui/Button'
import { tasksApi } from '@/lib/api/tasks'
import { Task, TaskStatus, TaskPriority, PRIORITY_CONFIG, STATUS_CONFIG } from '@/types/tasks'
import { ArrowLeft, Plus, Search, Check, AlertCircle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

const STATUSES: (TaskStatus | 'all')[] = ['all', 'todo', 'in_progress', 'done', 'cancelled']
const PRIORITIES: (TaskPriority | 'all')[] = ['all', 'urgent', 'high', 'medium', 'low']

const STATUS_LABELS: Record<string, string> = {
  all: 'Tümü', todo: 'Yapılacak', in_progress: 'Devam', done: 'Tamam', cancelled: 'İptal',
}

export default function BacklogPage() {
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const queryClient = useQueryClient()

  const params: Record<string, string> = {}
  if (statusFilter !== 'all') params.status = statusFilter
  if (priorityFilter !== 'all') params.priority = priorityFilter
  if (search) params.search = search

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', 'backlog', params],
    queryFn: () => tasksApi.list(params),
  })

  const completeMutation = useMutation({
    mutationFn: (id: number) => tasksApi.complete(id),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => tasksApi.delete(id),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })

  const createMutation = useMutation({
    mutationFn: tasksApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setShowModal(false)
    },
  })

  const formatDate = (d: string) => {
    const date = new Date(d)
    return `${date.getDate()}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`
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
            <h1 className="font-display text-2xl font-bold text-text-primary">Tüm Görevler</h1>
            <p className="text-sm text-text-muted mt-0.5">{tasks.length} görev</p>
          </div>
        </div>
        <Button size="sm" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Yeni Görev</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-6">
        <div
          className="flex items-center gap-2 rounded-card border px-3 py-2.5"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Görev ara..."
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="text-xs px-3 py-1.5 rounded-full border transition-all"
              style={{
                backgroundColor: statusFilter === s ? 'var(--accent)' : 'transparent',
                borderColor: statusFilter === s ? 'var(--accent)' : 'var(--border)',
                color: statusFilter === s ? '#fff' : 'var(--text-secondary)',
              }}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          <span className="text-xs text-text-muted self-center">Öncelik:</span>
          {PRIORITIES.map((p) => {
            const cfg = p !== 'all' ? PRIORITY_CONFIG[p] : null
            return (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className="text-xs px-3 py-1.5 rounded-full border transition-all"
                style={{
                  backgroundColor: priorityFilter === p ? (cfg?.color ?? 'var(--accent)') : 'transparent',
                  borderColor: priorityFilter === p ? (cfg?.color ?? 'var(--accent)') : 'var(--border)',
                  color: priorityFilter === p ? '#fff' : 'var(--text-secondary)',
                }}
              >
                {p === 'all' ? 'Tümü' : cfg?.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-card border overflow-hidden"
        style={{ borderColor: 'var(--border)' }}
      >
        {isLoading ? (
          <div className="p-4 space-y-2">
            {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-12" />)}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-text-muted text-sm">Görev bulunamadı.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface-2)' }}>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-muted w-8"></th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-muted">Başlık</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-muted hidden sm:table-cell">Öncelik</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-muted hidden md:table-cell">Tarih</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-muted">Durum</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, idx) => {
                const cfg = PRIORITY_CONFIG[task.priority]
                const isDone = task.status === 'done'
                return (
                  <tr
                    key={task.id}
                    style={{
                      borderBottom: idx < tasks.length - 1 ? '1px solid var(--border)' : undefined,
                      backgroundColor: 'var(--surface)',
                    }}
                    className="hover:bg-surface-2 transition-colors"
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => completeMutation.mutate(task.id)}
                        className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
                        style={{
                          backgroundColor: isDone ? 'var(--success)' : 'transparent',
                          borderColor: isDone ? 'var(--success)' : cfg.border,
                        }}
                      >
                        {isDone && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                      </button>
                    </td>

                    {/* Title */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-0.5 h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: cfg.color }}
                        />
                        <span
                          className={cn('text-sm', isDone ? 'line-through text-text-muted' : 'text-text-primary')}
                        >
                          {task.title}
                        </span>
                        {task.is_overdue && (
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--danger)' }} />
                        )}
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: `${cfg.color}18`, color: cfg.color }}
                      >
                        {cfg.label}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      {task.due_date ? (
                        <span
                          className="flex items-center gap-1 text-xs"
                          style={{ color: task.is_overdue ? 'var(--danger)' : 'var(--text-muted)' }}
                        >
                          <Clock className="w-3 h-3" />
                          {formatDate(task.due_date)}
                        </span>
                      ) : (
                        <span className="text-xs text-text-muted">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className="text-xs text-text-secondary">
                        {STATUS_CONFIG[task.status].label}
                      </span>
                    </td>

                    {/* Delete */}
                    <td className="px-3 py-3">
                      <button
                        onClick={() => deleteMutation.mutate(task.id)}
                        className="text-xs text-text-muted hover:text-danger transition-colors px-1"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <TaskModal
          onClose={() => setShowModal(false)}
          onSave={async (data) => { await createMutation.mutateAsync(data) }}
        />
      )}
    </PageWrapper>
  )
}
