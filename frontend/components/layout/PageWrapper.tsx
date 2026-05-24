import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

interface PageWrapperProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
}

export default function PageWrapper({ title, className, children, ...props }: PageWrapperProps) {
  return (
    <div
      className={cn('page-enter max-w-dashboard mx-auto px-6 py-8', className)}
      {...props}
    >
      {title && (
        <h1 className="font-display text-2xl font-bold text-text-primary mb-8">{title}</h1>
      )}
      {children}
    </div>
  )
}
