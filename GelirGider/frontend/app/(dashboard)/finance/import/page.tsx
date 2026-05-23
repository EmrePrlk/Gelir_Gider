'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import PageWrapper from '@/components/layout/PageWrapper'
import Button from '@/components/ui/Button'
import { financeApi } from '@/lib/api/finance'
import { ImportPreviewRow, TransactionType } from '@/types/finance'
import { ArrowLeft, Upload, CheckCircle2, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

function fmt(n: number) {
  return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
}

export default function ImportPage() {
  const router = useRouter()
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<ImportPreviewRow[] | null>(null)
  const [editedRows, setEditedRows] = useState<ImportPreviewRow[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: categories = [] } = useQuery({
    queryKey: ['finance', 'categories'],
    queryFn: () => financeApi.categories.list(),
  })

  const handleFile = async (file: File) => {
    setError(null)
    setUploading(true)
    try {
      const result = await financeApi.import(file)
      setPreview(result.preview)
      setEditedRows(result.preview.map((r) => ({ ...r })))
    } catch (e: any) {
      setError(e.message ?? 'Yükleme başarısız')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const updateRow = (idx: number, field: keyof ImportPreviewRow, value: string | number) => {
    setEditedRows((prev) => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r))
  }

  const handleConfirm = async () => {
    setSaving(true)
    try {
      const result = await financeApi.importConfirm(editedRows)
      setSaved(true)
      setTimeout(() => router.push('/finance'), 1500)
    } catch (e: any) {
      setError(e.message ?? 'Kaydetme başarısız')
    } finally {
      setSaving(false)
    }
  }

  // Detected category breakdown from preview
  const detectedCategories = editedRows.reduce<Record<string, number>>((acc, row) => {
    const cat = row.category || 'Kategorisiz'
    acc[cat] = (acc[cat] ?? 0) + 1
    return acc
  }, {})

  const incomeTotal = editedRows.filter((r) => r.type === 'income').reduce((s, r) => s + r.amount, 0)
  const expenseTotal = editedRows.filter((r) => r.type === 'expense').reduce((s, r) => s + r.amount, 0)

  return (
    <PageWrapper>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/finance">
          <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">İçe Aktarma</h1>
          <p className="text-sm text-text-muted mt-0.5">CSV veya PDF banka ekstresi yükle</p>
        </div>
      </div>

      {!preview ? (
        /* Upload zone */
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-xl p-16 text-center cursor-pointer transition-all',
            isDragOver ? 'scale-[1.01]' : '',
          )}
          style={{
            borderColor: isDragOver ? 'var(--accent)' : 'var(--border)',
            backgroundColor: isDragOver ? 'var(--accent)08' : 'var(--surface)',
          }}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".csv,.pdf"
            className="hidden"
            onChange={handleInputChange}
          />
          {uploading ? (
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full border-2 border-accent border-t-transparent animate-spin mx-auto" />
              <p className="text-text-secondary text-sm">Dosya analiz ediliyor...</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div
                className="w-16 h-16 rounded-card flex items-center justify-center mx-auto"
                style={{ backgroundColor: 'var(--surface-2)' }}
              >
                <Upload className="w-8 h-8" style={{ color: 'var(--accent)' }} />
              </div>
              <p className="text-text-primary font-medium">CSV veya PDF dosyası yükle</p>
              <p className="text-text-muted text-sm">Sürükle bırak veya tıkla</p>
              <p className="text-xs text-text-muted">Claude AI kategorileri otomatik tespit eder</p>
            </div>
          )}

          {error && (
            <p className="mt-4 text-sm" style={{ color: 'var(--danger)' }}>{error}</p>
          )}
        </div>
      ) : saved ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <CheckCircle2 className="w-16 h-16 mb-4" style={{ color: 'var(--success)' }} />
          <p className="text-text-primary font-medium text-lg">İşlemler kaydedildi!</p>
          <p className="text-text-muted text-sm mt-1">Ana sayfaya yönlendiriliyor...</p>
        </div>
      ) : (
        /* Preview */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-3">
              <span className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest">
                Önizleme — {editedRows.length} işlem
              </span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => { setPreview(null); setEditedRows([]) }}>
                  İptal
                </Button>
                <Button size="sm" onClick={handleConfirm} loading={saving}>
                  <CheckCircle2 className="w-4 h-4" />
                  Onayla ve Kaydet
                </Button>
              </div>
            </div>

            <div className="rounded-card border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <div style={{ maxHeight: 480, overflowY: 'auto' }}>
                <table className="w-full">
                  <thead className="sticky top-0" style={{ backgroundColor: 'var(--surface-2)' }}>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <th className="text-left px-3 py-2.5 text-xs font-semibold text-text-muted">Tarih</th>
                      <th className="text-left px-3 py-2.5 text-xs font-semibold text-text-muted">Açıklama</th>
                      <th className="text-left px-3 py-2.5 text-xs font-semibold text-text-muted">Kategori</th>
                      <th className="text-left px-3 py-2.5 text-xs font-semibold text-text-muted">Tür</th>
                      <th className="text-right px-3 py-2.5 text-xs font-semibold text-text-muted">Tutar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editedRows.map((row, idx) => (
                      <tr
                        key={idx}
                        style={{
                          borderBottom: idx < editedRows.length - 1 ? '1px solid var(--border)' : undefined,
                          backgroundColor: 'var(--surface)',
                        }}
                      >
                        <td className="px-3 py-2">
                          <span className="font-mono text-xs text-text-muted">{row.date}</span>
                        </td>
                        <td className="px-3 py-2">
                          <span className="text-xs text-text-primary line-clamp-1">{row.description}</span>
                        </td>
                        <td className="px-3 py-2">
                          <select
                            value={row.category}
                            onChange={(e) => updateRow(idx, 'category', e.target.value)}
                            className="text-xs rounded px-2 py-1 outline-none w-full max-w-[140px]"
                            style={{ backgroundColor: 'var(--surface-2)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                          >
                            <option value="">Kategorisiz</option>
                            {['market', 'restoran', 'ulaşım', 'fatura', 'sağlık', 'eğlence', 'giyim', 'teknoloji', 'kira', 'maaş', 'yatırım', 'diğer'].map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                            {categories.map((c) => (
                              <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <select
                            value={row.type}
                            onChange={(e) => updateRow(idx, 'type', e.target.value as TransactionType)}
                            className="text-xs rounded px-2 py-1 outline-none"
                            style={{ backgroundColor: 'var(--surface-2)', color: row.type === 'income' ? 'var(--success)' : 'var(--danger)', border: '1px solid var(--border)' }}
                          >
                            <option value="income">Gelir</option>
                            <option value="expense">Gider</option>
                          </select>
                        </td>
                        <td className="px-3 py-2 text-right">
                          <span
                            className="font-mono text-xs font-medium"
                            style={{ color: row.type === 'income' ? 'var(--success)' : 'var(--danger)' }}
                          >
                            {fmt(row.amount)} ₺
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="space-y-4">
            <div
              className="rounded-card border p-4"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <p className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest mb-3">Özet</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Toplam İşlem</span>
                  <span className="font-mono font-bold text-text-primary">{editedRows.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Gelir</span>
                  <span className="font-mono font-bold" style={{ color: 'var(--success)' }}>+{fmt(incomeTotal)} ₺</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Gider</span>
                  <span className="font-mono font-bold" style={{ color: 'var(--danger)' }}>-{fmt(expenseTotal)} ₺</span>
                </div>
              </div>
            </div>

            <div
              className="rounded-card border p-4"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <p className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest mb-3">
                Tespit Edilen Kategoriler
              </p>
              <div className="space-y-1.5">
                {Object.entries(detectedCategories)
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, count]) => (
                    <div key={cat} className="flex items-center justify-between text-xs">
                      <span className="text-text-secondary">{cat || 'Kategorisiz'}</span>
                      <span className="font-mono text-text-muted">{count}</span>
                    </div>
                  ))}
              </div>
            </div>

            <Button className="w-full" onClick={handleConfirm} loading={saving}>
              <CheckCircle2 className="w-4 h-4" />
              Onayla ve Kaydet
            </Button>
          </div>
        </div>
      )}
    </PageWrapper>
  )
}
