'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import Button from '@/components/ui/Button'
import { TaskFormData, TaskPriority, PRIORITY_CONFIG } from '@/types/tasks'

const schema = z.object({
  title: z.string().min(1, 'Başlık gerekli').max(500),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  due_date: z.string().optional().nullable(),
  due_time: z.string().optional().nullable(),
})

type FormValues = z.infer<typeof schema>

interface TaskModalProps {
  onClose: () => void
  onSave: (data: TaskFormData) => Promise<void>
  defaultDate?: string
}

const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high', 'urgent']

export default function TaskModal({ onClose, onSave, defaultDate }: TaskModalProps) {
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      priority: 'medium',
      due_date: defaultDate ?? new Date().toISOString().split('T')[0],
    },
  })

  const priority = watch('priority')

  const onSubmit = async (values: FormValues) => {
    setSaving(true)
    try {
      await onSave({
        title: values.title,
        description: values.description,
        priority: values.priority,
        due_date: values.due_date || null,
        due_time: values.due_time || null,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div
        className="w-full max-w-md rounded-xl border p-6"
        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-md)' }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-bold text-text-primary">Yeni Görev</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <input
              {...register('title')}
              placeholder="Görev başlığı..."
              autoFocus
              className="w-full bg-transparent border rounded-card px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent transition-colors"
              style={{ borderColor: errors.title ? 'var(--danger)' : 'var(--border)' }}
            />
            {errors.title && <p className="text-xs text-danger mt-1">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <textarea
            {...register('description')}
            placeholder="Açıklama (opsiyonel)..."
            rows={2}
            className="w-full bg-transparent border rounded-card px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent transition-colors resize-none"
            style={{ borderColor: 'var(--border)' }}
          />

          {/* Priority */}
          <div>
            <p className="text-xs text-text-muted mb-2">Öncelik</p>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => {
                const cfg = PRIORITY_CONFIG[p]
                const active = priority === p
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setValue('priority', p)}
                    className="flex-1 py-1.5 rounded-card text-xs font-medium border transition-all"
                    style={{
                      backgroundColor: active ? `${cfg.color}22` : 'transparent',
                      borderColor: active ? cfg.color : 'var(--border)',
                      color: active ? cfg.color : 'var(--text-muted)',
                    }}
                  >
                    {cfg.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Due date */}
          <div className="flex gap-2">
            <div className="flex-1">
              <p className="text-xs text-text-muted mb-1">Tarih</p>
              <input
                type="date"
                {...register('due_date')}
                className="w-full bg-transparent border rounded-card px-3 py-2 text-sm text-text-primary outline-none focus:border-accent transition-colors"
                style={{ borderColor: 'var(--border)', colorScheme: 'dark' }}
              />
            </div>
            <div className="flex-1">
              <p className="text-xs text-text-muted mb-1">Saat</p>
              <input
                type="time"
                {...register('due_time')}
                className="w-full bg-transparent border rounded-card px-3 py-2 text-sm text-text-primary outline-none focus:border-accent transition-colors"
                style={{ borderColor: 'var(--border)', colorScheme: 'dark' }}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit" className="flex-1" loading={saving}>
              Kaydet
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
