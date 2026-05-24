import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: 'gold' | 'blue' | false
  hover?: boolean
}

export function Card({ className, glow = false, hover = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-card p-6',
        hover && 'transition-all duration-150 hover:-translate-y-0.5 cursor-pointer',
        glow === 'gold' && 'shadow-glow-gold',
        glow === 'blue' && 'shadow-glow-blue',
        className
      )}
      style={{
        boxShadow: glow === 'gold'
          ? 'var(--shadow-md), var(--shadow-glow-gold)'
          : glow === 'blue'
          ? 'var(--shadow-md), var(--shadow-glow-blue)'
          : 'var(--shadow-sm)',
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('font-display text-sm font-semibold text-text-secondary uppercase tracking-wider', className)}
      {...props}
    >
      {children}
    </h3>
  )
}
