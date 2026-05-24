'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import PageWrapper from '@/components/layout/PageWrapper'
import Button from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { portfolioApi } from '@/lib/api/portfolio'
import { DistributionItem, TargetAllocation } from '@/types/portfolio'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from 'recharts'
import { Plus, TrendingUp, TrendingDown, Wallet, X, Target } from 'lucide-react'

function fmt(n: number, dec = 2) {
  return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(n)
}

function PnlBadge({ pct }: { pct: number }) {
  const positive = pct >= 0
  return (
    <span
      className="inline-flex items-center gap-0.5 text-xs font-mono font-medium"
      style={{ color: positive ? 'var(--success)' : 'var(--danger)' }}
    >
      {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {positive ? '+' : ''}{fmt(pct)}%
    </span>
  )
}

export default function PortfolioPage() {
  const [showTarget, setShowTarget] = useState(false)
  const queryClient = useQueryClient()

  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ['portfolio', 'summary'],
    queryFn: portfolioApi.summary,
  })

  const { data: entries = [], isLoading: loadingEntries } = useQuery({
    queryKey: ['portfolio', 'entries'],
    queryFn: portfolioApi.entries.list,
  })

  const { data: distribution = [] } = useQuery({
    queryKey: ['portfolio', 'distribution'],
    queryFn: portfolioApi.distribution,
  })

  const { data: assetClasses = [] } = useQuery({
    queryKey: ['portfolio', 'asset-classes'],
    queryFn: portfolioApi.assetClasses,
  })

  const { data: targets = [] } = useQuery({
    queryKey: ['portfolio', 'target'],
    queryFn: portfolioApi.target.list,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => portfolioApi.entries.delete(id),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['portfolio'] }),
  })

  const saveTargetMutation = useMutation({
    mutationFn: portfolioApi.target.save,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portfolio', 'target'] }),
  })

  const [targetForm, setTargetForm] = useState<Record<number, string>>({})

  const initTargetForm = () => {
    const init: Record<number, string> = {}
    targets.forEach((t) => { init[t.asset_class.id] = String(t.percentage) })
    setTargetForm(init)
    setShowTarget(true)
  }

  const handleSaveTarget = () => {
    const allocations = Object.entries(targetForm)
      .map(([id, pct]) => ({ asset_class_id: Number(id), percentage: Number(pct) }))
      .filter((a) => a.percentage > 0)
    saveTargetMutation.mutate(allocations)
    setShowTarget(false)
  }

  const donutData = distribution.map((d) => ({
    name: d.asset_class_name,
    value: d.total_value,
    color: d.asset_class_color,
  }))

  const targetMap: Record<number, number> = {}
  targets.forEach((t) => { targetMap[t.asset_class.id] = Number(t.percentage) })

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Portföy</h1>
          <p className="text-sm text-text-muted mt-0.5">Yatırım takibi</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={initTargetForm}>
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">Hedef</span>
          </Button>
          <Link href="/portfolio/add">
            <Button size="sm">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Ekle</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          {
            label: 'Toplam Değer',
            value: summary?.total_value ?? 0,
            icon: Wallet,
            color: 'var(--accent)',
          },
          {
            label: 'Toplam Maliyet',
            value: summary?.total_cost ?? 0,
            icon: TrendingDown,
            color: 'var(--text-muted)',
          },
          {
            label: 'Kar / Zarar',
            value: summary?.pnl ?? 0,
            icon: TrendingUp,
            color: (summary?.pnl ?? 0) >= 0 ? 'var(--success)' : 'var(--danger)',
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-card border p-4 sm:p-5"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}
          >
            {loadingSummary ? (
              <Skeleton className="h-12" />
            ) : (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
                  <p className="text-xs text-text-muted">{label}</p>
                </div>
                <p className="font-mono text-lg sm:text-2xl font-bold" style={{ color }}>
                  {fmt(value)} ₺
                </p>
                {label === 'Kar / Zarar' && summary && (
                  <PnlBadge pct={summary.pnl_pct} />
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Donut */}
        <div
          className="rounded-card border p-5"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <p className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest mb-4">
            Varlık Dağılımı
          </p>
          {distribution.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-text-muted text-sm">Veri yok</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {donutData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [`${fmt(v)} ₺`]}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="space-y-2 mt-2">
            {distribution.map((d) => (
              <div key={d.asset_class_id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.asset_class_color }} />
                  <span className="text-text-secondary">{d.asset_class_name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-text-muted">{d.percentage}%</span>
                  {targetMap[d.asset_class_id] !== undefined && (
                    <span
                      className="font-mono text-xs"
                      style={{
                        color: Math.abs(d.percentage - targetMap[d.asset_class_id]) > 5
                          ? 'var(--warning)'
                          : 'var(--text-muted)',
                      }}
                    >
                      hedef {targetMap[d.asset_class_id]}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Target allocation editor */}
        {showTarget && (
          <div
            className="rounded-card border p-5 lg:col-span-2"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--accent)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest">
                Hedef Dağılım
              </p>
              <button onClick={() => setShowTarget(false)}>
                <X className="w-4 h-4 text-text-muted" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {assetClasses.map((ac) => (
                <div key={ac.id} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: ac.color }} />
                  <span className="text-sm text-text-secondary flex-1">{ac.name}</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={targetForm[ac.id] ?? ''}
                      onChange={(e) => setTargetForm((f) => ({ ...f, [ac.id]: e.target.value }))}
                      placeholder="0"
                      className="w-16 bg-transparent border rounded px-2 py-1 text-sm text-right font-mono outline-none focus:border-accent"
                      style={{ borderColor: 'var(--border)' }}
                    />
                    <span className="text-text-muted text-sm">%</span>
                  </div>
                </div>
              ))}
            </div>
            <Button size="sm" onClick={handleSaveTarget} loading={saveTargetMutation.isPending}>
              Kaydet
            </Button>
          </div>
        )}
      </div>

      {/* P&L Table */}
      <section>
        <p className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest mb-3">
          Varlıklar
        </p>
        <div className="rounded-card border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          {loadingEntries ? (
            <div className="p-4 space-y-2">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12" />)}
            </div>
          ) : entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-text-muted text-sm">Henüz varlık yok.</p>
              <Link href="/portfolio/add" className="text-accent text-sm hover:underline mt-2">
                + İlk varlığı ekle
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface-2)' }}>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-muted">Sembol</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-muted hidden sm:table-cell">Sınıf</th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-text-muted">Miktar</th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-text-muted hidden md:table-cell">Maliyet</th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-text-muted">Değer</th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-text-muted">K/Z</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, idx) => (
                  <tr
                    key={entry.id}
                    style={{
                      borderBottom: idx < entries.length - 1 ? '1px solid var(--border)' : undefined,
                      backgroundColor: 'var(--surface)',
                    }}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <span className="font-mono text-sm font-bold text-text-primary">{entry.asset.symbol}</span>
                        <p className="text-xs text-text-muted">{entry.asset.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${entry.asset.asset_class.color}22`,
                          color: entry.asset.asset_class.color,
                        }}
                      >
                        {entry.asset.asset_class.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-mono text-sm text-text-primary">{fmt(entry.quantity, 4)}</span>
                    </td>
                    <td className="px-4 py-3 text-right hidden md:table-cell">
                      <span className="font-mono text-sm text-text-muted">{fmt(entry.cost)} ₺</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-mono text-sm font-medium text-text-primary">{fmt(entry.value)} ₺</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <PnlBadge pct={entry.pnl_pct} />
                    </td>
                    <td className="px-3 py-3">
                      <button
                        onClick={() => deleteMutation.mutate(entry.id)}
                        className="text-text-muted hover:text-danger transition-colors text-sm"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </PageWrapper>
  )
}
