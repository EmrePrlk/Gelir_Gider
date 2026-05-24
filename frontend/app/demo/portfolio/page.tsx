'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from 'recharts'
import { Plus, TrendingUp, TrendingDown, Wallet, Target, X, ArrowLeft } from 'lucide-react'

/* ─── Mock Data ─────────────────────────────────────────────────── */

const ASSET_CLASSES = [
  { id: 1, name: 'Altın', key: 'gold', color: '#F59E0B' },
  { id: 2, name: 'Fon', key: 'fund', color: '#4F8EF7' },
  { id: 3, name: 'Hisse', key: 'stock', color: '#34D399' },
  { id: 4, name: 'Kripto', key: 'crypto', color: '#A78BFA' },
  { id: 5, name: 'Döviz', key: 'forex', color: '#EC4899' },
]

const INITIAL_ENTRIES = [
  {
    id: 1,
    asset: { id: 1, symbol: 'XAUUSD', name: 'Altın', asset_class: ASSET_CLASSES[0] },
    quantity: 2.5,
    purchase_price: 2800,
    current_price: 3250,
    purchase_date: '2024-11-10',
    notes: '',
  },
  {
    id: 2,
    asset: { id: 2, symbol: 'THYAO', name: 'Türk Hava Yolları', asset_class: ASSET_CLASSES[2] },
    quantity: 200,
    purchase_price: 285,
    current_price: 312,
    purchase_date: '2024-09-15',
    notes: '',
  },
  {
    id: 3,
    asset: { id: 3, symbol: 'BTC', name: 'Bitcoin', asset_class: ASSET_CLASSES[3] },
    quantity: 0.05,
    purchase_price: 2800000,
    current_price: 3350000,
    purchase_date: '2025-01-05',
    notes: '',
  },
  {
    id: 4,
    asset: { id: 4, symbol: 'TKF', name: 'Türkiye Karma Fon', asset_class: ASSET_CLASSES[1] },
    quantity: 5000,
    purchase_price: 12.5,
    current_price: 14.8,
    purchase_date: '2024-08-01',
    notes: '',
  },
  {
    id: 5,
    asset: { id: 5, symbol: 'USD', name: 'Amerikan Doları', asset_class: ASSET_CLASSES[4] },
    quantity: 1000,
    purchase_price: 32.5,
    current_price: 38.2,
    purchase_date: '2024-06-20',
    notes: '',
  },
]

const TARGET_ALLOCATIONS = [
  { asset_class_id: 1, percentage: 30 },
  { asset_class_id: 2, percentage: 25 },
  { asset_class_id: 3, percentage: 20 },
  { asset_class_id: 4, percentage: 15 },
  { asset_class_id: 5, percentage: 10 },
]

/* ─── Helpers ───────────────────────────────────────────────────── */

type Entry = typeof INITIAL_ENTRIES[0]

function effectivePrice(e: Entry) {
  return e.current_price ?? e.purchase_price
}

function entryValue(e: Entry) { return e.quantity * effectivePrice(e) }
function entryCost(e: Entry) { return e.quantity * e.purchase_price }
function entryPnl(e: Entry) { return entryValue(e) - entryCost(e) }
function entryPnlPct(e: Entry) {
  const cost = entryCost(e)
  return cost === 0 ? 0 : (entryPnl(e) / cost) * 100
}

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

/* ─── Page ──────────────────────────────────────────────────────── */

