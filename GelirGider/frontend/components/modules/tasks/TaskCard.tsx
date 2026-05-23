'use client'

import { useState } from 'react'
import { Task, PRIORITY_CONFIG } from '@/types/tasks'
import { Check, Clock, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskCardProps {
  task: Task
  onComplete: (id: number) => Promise<void>
  onDelete?: (id: number) => Promise<void>
  compact?: boolean
}

const PRIORITY_ORDER = ['urgent', 'high', 'medium', 'low'] as const

export default function TaskCard({ task, onComplete, onDelete, compact = false }: TaskCardProps) {
  const [pending, setPending] = useState(false)
  const isDone = task.status === 'done'
  const cfg = PRIORITY_CONFIG[task.priority]

  const handleComplete = async () => {
    if (pending) return
    setPending(true)
    try {
      await onComplete(task.id)
    } finally {
      setPending(false)
    }
  }

  const formatDueDate = (date: string) => {
    const d = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const diff = Math.round((d.getTime() - today.getTime()) / 86400000)
    if (diff === 0) return 'Bugün'
    if (diff === -1) return 'Dün'
    if (diff === 1) return 'Yarın'
    if (diff < 0) return `${Math.abs(diff)} gün önce`
    return `${diff} gün sonra`
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-card border transition-all duration-150',
        compact ? 'px-3 py-2' : 'px-4 py-3',
        isDone ? 'opacity-50' : 'hover:-translate-y-px',
      )}
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        borderLeftWidth: '3px',
        borderLeftColor: isDone ? 'var(--border)' : cfg.border,
        boxShadow: isDone ? 'none' : 'var(--shadow-sm)',
      }}
    >
      {/* Checkbox */}
      <button
        onClick={handleComplete}
        disabled={pending}
        className={cn(
          'flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-150',
          isDone ? 'border-transparent' : 'hover:border-accent',
        )}
        style={{
          backgroundColor: isDone ? 'var(--success)' : 'transparent',
          borderColor: isDone ? 'var(--success)' : cfg.border,
        }}
        aria-label={isDone ? 'Tamamlanmadı olarak işaretle' : 'Tamamlandı olarak işaretle'}
      >
        {isDone && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-sm font-medium truncate transition-all duration-200',
            isDone ? 'line-through text-text-muted' : 'text-text-primary',
          )}
        >
          {task.title}
        </p>

        {!compact && (task.due_date || task.tags.length > 0) && (
          <div className="flex items-center gap-2 mt-0.5">
            {task.due_date && (
              <span
                className="flex items-center gap-1 text-xs"
                style={{ color: task.is_overdue ? 'var(--danger)' : 'var(--text-muted)' }}
              >
                {task.is_overdue && <AlertCircle className="w-3 h-3" />}
                {!task.is_overdue && <Clock className="w-3 h-3" />}
                {formatDueDate(task.due_date)}
              </span>
            )}
            {task.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-1.5 py-0.5 rounded"
                style={{ backgroundColor: 'var(--surface-2)', color: 'var(--text-secondary)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Priority badge — only on non-compact */}
      {!compact && !isDone && (
        <span
          className="flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: `${cfg.color}18`,
            color: cfg.color,
          }}
        >
          {PRIORITY_CONFIG[task.priority].label}
        </span>
      )}
    </div>
  )
}
