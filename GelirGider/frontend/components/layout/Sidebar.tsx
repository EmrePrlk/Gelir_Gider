'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  TrendingUp,
  CheckSquare,
  Target,
  Briefcase,
  Settings,
  LogOut,
  ChevronRight,
  Zap,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/finance', icon: TrendingUp, label: 'Gelir / Gider' },
  { href: '/habits', icon: Target, label: 'Alışkanlıklar' },
  { href: '/tasks', icon: CheckSquare, label: 'Görevler' },
  { href: '/portfolio', icon: Briefcase, label: 'Portföy' },
  { href: '/settings', icon: Settings, label: 'Ayarlar' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full z-40 flex flex-col',
        'bg-surface border-r border-border',
        'transition-all duration-200 ease-out',
        isOpen ? 'w-sidebar-open' : 'w-sidebar'
      )}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-border overflow-hidden">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center flex-shrink-0 shadow-glow-gold">
            <Zap className="w-4 h-4 text-background" />
          </div>
          {isOpen && (
            <span className="font-display font-bold text-text-primary text-sm whitespace-nowrap">
              Dashboard
            </span>
          )}
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 overflow-hidden">
        <ul className="space-y-1 px-2">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-3 h-10 px-2 rounded transition-all duration-150 overflow-hidden',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isOpen && (
                    <span className="text-sm font-medium whitespace-nowrap">{label}</span>
                  )}
                  {isOpen && isActive && (
                    <ChevronRight className="w-3 h-3 ml-auto text-primary flex-shrink-0" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-2 py-4 border-t border-border overflow-hidden">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className={cn(
            'w-full flex items-center gap-3 h-10 px-2 rounded',
            'text-text-muted hover:text-danger hover:bg-danger/5 transition-all duration-150'
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span className="text-sm whitespace-nowrap">Çıkış Yap</span>}
        </button>
      </div>
    </aside>
  )
}