export default function DemoPortfolioPage() {
  const [entries, setEntries] = useState(INITIAL_ENTRIES)
  const [showTarget, setShowTarget] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [newEntry, setNewEntry] = useState({
    symbol: '', name: '', asset_class_id: '3',
    quantity: '', purchase_price: '', current_price: '',
  })

  const totalValue = entries.reduce((s, e) => s + entryValue(e), 0)
  const totalCost = entries.reduce((s, e) => s + entryCost(e), 0)
  const totalPnl = totalValue - totalCost
  const totalPnlPct = totalCost === 0 ? 0 : (totalPnl / totalCost) * 100

  // Distribution
  const distribution: Record<number, { name: string; color: string; value: number }> = {}
  entries.forEach((e) => {
    const ac = e.asset.asset_class
    if (!distribution[ac.id]) distribution[ac.id] = { name: ac.name, color: ac.color, value: 0 }
    distribution[ac.id].value += entryValue(e)
  })
  const distList = Object.entries(distribution)
    .map(([id, d]) => ({ ...d, id: Number(id), percentage: totalValue > 0 ? (d.value / totalValue) * 100 : 0 }))
    .sort((a, b) => b.value - a.value)

  const targetMap: Record<number, number> = {}
  TARGET_ALLOCATIONS.forEach((t) => { targetMap[t.asset_class_id] = t.percentage })

  const deleteEntry = (id: number) => setEntries((prev) => prev.filter((e) => e.id !== id))

  const handleAdd = () => {
    if (!newEntry.symbol || !newEntry.name || !newEntry.quantity || !newEntry.purchase_price) return
    const ac = ASSET_CLASSES.find((a) => a.id === Number(newEntry.asset_class_id)) ?? ASSET_CLASSES[2]
    setEntries((prev) => [
      ...prev,
      {
        id: Date.now(),
        asset: { id: Date.now(), symbol: newEntry.symbol.toUpperCase(), name: newEntry.name, asset_class: ac },
        quantity: Number(newEntry.quantity),
        purchase_price: Number(newEntry.purchase_price),
        current_price: newEntry.current_price ? Number(newEntry.current_price) : Number(newEntry.purchase_price),
        purchase_date: new Date().toISOString().slice(0, 10),
        notes: '',
      },
    ])
    setNewEntry({ symbol: '', name: '', asset_class_id: '3', quantity: '', purchase_price: '', current_price: '' })
    setShowAdd(false)
  }

  const inputClass = 'w-full bg-transparent border rounded px-2 py-1.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent'
  const inputStyle = { borderColor: 'var(--border)' }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-5xl mx-auto">
        {/* Demo banner */}
        <div
          className="rounded-card px-4 py-2.5 mb-6 flex items-center justify-between text-sm"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--accent)', color: 'var(--accent)' }}
        >
          <span className="font-medium">Demo Modu — gerçek veri yok</span>
          <Link href="/portfolio" className="text-xs hover:underline opacity-70">Gerçek portföye git →</Link>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-text-primary">Portföy</h1>
            <p className="text-sm text-text-muted mt-0.5">Yatırım takibi</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTarget(!showTarget)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-card text-sm font-medium border transition-all"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Hedef</span>
            </button>
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-card text-sm font-medium transition-all"
              style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Ekle</span>
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Toplam Değer', value: totalValue, icon: Wallet, color: 'var(--accent)' },
            { label: 'Toplam Maliyet', value: totalCost, icon: TrendingDown, color: 'var(--text-muted)' },
            { label: 'Kar / Zarar', value: totalPnl, icon: TrendingUp, color: totalPnl >= 0 ? 'var(--success)' : 'var(--danger)' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="rounded-card border p-4 sm:p-5"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
                <p className="text-xs text-text-muted">{label}</p>
              </div>
              <p className="font-mono text-lg sm:text-2xl font-bold" style={{ color }}>
                {fmt(value)} ₺
              </p>
              {label === 'Kar / Zarar' && (
                <PnlBadge pct={totalPnlPct} />
              )}
            </div>
          ))}
        </div>

        {/* Add panel */}
        {showAdd && (
          <div
            className="rounded-card border p-5 mb-6"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--accent)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="font-display text-sm font-semibold text-text-primary">Yeni Varlık</p>
              <button onClick={() => setShowAdd(false)}><X className="w-4 h-4 text-text-muted" /></button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
              <input value={newEntry.symbol} onChange={(e) => setNewEntry((f) => ({ ...f, symbol: e.target.value }))} placeholder="Sembol *" className={inputClass} style={inputStyle} />
              <input value={newEntry.name} onChange={(e) => setNewEntry((f) => ({ ...f, name: e.target.value }))} placeholder="Varlık adı *" className={inputClass} style={inputStyle} />
              <select
                value={newEntry.asset_class_id}
                onChange={(e) => setNewEntry((f) => ({ ...f, asset_class_id: e.target.value }))}
                className={inputClass}
                style={{ ...inputStyle, backgroundColor: 'var(--surface)' }}
              >
                {ASSET_CLASSES.map((ac) => <option key={ac.id} value={ac.id}>{ac.name}</option>)}
              </select>
              <input type="number" value={newEntry.quantity} onChange={(e) => setNewEntry((f) => ({ ...f, quantity: e.target.value }))} placeholder="Miktar *" className={inputClass} style={inputStyle} />
              <input type="number" value={newEntry.purchase_price} onChange={(e) => setNewEntry((f) => ({ ...f, purchase_price: e.target.value }))} placeholder="Alış fiyatı ₺ *" className={inputClass} style={inputStyle} />
              <input type="number" value={newEntry.current_price} onChange={(e) => setNewEntry((f) => ({ ...f, current_price: e.target.value }))} placeholder="Güncel fiyat ₺" className={inputClass} style={inputStyle} />
            </div>
            <button
              onClick={handleAdd}
              className="px-4 py-2 rounded-card text-sm font-medium"
              style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
            >
              Ekle
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Donut */}
          <div
            className="rounded-card border p-5"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <p className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest mb-4">
              Varlık Dağılımı
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={distList.map((d) => ({ name: d.name, value: d.value, color: d.color }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {distList.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [`${fmt(v)} ₺`]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {distList.map((d) => (
                <div key={d.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-text-secondary">{d.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-text-muted">{fmt(d.percentage, 1)}%</span>
                    {targetMap[d.id] !== undefined && (
                      <span
                        className="font-mono text-xs"
                        style={{
                          color: Math.abs(d.percentage - targetMap[d.id]) > 5 ? 'var(--warning)' : 'var(--text-muted)',
                        }}
                      >
                        hedef {targetMap[d.id]}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Target editor */}
          {showTarget && (
            <div
              className="rounded-card border p-5 lg:col-span-2"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--accent)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest">
                  Hedef Dağılım
                </p>
                <button onClick={() => setShowTarget(false)}><X className="w-4 h-4 text-text-muted" /></button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {ASSET_CLASSES.map((ac) => (
                  <div key={ac.id} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: ac.color }} />
                    <span className="text-sm text-text-secondary flex-1">{ac.name}</span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-sm text-text-primary w-8 text-right">
                        {targetMap[ac.id] ?? 0}
                      </span>
                      <span className="text-text-muted text-sm">%</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-text-muted">Demo modunda hedef düzenleme pasif.</p>
            </div>
          )}
        </div>

        {/* P&L Table */}
        <section>
          <p className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest mb-3">
            Varlıklar
          </p>
          <div className="rounded-card border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
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
                      <span className="font-mono text-sm text-text-muted">{fmt(entryCost(entry))} ₺</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-mono text-sm font-medium text-text-primary">{fmt(entryValue(entry))} ₺</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <PnlBadge pct={entryPnlPct(entry)} />
                    </td>
                    <td className="px-3 py-3">
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="text-text-muted hover:text-danger transition-colors text-sm"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
