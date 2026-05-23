'use client'

import { useState, useRef } from 'react'
import { Plus } from 'lucide-react'
import { TaskPriority, PRIORITY_CONFIG } from '@/types/tasks'

interface QuickAddProps {
  onAdd: (title: string, priority: TaskPriority) => Promise<void>
  placeholder?: string
}

const PRIORITIES: TaskPriority[] = ['urgent', 'high', 'medium', 'low']

export default function QuickAdd({ onAdd, placeholder = 'Yeni görev ekle...' }: QuickAddProps) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const submit = async () => {
    const trimmed = title.trim()
    if (!trimmed || loading) return
    setLoading(true)
    try {
      await onAdd(trimmed, priority)
      setTitle('')
      inputRef.current?.focus()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="flex items-center gap-2 rounded-card border px-3 py-2.5"
      style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <Plus className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />

      <input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        placeholder={placeholder}
        disabled={loading}
        className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none min-w-0"
      />

      {/* Priority selector */}
      <div className="flex items-center gap-1">
        {PRIORITIES.map((p) => {
          const cfg = PRIORITY_CONFIG[p]
          return (
            <button
              key={p}
              onClick={() => setPriority(p)}
              title={cfg.label}
              className="w-3 h-3 rounded-full transition-all"
              style={{
                backgroundColor: cfg.color,
                opacity: priority === p ? 1 : 0.25,
                transform: priority === p ? 'scale(1.4)' : 'scale(1)',
              }}
            />
          )
        })}
      </div>

      {title.trim() && (
        <button
          onClick={submit}
          disabled={loading}
          className="text-xs font-medium px-2 py-1 rounded transition-colors"
          style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
        >
          Ekle
        </button>
      )}
    </div>
  )
}
