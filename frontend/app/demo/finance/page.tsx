'use client'

import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import {
  TrendingUp, TrendingDown, Minus, Upload, Download, Settings,
  Search, Plus, X, ShoppingCart, UtensilsCrossed, Car, Zap,
  Heart, Gamepad2, Shirt, Monitor, Home, Briefcase, Tag,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { TransactionType, Category, Transaction } from '@/types/finance'

// ─── Mock data ───────────────────────────────────────────────────────────────

const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Market', type: 'expense', color: '#34D399', icon: 'ShoppingCart' },
  { id: 2, name: 'Restoran', type: 'expense', color: '#FB923C', icon: 'UtensilsCrossed' },
  { id: 3, name: 'Ulaşım', type: 'expense', color: '#4F8EF7', icon: 'Car' },
  { id: 4, name: 'Fatura', type: 'expense', color: '#F87171', icon: 'Zap' },
  { id: 5, name: 'Sağlık', type: 'expense', color: '#EC4899', icon: 'Heart' },
  { id: 6, name: 'Eğlence', type: 'expense', color: '#8B5CF6', icon: 'Gamepad2' },
  { id: 7, name: 'Maaş', type: 'income', color: '#34D399', icon: 'Briefcase' },
  { id: 8, name: 'Yatırım Geliri', type: 'income', color: '#FBBF24', icon: 'TrendingUp' },
]

const today = new Date()
const fmt_date = (d: Date) => d.toISOString().split('T')[0]
const daysAgo = (n: number) => { const d = new Date(today); d.setDate(d.getDate() - n); return fmt_date(d) }

const MOCK_TRANSACTIONS: (Transaction & { category_detail: Category | null })[] = [
  { id: 1, date: daysAgo(0), amount: 342.50, description: 'Migros Market', type: 'expense', source: 'manual', notes: '', created_at: '', category: 1, category_detail: MOCK_CATEGORIES[0] },
  { id: 2, date: daysAgo(1), amount: 89.00, description: 'Kebapçı Mehmet', type: 'expense', source: 'manual', notes: '', created_at: '', category: 2, category_detail: MOCK_CATEGORIES[1] },
  { id: 3, date: daysAgo(1), amount: 45.00, description: 'İETT Biletleme', type: 'expense', source: 'manual', notes: '', created_at: '', category: 3, category_detail: MOCK_CATEGORIES[2] },
  { id: 4, date: daysAgo(2), amount: 185.00, description: 'Elektrik Faturası', type: 'expense', source: 'manual', notes: '', created_at: '', category: 4, category_detail: MOCK_CATEGORIES[3] },
  { id: 5, date: daysAgo(3), amount: 67.50, description: 'Eczane', type: 'expense', source: 'manual', notes: '', created_at: '', category: 5, category_detail: MOCK_CATEGORIES[4] },
  { id: 6, date: daysAgo(3), amount: 120.00, description: 'Netflix + Spotify', type: 'expense', source: 'manual', notes: '', created_at: '', category: 6, category_detail: MOCK_CATEGORIES[5] },
  { id: 7, date: daysAgo(5), amount: 28500.00, description: 'Maaş — Mayıs 2026', type: 'income', source: 'manual', notes: '', created_at: '', category: 7, category_detail: MOCK_CATEGORIES[6] },
  { id: 8, date: daysAgo(7), amount: 256.80, description: 'Migros Market', type: 'expense', source: 'manual', notes: '', created_at: '', category: 1, category_detail: MOCK_CATEGORIES[0] },
  { id: 9, date: daysAgo(8), amount: 1250.00, description: 'Temizlik Servisi', type: 'expense', source: 'import', notes: '', created_at: '', category: null, category_detail: null },
  { id: 10, date: daysAgo(10), amount: 820.00, description: 'Yatırım Kar Payı', type: 'income', source: 'import', notes: '', created_at: '', category: 8, category_detail: MOCK_CATEGORIES[7] },
]

const MONTHS_SHORT = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']

