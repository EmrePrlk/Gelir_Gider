'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { HeatmapEntry } from '@/types/habits'

const CalendarHeatmap = dynamic(
  () => import('react-calendar-heatmap'),
  { ssr: false, loading: () => <div className="h-32 animate-pulse bg-surface-2 rounded" /> }
)

interface TooltipState {
  text: string
  x: number
  y: number
}

function classForValue(value: any): string {
  if (!value || !value.count) return 'color-empty'
  if (value.count === 1) return 'color-scale-1'
  if (value.count === 2) return 'color-scale-2'
  if (value.count === 3) return 'color-scale-3'
  return 'color-scale-4'
}

const MONTHS_TR = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getDate()} ${MONTHS_TR[d.getMonth()]} ${d.getFullYear()}`
}

interface HabitHeatmapProps {
  data: HeatmapEntry[]
}

export default function HabitHeatmap({ data }: HabitHeatmapProps) {
  const today = new Date()
  const startDate = new Date(today)
  startDate.setFullYear(startDate.getFullYear() - 1)

  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  return (
    <div className="relative w-full">
      <CalendarHeatmap
        startDate={startDate}
        endDate={today}
        values={data}
        classForValue={classForValue}
        showWeekdayLabels
        gutterSize={3}
        onMouseOver={(event: any, value: any) => {
          if (!value || !value.count) return
          const rect = (event.target as Element).getBoundingClientRect()
          setTooltip({
            text: `${formatDate(value.date)}: ${value.count} alışkanlık`,
            x: rect.left + rect.width / 2,
            y: rect.top,
          })
        }}
        onMouseLeave={() => setTooltip(null)}
      />

      {tooltip && (
        <div
          className="fixed z-50 px-2.5 py-1.5 text-xs rounded border pointer-events-none -translate-x-1/2 -translate-y-full"
          style={{
            left: tooltip.x,
            top: tooltip.y - 6,
            backgroundColor: 'var(--surface-2)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  )
}
