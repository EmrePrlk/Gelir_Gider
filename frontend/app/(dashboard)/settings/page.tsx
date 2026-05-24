'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import PageWrapper from '@/components/layout/PageWrapper'
import Button from '@/components/ui/Button'
import { dashboardApi } from '@/lib/api/dashboard'
import { financeApi } from '@/lib/api/finance'
import { User, Lock, Database, CheckCircle2, AlertCircle } from 'lucide-react'

const inputClass = 'w-full bg-transparent border rounded-card px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent transition-colors'
const inputStyle = { borderColor: 'var(--border)' }

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div
      className="rounded-card border p-6"
      style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center gap-2 mb-5">
        <Icon className="w-4 h-4" style={{ color: 'var(--accent)' }} />
        <h2 className="font-display text-sm font-semibold text-text-primary">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <div
      className="flex items-center gap-2 text-sm mt-3"
      style={{ color: type === 'success' ? 'var(--success)' : 'var(--danger)' }}
    >
      {type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      {message}
    </div>
  )
}

export default function SettingsPage() {
  const queryClient = useQueryClient()

  const { data: me } = useQuery({
    queryKey: ['me'],
    queryFn: dashboardApi.getMe,
  })

  const [profile, setProfile] = useState({ username: '', first_name: '', last_name: '' })
  const [profileMsg, setProfileMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const [pw, setPw] = useState({ current_password: '', new_password: '', confirm: '' })
  const [pwMsg, setPwMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const { data: excelSchema } = useQuery({
    queryKey: ['finance', 'excel-schema'],
    queryFn: financeApi.schema.get,
  })

  const profileMutation = useMutation({
    mutationFn: dashboardApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
      setProfileMsg({ text: 'Profil güncellendi.', type: 'success' })
      setTimeout(() => setProfileMsg(null), 3000)
    },
    onError: () => setProfileMsg({ text: 'Güncelleme başarısız.', type: 'error' }),
  })

  const pwMutation = useMutation({
    mutationFn: dashboardApi.changePassword,
    onSuccess: () => {
      setPwMsg({ text: 'Şifre değiştirildi.', type: 'success' })
      setPw({ current_password: '', new_password: '', confirm: '' })
      setTimeout(() => setPwMsg(null), 3000)
    },
    onError: (e: any) => setPwMsg({ text: e.message ?? 'Şifre değiştirilemedi.', type: 'error' }),
  })

  const handleProfileSave = () => {
    const payload: Record<string, string> = {}
    if (profile.username) payload.username = profile.username
    if (profile.first_name) payload.first_name = profile.first_name
    if (profile.last_name) payload.last_name = profile.last_name
    if (Object.keys(payload).length === 0) return
    profileMutation.mutate(payload)
  }

  const handlePwSave = () => {
    if (pw.new_password !== pw.confirm) {
      setPwMsg({ text: 'Yeni şifreler eşleşmiyor.', type: 'error' })
      return
    }
    pwMutation.mutate({ current_password: pw.current_password, new_password: pw.new_password })
  }

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-text-primary">Ayarlar</h1>
        <p className="text-sm text-text-muted mt-0.5">Hesap ve uygulama ayarları</p>
      </div>

      <div className="max-w-xl space-y-5">
        {/* Profile */}
        <Section title="Profil" icon={User}>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-text-muted block mb-1">Kullanıcı Adı</label>
              <input
                value={profile.username}
                onChange={(e) => setProfile((f) => ({ ...f, username: e.target.value }))}
                placeholder="Yeni kullanıcı adı..."
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-text-muted block mb-1">Ad</label>
                <input
                  value={profile.first_name}
                  onChange={(e) => setProfile((f) => ({ ...f, first_name: e.target.value }))}
                  placeholder="Ad..."
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="text-xs text-text-muted block mb-1">Soyad</label>
                <input
                  value={profile.last_name}
                  onChange={(e) => setProfile((f) => ({ ...f, last_name: e.target.value }))}
                  placeholder="Soyad..."
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
            </div>
            <Button size="sm" onClick={handleProfileSave} loading={profileMutation.isPending}>
              Kaydet
            </Button>
            {profileMsg && <Toast message={profileMsg.text} type={profileMsg.type} />}
          </div>
        </Section>

        {/* Password */}
        <Section title="Şifre Değiştir" icon={Lock}>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-text-muted block mb-1">Mevcut Şifre</label>
              <input
                type="password"
                value={pw.current_password}
                onChange={(e) => setPw((f) => ({ ...f, current_password: e.target.value }))}
                placeholder="••••••••"
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div>
              <label className="text-xs text-text-muted block mb-1">Yeni Şifre</label>
              <input
                type="password"
                value={pw.new_password}
                onChange={(e) => setPw((f) => ({ ...f, new_password: e.target.value }))}
                placeholder="En az 8 karakter"
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div>
              <label className="text-xs text-text-muted block mb-1">Yeni Şifre (Tekrar)</label>
              <input
                type="password"
                value={pw.confirm}
                onChange={(e) => setPw((f) => ({ ...f, confirm: e.target.value }))}
                placeholder="••••••••"
                className={inputClass}
                style={inputStyle}
                onKeyDown={(e) => e.key === 'Enter' && handlePwSave()}
              />
            </div>
            <Button size="sm" onClick={handlePwSave} loading={pwMutation.isPending}>
              Şifreyi Değiştir
            </Button>
            {pwMsg && <Toast message={pwMsg.text} type={pwMsg.type} />}
          </div>
        </Section>

        {/* Excel Schema */}
        <Section title="Excel / İçe Aktarma Şeması" icon={Database}>
          {excelSchema ? (
            <div className="space-y-2">
              {[
                ['Tarih Sütunu', excelSchema.column_date],
                ['Tutar Sütunu', excelSchema.column_amount],
                ['Açıklama Sütunu', excelSchema.column_description],
                ['Kategori Sütunu', excelSchema.column_category || '—'],
                ['Tarih Formatı', excelSchema.date_format],
                ['Ondalık Ayracı', excelSchema.amount_decimal_separator],
              ].map(([label, val]) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">{label}</span>
                  <span className="font-mono text-text-primary">{val}</span>
                </div>
              ))}
              <p className="text-xs text-text-muted mt-3">
                Şema, CSV içe aktarma sırasında otomatik kaydedilir. Değiştirmek için yeni bir dosya yükleyin.
              </p>
            </div>
          ) : (
            <p className="text-text-muted text-sm">Henüz bir içe aktarma şeması kaydedilmemiş.</p>
          )}
        </Section>
      </div>
    </PageWrapper>
  )
}