const MOCK_TREND = Array.from({ length: 12 }, (_, i) => {
  const m = (today.getMonth() - 11 + i + 12) % 12
  const income = 25000 + Math.random() * 5000
  const expense = 8000 + Math.random() * 4000
  return { name: MONTHS_SHORT[m], Gelir: Math.round(income), Gider: Math.round(expense) }
})

const MOCK_BREAKDOWN = [
  { id: 1, name: 'Market', color: '#34D399', total: 2840, pct: 31 },
  { id: 2, name: 'Fatura', color: '#F87171', total: 1850, pct: 20 },
  { id: 3, name: 'Restoran', color: '#FB923C', total: 1340, pct: 15 },
  { id: 4, name: 'Ulaşım', color: '#4F8EF7', total: 980, pct: 11 },
  { id: 5, name: 'Eğlence', color: '#8B5CF6', total: 760, pct: 8 },
  { id: 6, name: 'Diğer', color: '#4A4A62', total: 1390, pct: 15 },
]

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  ShoppingCart, UtensilsCrossed, Car, Zap, Heart, Gamepad2,
  Shirt, Monitor, Home, Briefcase, Tag,
}

function fmt(n: number) {
  return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
}

function CategoryBadge({ cat }: { cat: Category | null }) {
  if (!cat) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: 'var(--surface-2)', color: 'var(--text-muted)' }}>
      Kategorisiz
    </span>
  )
  const Icon = ICON_MAP[cat.icon] ?? Tag
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${cat.color}22`, color: cat.color }}>
      <Icon className="w-3 h-3" />{cat.name}
    </span>
  )
}

type Tab = 'overview' | 'import' | 'categories'

export default function DemoFinancePage() {
  const [tab, setTab] = useState<Tab>('overview')
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS)
  const [categories, setCategories] = useState(MOCK_CATEGORIES)
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all')
  const [search, setSearch] = useState('')
  const [editingCat, setEditingCat] = useState<number | null>(null)
  const [newCat, setNewCat] = useState({ name: '', type: 'expense' as TransactionType, color: '#4F8EF7', icon: 'Tag' })
  const [showAddCat, setShowAddCat] = useState(false)
  const [catTab, setCatTab] = useState<TransactionType>('expense')

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const net = totalIncome - totalExpense

  const filtered = transactions.filter((t) => {
    if (typeFilter !== 'all' && t.type !== typeFilter) return false
    if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const COLORS_PALETTE = ['#F87171', '#FB923C', '#FBBF24', '#34D399', '#4F8EF7', '#A78BFA', '#EC4899', '#8B5CF6']

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Demo banner */}
      <div className="py-2 px-4 text-center text-xs font-medium" style={{ backgroundColor: 'var(--accent)20', color: 'var(--accent)', borderBottom: '1px solid var(--accent)30' }}>
        Demo Modu — Backend bağlantısı olmadan çalışıyor. Tüm veriler sahte.
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-text-primary">Gelir / Gider</h1>
            <p className="text-sm text-text-muted mt-0.5">Mayıs 2026 — Finansal Özet</p>
          </div>
          <div className="flex items-center gap-2">
            {(['overview', 'import', 'categories'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-3 py-1.5 rounded-lg text-sm transition-all"
                style={{
                  backgroundColor: tab === t ? 'var(--accent)' : 'var(--surface)',
                  color: tab === t ? '#fff' : 'var(--text-secondary)',
                  border: '1px solid',
                  borderColor: tab === t ? 'var(--accent)' : 'var(--border)',
                }}
              >
                {t === 'overview' ? 'Genel Bakış' : t === 'import' ? 'İçe Aktar' : 'Kategoriler'}
              </button>
            ))}
          </div>
        </div>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div className="space-y-6">
            {/* Metric cards */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Bu Ay Gelir', value: totalIncome, icon: TrendingUp, color: 'var(--success)' },
                { label: 'Bu Ay Gider', value: totalExpense, icon: TrendingDown, color: 'var(--danger)' },
                { label: 'Net Bakiye', value: net, icon: Minus, color: net >= 0 ? 'var(--success)' : 'var(--danger)' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="rounded-card border p-5" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4" style={{ color }} />
                    <p className="text-xs text-text-muted">{label}</p>
                  </div>
                  <p className="font-mono text-2xl font-bold" style={{ color }}>{fmt(value)} ₺</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 rounded-card border p-5" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                <p className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest mb-4">Son 12 Ay Trend</p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={MOCK_TREND} barSize={8} barGap={2}>
                    <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                      formatter={(v: number) => [`${fmt(v)} ₺`]}
                    />
                    <Bar dataKey="Gelir" fill="var(--success)" radius={[3, 3, 0, 0]} opacity={0.85} />
                    <Bar dataKey="Gider" fill="var(--danger)" radius={[3, 3, 0, 0]} opacity={0.85} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-card border p-5" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                <p className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest mb-4">Kategori Dağılımı</p>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={MOCK_BREAKDOWN.map((b) => ({ name: b.name, value: b.total }))} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={2} dataKey="value">
                      {MOCK_BREAKDOWN.map((b, i) => <Cell key={i} fill={b.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [`${fmt(v)} ₺`]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1 mt-2">
                  {MOCK_BREAKDOWN.slice(0, 4).map((b) => (
                    <div key={b.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: b.color }} />
                        <span className="text-text-secondary">{b.name}</span>
                      </div>
                      <span className="font-mono text-text-muted">{b.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Transaction table */}
            <div>
              <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
                <span className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest">İşlemler</span>
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
                  <div className="flex items-center gap-2 rounded-card border px-3 py-1.5" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                    <Search className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ara..." className="bg-transparent text-xs text-text-primary placeholder:text-text-muted outline-none w-24" />
                  </div>
                </div>
              </div>

              <div className="rounded-card border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
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
                    {filtered.map((tx, idx) => (
                      <tr key={tx.id} style={{ borderBottom: idx < filtered.length - 1 ? '1px solid var(--border)' : undefined, backgroundColor: 'var(--surface)' }}>
                        <td className="px-4 py-3"><span className="font-mono text-xs text-text-muted">{tx.date}</span></td>
                        <td className="px-4 py-3"><span className="text-sm text-text-primary">{tx.description}</span></td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          {editingCat === tx.id ? (
                            <select
                              autoFocus
                              defaultValue={tx.category ?? ''}
                              onBlur={(e) => {
                                const val = Number(e.target.value)
                                setTransactions((prev) => prev.map((t) =>
                                  t.id === tx.id
                                    ? { ...t, category: val || null, category_detail: categories.find((c) => c.id === val) ?? null }
                                    : t,
                                ))
                                setEditingCat(null)
                              }}
                              className="text-xs rounded px-2 py-1 outline-none"
                              style={{ backgroundColor: 'var(--surface-2)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                            >
                              <option value="">Kategorisiz</option>
                              {categories.filter((c) => c.type === tx.type).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                          ) : (
                            <button onClick={() => setEditingCat(tx.id)}>
                              <CategoryBadge cat={tx.category_detail} />
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="font-mono text-sm font-medium" style={{ color: tx.type === 'income' ? 'var(--success)' : 'var(--danger)' }}>
                            {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)} ₺
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <button onClick={() => setTransactions((prev) => prev.filter((t) => t.id !== tx.id))} className="text-text-muted hover:text-danger transition-colors text-sm">×</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── IMPORT ── */}
        {tab === 'import' && (
          <div className="flex flex-col items-center justify-center">
            <div
              className="w-full max-w-2xl border-2 border-dashed rounded-xl p-20 text-center cursor-pointer"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
            >
              <div className="w-16 h-16 rounded-card flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--surface-2)' }}>
                <Upload className="w-8 h-8" style={{ color: 'var(--accent)' }} />
              </div>
              <p className="text-text-primary font-medium mb-2">CSV veya PDF dosyası yükle</p>
              <p className="text-text-muted text-sm mb-4">Demo modunda yükleme çalışmaz</p>
              <p className="text-xs text-text-muted">Claude AI kategorileri otomatik tespit eder</p>
            </div>
            <p className="text-text-muted text-sm mt-6">
              Gerçek import için Docker ile backend'i çalıştır ve{' '}
              <span className="text-accent">/finance/import</span> sayfasını kullan.
            </p>
          </div>
        )}

        {/* ── CATEGORIES ── */}
        {tab === 'categories' && (
          <div>
            <div className="flex gap-2 mb-6">
              {(['expense', 'income'] as TransactionType[]).map((t) => (
                <button key={t} onClick={() => setCatTab(t)} className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{ backgroundColor: catTab === t ? (t === 'expense' ? 'var(--danger)' : 'var(--success)') : 'var(--surface)', color: catTab === t ? '#fff' : 'var(--text-secondary)', border: '1px solid', borderColor: catTab === t ? 'transparent' : 'var(--border)' }}>
                  {t === 'expense' ? 'Gider' : 'Gelir'}
                </button>
              ))}
              <button onClick={() => setShowAddCat(true)} className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all" style={{ backgroundColor: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                <Plus className="w-4 h-4" />Yeni Kategori
              </button>
            </div>

            {showAddCat && (
              <div className="rounded-card border p-5 mb-6" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--accent)' }}>
                <div className="flex items-center justify-between mb-4">
                  <p className="font-display text-sm font-semibold text-text-primary">Yeni Kategori</p>
                  <button onClick={() => setShowAddCat(false)}><X className="w-4 h-4 text-text-muted" /></button>
                </div>
                <div className="flex gap-3 mb-4">
                  <input value={newCat.name} onChange={(e) => setNewCat((f) => ({ ...f, name: e.target.value }))} placeholder="Kategori adı..." className="flex-1 bg-transparent border rounded-card px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none" style={{ borderColor: 'var(--border)' }} />
                  <select value={newCat.type} onChange={(e) => setNewCat((f) => ({ ...f, type: e.target.value as TransactionType }))} className="rounded-card border px-3 py-2 text-sm outline-none" style={{ backgroundColor: 'var(--surface-2)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}>
                    <option value="expense">Gider</option>
                    <option value="income">Gelir</option>
                  </select>
                </div>
                <div className="flex gap-2 mb-4 flex-wrap">
                  {COLORS_PALETTE.map((c) => (
                    <button key={c} onClick={() => setNewCat((f) => ({ ...f, color: c }))} className="w-7 h-7 rounded-full transition-all" style={{ backgroundColor: c, outline: newCat.color === c ? `2px solid ${c}` : 'none', outlineOffset: 2, transform: newCat.color === c ? 'scale(1.2)' : 'scale(1)' }} />
                  ))}
                </div>
                <button
                  onClick={() => {
                    if (!newCat.name) return
                    const id = Date.now()
                    setCategories((prev) => [...prev, { id, ...newCat }])
                    setShowAddCat(false)
                    setNewCat({ name: '', type: catTab, color: '#4F8EF7', icon: 'Tag' })
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium"
                  style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
                >
                  Kaydet
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {categories.filter((c) => c.type === catTab).map((cat) => {
                const Icon = ICON_MAP[cat.icon] ?? Tag
                return (
                  <div key={cat.id} className="group relative rounded-card border p-4 flex flex-col items-center gap-3 transition-all hover:-translate-y-0.5" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                    <div className="w-12 h-12 rounded-card flex items-center justify-center" style={{ backgroundColor: `${cat.color}22` }}>
                      <Icon className="w-6 h-6" style={{ color: cat.color }} />
                    </div>
                    <p className="text-sm font-medium text-text-primary text-center">{cat.name}</p>
                    <button onClick={() => setCategories((prev) => prev.filter((c) => c.id !== cat.id))} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-text-muted hover:text-danger transition-all">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
