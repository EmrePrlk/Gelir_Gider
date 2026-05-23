'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Habit } from '@/types/habits'
import * as LucideIcons from 'lucide-react'
import { Check, Flame } from 'lucide-react'

type AnyIcon = React.ComponentType<{ className?: string; style?: React.CSSProperties }>

function getIcon(name: string): AnyIcon {
  const icons = LucideIcons as unknown as Record<string, AnyIcon>
  return icons[name] ?? icons['Check']
}

const FREQ_LABEL: Record<string, string> = {
  daily: 'Her gün',
  weekdays: 'Hafta içi',
  custom: 'Özel günler',
}

interface HabitCardProps {
  habit: Habit
  onToggle: (id: number) => Promise<void>
}

export default function HabitCard({ habit, onToggle }: HabitCardProps) {
  const [isDone, setIsDone] = useState(habit.is_completed_today)
  const [pending, setPending] = useState(false)

  const IconComponent = getIcon(habit.icon)

  const handleClick = async () => {
    if (pending) return
    const prev = isDone
    setIsDone(!prev)
    setPending(true)
    try {
      await onToggle(habit.id)
    } catch {
      setIsDone(prev)
    } finally {
      setPending(false)
    }
  }

  const displayStreak = isDone
    ? habit.current_streak || 1
    : habit.current_streak

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className={cn(
        'w-full flex items-center gap-0 rounded-card overflow-hidden text-left',
        'border transition-all duration-200',
        'hover:-translate-y-px active:scale-[0.995]',
        isDone
          ? 'bg-surface/50 border-border/40'
          : 'bg-surface border-border hover:border-text-muted',
      )}
      style={{ boxShadow: isDone ? 'none' : 'var(--shadow-sm)' }}
    >
      {/* Color band */}
      <div
        className="w-[3px] self-stretch flex-shrink-0"
        style={{ backgroundColor: isDone ? `${habit.color}60` : habit.color }}
      />

      {/* Icon */}
      <div className="pl-4 pr-3 py-5 flex-shrink-0">
        <div
          className="w-9 h-9 rounded-sm flex items-center justify-center transition-colors duration-200"
          style={{ backgroundColor: isDone ? `${habit.color}15` : `${habit.color}25` }}
        >
          {isDone ? (
            <Check className="w-[18px] h-[18px]" style={{ color: habit.color }} />
          ) : (
            <IconComponent className="w-[18px] h-[18px]" style={{ color: habit.color }} />
          )}
        </div>
      </div>

      {/* Name + meta */}
      <div className="flex-1 py-5 min-w-0 pr-4">
        <p
          className={cn(
            'font-display font-semibold text-[15px] leading-tight truncate transition-all duration-200',
            isDone ? 'line-through text-text-muted' : 'text-text-primary',
          )}
        >
          {habit.name}
        </p>
        <p className="text-xs text-text-muted mt-0.5 truncate">
          {FREQ_LABEL[habit.frequency]}
          {habit.target_streak > 0 && ` · Hedef ${habit.target_streak} gün`}
        </p>
      </div>

      {/* Streak */}
      <div className="flex items-center gap-1.5 pr-5 flex-shrink-0">
        {displayStreak > 0 ? (
          <>
            <Flame
              className={cn(
                'w-4 h-4',
                isDone ? 'text-warning' : 'text-text-muted',
                isDone && displayStreak >= 7 && 'streak-pulse',
              )}
            />
            <span
              className={cn(
                'font-mono text-sm font-semibold tabular-nums',
                isDone ? 'text-warning' : 'text-text-muted',
              )}
            >
              {displayStreak}
            </span>
          </>
        ) : (
          <span className="text-xs text-text-muted/40 font-mono">—</span>
        )}
      </div>
    </button>
  )
}
