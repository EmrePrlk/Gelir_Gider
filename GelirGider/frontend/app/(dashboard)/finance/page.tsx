'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import PageWrapper from '@/components/layout/PageWrapper'
import CategoryChip from '@/components/modules/finance/CategoryChip'
import { Skeleton } from '@/components/ui/Skeleton'
import Button from '@/components/ui/Button'
import { financeApi } from '@/lib/api/finance'
import { Transaction, Category, TransactionType } from '@/types/finance'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { Upload, Download, Settings, TrendingUp, TrendingDown, Minus, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

const MONTHS_SHORT = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']

function fmt(n: number) {
  return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
}

function monthLabel(m: string) {
  const [, month] = m.split('-')
  return MONTHS_SHORT[parseInt(month) - 1]
}

export default function FinancePage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all')
  const [exporting, setExporting] = useState(false)
  const [editingCategory, setEditingCategory] = useState<number | null>(null)
  const queryClient = useQueryClient()

  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ['finance', 'summary'],
    queryFn: financeApi.summary,
  })

  const { data: breakdown = [] } = useQuery({
    queryKey: ['finance', 'breakdown'],
    queryFn: () => financeApi.breakdown({ type: 'expense' }),
  })

  const { data: categories = [] } = useQuery({
    queryKey: ['finance', 'categories'],
    queryFn: () => financeApi.categories.list(),
  })

  const txParams: Record<string, string> = {}
  if (typeFilter !== 'all') txParams.type = typeFilter
  if (search) txParams.search = search

  const { data: transactions = [], isLoading: loadingTx } = useQuery({
    queryKey: ['finance', 'transactions', txParams],
    queryFn: () => financeApi.transactions.list(txParams),
  })

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, categoryId }: { id: number; categoryId: number | null }) =>
      financeApi.transactions.update(id, { category: categoryId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance', 'transactions'] })
      queryClient.invalidateQueries({ queryKey: ['finance', 'breakdown'] })
      setEditingCategory(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => financeApi.transactions.delete(id),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['finance'] }),
  })

  const handleExport = async () => {
    setExporting(true)
    try { await financeApi.exportExcel() } finally { setExporting(false) }
  }

  const trendData = (summary?.monthly_trend ?? []).map((m) => ({
    name: monthLabel(m.month),
    Gelir: m.income,
    Gider: m.expense,
  }))

  const donutData = breakdown.slice(0, 6).map((b) => ({
    name: b.category_name,
    value: b.total,
    color: b.category_color,
  }))

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Gelir / Gider</h1>
          <p className="text-sm text-text-muted mt-0.5">Bu ay finansal özet</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href="/finance/categories">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Kategoriler</span>
            </Button>
          </Link>
          <Link href="/finance/import">
            <Button variant="secondary" size="sm">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">İçe Aktar</span>
            </Button>
          </Link>
          <Button size="sm" onClick={handleExport} loading={exporting}>
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Excel</span>
          </Button>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Bu Ay Gelir', value: summary?.income ?? 0, icon: TrendingUp, color: 'var(--success)' },
          { label: 'Bu Ay Gider', value: summary?.expense ?? 0, icon: TrendingDown, color: 'var(--danger)' },
          { label: 'Net Bakiye', value: summary?.net ?? 0, icon: Minus, color: (summary?.net ?? 0) >= 0 ? 'var(--success)' : 'var(--danger)' },
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
                <p className="font-mono text-xl sm:text-2xl font-bold" style={{ color }}>
                  {fmt(value)} ₺
                </p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Bar chart — 2/3 */}
        <div
          className="lg:col-span-2 rounded-card border p-5"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <p className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest mb-4">
            Son 12 Ay Trend
          </p>
          {loadingSummary ? (
            <Skeleton className="h-48" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={trendData} barSize={8} barGap={2}>
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: 'var(--text-primary)' }}
                  formatter={(v: number) => [`${fmt(v)} ₺`]}
                />
                <Bar dataKey="Gelir" fill="var(--success)" radius={[3, 3, 0, 0]} opacity={0.85} />
                <Bar dataKey="Gider" fill="var(--danger)" radius={[3, 3, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Donut — 1/3 */}
        <div
          className="rounded-card border p-5"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <p className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest mb-4">
            Kategori Dağılımı
          </p>
          {breakdown.length === 0 ? (
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
                  {donutData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [`${fmt(v)} ₺`]}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="space-y-1 mt-2">
            {breakdown.slice(0, 4).map((b) => (
              <div key={b.category_id ?? 'none'} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: b.category_color }} />
                  <span className="text-text-secondary">{b.category_name}</span>
                </div>
                <span className="font-mono text-text-muted">{b.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction table */}
      <section>
        <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
          <span className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest">
            İşlemler
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {(['all', 'income', 'expense'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className="text-xs px-3 py-1.5 rounded-full border transition-all"
                style={{
                  backgroundColor: typeFilter === t ? (t === 'income' ? 'var(--success)' : t === 'expense' ? 'var(--danger)' : 'var(--accent)') : 'transparent',
                  borderColor: typeFilter === t ? (t === 'income' ? 'var(--success)' : t === 'expense' ? 'var(--danger)' : 'var(--accent)') : 'var(--border)',
                  color: typeFilter === t ? '#fff' : 'var(--text-secondary)',
                }}
              >
                {t === 'all' ? 'Tümü' : t === 'income' ? 'Gelir' : 'Gider'}
              </button>
            ))}
            <div
              className="flex items-center gap-2 rounded-card border px-3 py-1.5"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <Search className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ara..."
                className="bg-transparent text-xs text-text-primary placeholder:text-text-muted outline-none w-32"
              />
            </div>
          </div>
        </div>

        <div className="rounded-card border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          {loadingTx ? (
            <div className="p-4 space-y-2">
              {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-12" />)}
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-text-muted text-sm">İşlem bulunamadı.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface-2)' }}>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-muted">Tarih</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-muted">Açıklama</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-muted hidden sm:table-cell">Kategori</th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-text-muted">Tutar</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, idx) => (
                  <tr
                    key={tx.id}
                    style={{
                      borderBottom: idx < transactions.length - 1 ? '1px solid var(--border)' : undefined,
                      backgroundColor: 'var(--surface)',
                    }}
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-text-muted">{tx.date}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-text-primary">{tx.description}</span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      {editingCategory === tx.id ? (
                        <select
                          autoFocus
                          defaultValue={tx.category ?? ''}
                          onBlur={(e) => {
                            const val = e.target.value
                            updateCategoryMutation.mutate({ id: tx.id, categoryId: val ? Number(val) : null })
                          }}
                          className="text-xs rounded px-2 py-1 outline-none"
                          style={{ backgroundColor: 'var(--surface-2)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                        >
                          <option value="">Kategorisiz</option>
                          {categories
                            .filter((c) => c.type === tx.type)
                            .map((c) => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                      ) : (
                        <button onClick={() => setEditingCategory(tx.id)}>
                          <CategoryChip category={tx.category_detail} />
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className="font-mono text-sm font-medium"
                        style={{ color: tx.type === 'income' ? 'var(--success)' : 'var(--danger)' }}
                      >
                        {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)} ₺
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <button
                        onClick={() => deleteMutation.mutate(tx.id)}
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
