'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { HabitFormData } from '@/types/habits'

type AnyIcon = React.ComponentType<{ className?: string }>
function getIcon(name: string): AnyIcon {
  const icons = LucideIcons as unknown as Record<string, AnyIcon>
  return icons[name] ?? icons['Check']
}

const PRESET_COLORS = [
  '#A78BFA', '#4F8EF7', '#34D399', '#F5C842',
  '#F87171', '#FBBF24', '#818CF8', '#F472B6',
]

const PRESET_ICONS = [
  { key: 'Flame', label: 'Alev' },
  { key: 'Dumbbell', label: 'Spor' },
  { key: 'BookOpen', label: 'Okuma' },
  { key: 'Brain', label: 'Beyin' },
  { key: 'Coffee', label: 'Kahve' },
  { key: 'Heart', label: 'Sağlık' },
  { key: 'Music', label: 'Müzik' },
  { key: 'Pencil', label: 'Yazı' },
  { key: 'Droplets', label: 'Su' },
  { key: 'Sunrise', label: 'Sabah' },
]

const schema = z.object({
  name: z.string().min(1, 'İsim gerekli').max(200),
  description: z.string().optional(),
  color: z.string(),
  icon: z.string(),
  frequency: z.enum(['daily', 'weekdays', 'custom']),
  target_streak: z.number().int().min(0).optional(),
})

type FormValues = z.infer<typeof schema>

interface AddHabitModalProps {
  onClose: () => void
  onSave: (data: HabitFormData) => Promise<void>
  initial?: Partial<HabitFormData>
}

export default function AddHabitModal({ onClose, onSave, initial }: AddHabitModalProps) {
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial?.name ?? '',
      description: initial?.description ?? '',
      color: initial?.color ?? PRESET_COLORS[0],
      icon: initial?.icon ?? PRESET_ICONS[0].key,
      frequency: initial?.frequency ?? 'daily',
      target_streak: initial?.target_streak ?? 0,
    },
  })

  const selectedColor = watch('color')
  const selectedIcon = watch('icon')
  const selectedFreq = watch('frequency')

  const onSubmit = async (values: FormValues) => {
    setSaving(true)
    try {
      await onSave(values)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-md border rounded-modal p-6"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg font-bold text-text-primary">
            {initial ? 'Alışkanlığı Düzenle' : 'Yeni Alışkanlık'}
          </h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wider mb-2">
              İsim
            </label>
            <Input
              {...register('name')}
              placeholder="Meditasyon, Koşu, Kitap..."
              error={errors.name?.message}
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wider mb-2">
              Renk
            </label>
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue('color', color)}
                  className="w-8 h-8 rounded-sm transition-all duration-150 flex-shrink-0"
                  style={{
                    backgroundColor: color,
                    outline: selectedColor === color ? `2px solid ${color}` : '2px solid transparent',
                    outlineOffset: '2px',
                    transform: selectedColor === color ? 'scale(1.15)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Icon */}
          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wider mb-2">
              İkon
            </label>
            <div className="flex gap-2 flex-wrap">
              {PRESET_ICONS.map(({ key, label }) => {
                const Icon = getIcon(key)
                const isSelected = selectedIcon === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setValue('icon', key)}
                    title={label}
                    className={cn(
                      'w-9 h-9 rounded-sm flex items-center justify-center transition-all duration-150 border',
                      isSelected
                        ? 'border-accent/60 bg-accent/15 text-accent'
                        : 'border-border bg-surface-2 text-text-muted hover:text-text-primary hover:border-text-muted',
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wider mb-2">
              Sıklık
            </label>
            <div className="flex gap-2">
              {(['daily', 'weekdays', 'custom'] as const).map((freq) => {
                const labels = { daily: 'Her Gün', weekdays: 'Hafta İçi', custom: 'Özel' }
                return (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setValue('frequency', freq)}
                    className={cn(
                      'flex-1 h-9 text-sm rounded-sm border transition-all duration-150',
                      selectedFreq === freq
                        ? 'bg-accent/10 text-accent border-accent/40'
                        : 'bg-surface-2 text-text-muted border-border hover:text-text-primary',
                    )}
                  >
                    {labels[freq]}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Target streak */}
          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wider mb-2">
              Hedef Streak (gün, opsiyonel)
            </label>
            <Input
              type="number"
              min={0}
              {...register('target_streak', { valueAsNumber: true })}
              placeholder="0"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              İptal
            </Button>
            <Button
              type="submit"
              loading={saving}
              className="flex-1"
              style={{ backgroundColor: selectedColor, color: '#0A0A0F' }}
            >
              Kaydet
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
