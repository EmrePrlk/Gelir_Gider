'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import PageWrapper from '@/components/layout/PageWrapper'
import Button from '@/components/ui/Button'
import { portfolioApi } from '@/lib/api/portfolio'
import { PortfolioEntryFormData } from '@/types/portfolio'
import { ArrowLeft } from 'lucide-react'

const today = new Date().toISOString().slice(0, 10)

export default function AddPortfolioPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: assetClasses = [] } = useQuery({
    queryKey: ['portfolio', 'asset-classes'],
    queryFn: portfolioApi.assetClasses,
  })

  const [form, setForm] = useState<{
    asset_symbol: string
    asset_name: string
    asset_class_id: string
    quantity: string
    purchase_price: string
    current_price: string
    purchase_date: string
    notes: string
  }>({
    asset_symbol: '',
    asset_name: '',
    asset_class_id: '',
    quantity: '',
    purchase_price: '',
    current_price: '',
    purchase_date: today,
    notes: '',
  })

  const [error, setError] = useState<string | null>(null)

  const createMutation = useMutation({
    mutationFn: (data: PortfolioEntryFormData) => portfolioApi.entries.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] })
      router.push('/portfolio')
    },
    onError: (e: any) => setError(e.message ?? 'Kaydetme başarısız'),
  })

  const set = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = () => {
    setError(null)
    if (!form.asset_symbol || !form.asset_name || !form.asset_class_id || !form.quantity || !form.purchase_price || !form.purchase_date) {
      setError('Lütfen zorunlu alanları doldurun.')
      return
    }
    const data: PortfolioEntryFormData = {
      asset_symbol: form.asset_symbol.toUpperCase(),
      asset_name: form.asset_name,
      asset_class_id: Number(form.asset_class_id),
      quantity: Number(form.quantity),
      purchase_price: Number(form.purchase_price),
      purchase_date: form.purchase_date,
      notes: form.notes,
    }
    if (form.current_price) data.current_price = Number(form.current_price)
    createMutation.mutate(data)
  }

  const inputClass = 'w-full bg-transparent border rounded-card px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent transition-colors'
  const inputStyle = { borderColor: 'var(--border)' }

  return (
    <PageWrapper>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/portfolio">
          <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Varlık Ekle</h1>
          <p className="text-sm text-text-muted mt-0.5">Portföyüne yeni bir yatırım ekle</p>
        </div>
      </div>

      <div className="max-w-lg">
        <div
          className="rounded-card border p-6 space-y-5"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          {/* Asset info */}
          <div>
            <p className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest mb-3">
              Varlık Bilgisi
            </p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-text-muted block mb-1">Sembol *</label>
                  <input
                    value={form.asset_symbol}
                    onChange={(e) => set('asset_symbol', e.target.value)}
                    placeholder="BTC, THYAO, XAUUSD..."
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="text-xs text-text-muted block mb-1">Sınıf *</label>
                  <select
                    value={form.asset_class_id}
                    onChange={(e) => set('asset_class_id', e.target.value)}
                    className={inputClass}
                    style={{ ...inputStyle, backgroundColor: 'var(--surface)' }}
                  >
                    <option value="">Seç...</option>
                    {assetClasses.map((ac) => (
                      <option key={ac.id} value={ac.id}>{ac.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-text-muted block mb-1">Varlık Adı *</label>
                <input
                  value={form.asset_name}
                  onChange={(e) => set('asset_name', e.target.value)}
                  placeholder="Bitcoin, Türk Hava Yolları..."
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Trade info */}
          <div>
            <p className="font-display text-xs font-semibold text-text-secondary uppercase tracking-widest mb-3">
              İşlem Bilgisi
            </p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-text-muted block mb-1">Miktar *</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={form.quantity}
                    onChange={(e) => set('quantity', e.target.value)}
                    placeholder="0.00"
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="text-xs text-text-muted block mb-1">Alış Fiyatı (₺) *</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={form.purchase_price}
                    onChange={(e) => set('purchase_price', e.target.value)}
                    placeholder="0.00"
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-text-muted block mb-1">Güncel Fiyat (₺)</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={form.current_price}
                    onChange={(e) => set('current_price', e.target.value)}
                    placeholder="Boş bırakılabilir"
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="text-xs text-text-muted block mb-1">Alış Tarihi *</label>
                  <input
                    type="date"
                    value={form.purchase_date}
                    onChange={(e) => set('purchase_date', e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-text-muted block mb-1">Not</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => set('notes', e.target.value)}
                  placeholder="Opsiyonel not..."
                  rows={2}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {error && <p className="text-sm" style={{ color: 'var(--danger)' }}>{error}</p>}

          {/* Preview */}
          {form.quantity && form.purchase_price && (
            <div
              className="rounded-card p-3 text-sm"
              style={{ backgroundColor: 'var(--surface-2)' }}
            >
              <div className="flex justify-between text-text-muted">
                <span>Toplam Maliyet</span>
                <span className="font-mono font-bold text-text-primary">
                  {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2 }).format(
                    Number(form.quantity) * Number(form.purchase_price)
                  )} ₺
                </span>
              </div>
            </div>
          )}

          <Button
            className="w-full"
            onClick={handleSubmit}
            loading={createMutation.isPending}
          >
            Portföye Ekle
          </Button>
        </div>
      </div>
    </PageWrapper>
  )
}
