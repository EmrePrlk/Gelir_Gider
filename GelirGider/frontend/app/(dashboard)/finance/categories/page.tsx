'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import PageWrapper from '@/components/layout/PageWrapper'
import Button from '@/components/ui/Button'
import { financeApi } from '@/lib/api/finance'
import { CategoryFormData, TransactionType, CATEGORY_COLORS, CATEGORY_ICONS } from '@/types/finance'
import * as LucideIcons from 'lucide-react'
import { LucideProps } from 'lucide-react'
import { ComponentType } from 'react'
import { ArrowLeft, Plus, X } from 'lucide-react'

type AnyIcon = ComponentType<LucideProps>

function CategoryIcon({ name }: { name: string }) {
  const Icon = (LucideIcons as unknown as Record<string, AnyIcon>)[name] ?? LucideIcons.Tag
  return <Icon className="w-5 h-5" />
}

export default function CategoriesPage() {
  const [showForm, setShowForm] = useState(false)
  const [activeType, setActiveType] = useState<TransactionType>('expense')
  const [form, setForm] = useState<CategoryFormData>({
    name: '',
    type: 'expense',
    color: CATEGORY_COLORS[0],
    icon: CATEGORY_ICONS[0],
  })
  const queryClient = useQueryClient()

  const { data: categories = [] } = useQuery({
    queryKey: ['finance', 'categories'],
    queryFn: () => financeApi.categories.list(),
  })

  const createMutation = useMutation({
    mutationFn: (data: CategoryFormData) => financeApi.categories.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance', 'categories'] })
      setShowForm(false)
      setForm({ name: '', type: activeType, color: CATEGORY_COLORS[0], icon: CATEGORY_ICONS[0] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => financeApi.categories.delete(id),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['finance', 'categories'] }),
  })

  const filtered = categories.filter((c) => c.type === activeType)

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <Link href="/finance">
            <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button>
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-text-primary">Kategoriler</h1>
            <p className="text-sm text-text-muted mt-0.5">Gelir ve gider kategorilerini yönet</p>
          </div>
        </div>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4" />
          Yeni Kategori
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['expense', 'income'] as TransactionType[]).map((t) => (
          <button
            key={t}
            onClick={() => setActiveType(t)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: activeType === t ? (t === 'expense' ? 'var(--danger)' : 'var(--success)') : 'var(--surface)',
              color: activeType === t ? '#fff' : 'var(--text-secondary)',
              border: '1px solid',
              borderColor: activeType === t ? 'transparent' : 'var(--border)',
            }}
          >
            {t === 'expense' ? 'Gider' : 'Gelir'}
          </button>
        ))}
      </div>

      {/* Add form */}
      {showForm && (
        <div
          className="rounded-card border p-5 mb-6"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--accent)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="font-display text-sm font-semibold text-text-primary">Yeni Kategori</p>
            <button onClick={() => setShowForm(false)}>
              <X className="w-4 h-4 text-text-muted" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Kategori adı..."
                className="flex-1 bg-transparent border rounded-card px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent transition-colors"
                style={{ borderColor: 'var(--border)' }}
                onKeyDown={(e) => e.key === 'Enter' && form.name && createMutation.mutate({ ...form, type: activeType })}
              />
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as TransactionType }))}
                className="rounded-card border px-3 py-2 text-sm outline-none"
                style={{ backgroundColor: 'var(--surface-2)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
              >
                <option value="expense">Gider</option>
                <option value="income">Gelir</option>
              </select>
            </div>

            {/* Colors */}
            <div>
              <p className="text-xs text-text-muted mb-2">Renk</p>
              <div className="flex gap-2 flex-wrap">
                {CATEGORY_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setForm((f) => ({ ...f, color }))}
                    className="w-7 h-7 rounded-full transition-all"
                    style={{
                      backgroundColor: color,
                      outline: form.color === color ? `2px solid ${color}` : 'none',
                      outlineOffset: 2,
                      transform: form.color === color ? 'scale(1.2)' : 'scale(1)',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Icons */}
            <div>
              <p className="text-xs text-text-muted mb-2">İkon</p>
              <div className="flex gap-2 flex-wrap">
                {CATEGORY_ICONS.map((icon) => {
                  const Icon = (LucideIcons as unknown as Record<string, AnyIcon>)[icon] ?? LucideIcons.Tag
                  return (
                    <button
                      key={icon}
                      onClick={() => setForm((f) => ({ ...f, icon }))}
                      className="w-9 h-9 rounded-card flex items-center justify-center transition-all"
                      style={{
                        backgroundColor: form.icon === icon ? `${form.color}22` : 'var(--surface-2)',
                        color: form.icon === icon ? form.color : 'var(--text-muted)',
                        border: `1px solid ${form.icon === icon ? form.color : 'transparent'}`,
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  )
                })}
              </div>
            </div>

            <Button
              onClick={() => form.name && createMutation.mutate({ ...form, type: activeType })}
              loading={createMutation.isPending}
              disabled={!form.name}
              className="w-full"
            >
              Kaydet
            </Button>
          </div>
        </div>
      )}

      {/* Category grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-text-muted text-sm">Henüz kategori yok.</p>
          <button
            className="text-accent text-sm hover:underline mt-2"
            onClick={() => setShowForm(true)}
          >
            + İlk kategoriyi ekle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((cat) => {
            const Icon = (LucideIcons as unknown as Record<string, AnyIcon>)[cat.icon] ?? LucideIcons.Tag
            return (
              <div
                key={cat.id}
                className="group relative rounded-card border p-4 flex flex-col items-center gap-3 transition-all hover:-translate-y-0.5"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-card flex items-center justify-center"
                  style={{ backgroundColor: `${cat.color}22` }}
                >
                  <Icon className="w-6 h-6" style={{ color: cat.color }} />
                </div>
                <p className="text-sm font-medium text-text-primary text-center">{cat.name}</p>

                <button
                  onClick={() => deleteMutation.mutate(cat.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-text-muted hover:text-danger transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </PageWrapper>
  )
}
