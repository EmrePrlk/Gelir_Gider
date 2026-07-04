'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Sparkles, RefreshCw } from 'lucide-react'
import { dashboardApi } from '@/lib/api/dashboard'
import { Skeleton } from '@/components/ui/Skeleton'

export default function WeeklyInsightCard() {
  const queryClient = useQueryClient()

  const { data: insight, isLoading, isError } = useQuery({
    queryKey: ['weekly-insight'],
    queryFn: dashboardApi.weeklyInsight,
    retry: false,
  })

  const generateMutation = useMutation({
    mutationFn: dashboardApi.generateWeeklyInsight,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['weekly-insight'] }),
  })

  const weekLabel = insight
    ? new Date(insight.week_start + 'T00:00:00').toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
      })
    : null

  return (
    <div
      className="rounded-card border p-5"
      style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" style={{ color: 'var(--primary)' }} />
          <p className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest">
            Bu Haftanın Özeti
          </p>
        </div>
        <button
          onClick={() => generateMutation.mutate()}
          disabled={generateMutation.isPending}
          className="flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`w-3 h-3 ${generateMutation.isPending ? 'animate-spin' : ''}`}
          />
          Yenile
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      ) : isError || !insight ? (
        <div className="flex flex-col items-center gap-3 py-4">
          <p className="text-sm text-text-muted text-center">
            Bu hafta için henüz AI özeti oluşturulmadı.
          </p>
          <button
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
            className="text-xs px-3 py-1.5 rounded-sm border transition-colors disabled:opacity-50"
            style={{
              borderColor: 'var(--primary)',
              color: 'var(--primary)',
            }}
          >
            {generateMutation.isPending ? 'Oluşturuluyor...' : 'Şimdi Oluştur'}
          </button>
        </div>
      ) : (
        <>
          {weekLabel && (
            <p className="text-xs text-text-muted mb-2">
              {weekLabel} haftası
            </p>
          )}
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {insight.content}
          </p>
        </>
      )}
    </div>
  )
}