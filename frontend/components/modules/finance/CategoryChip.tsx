import { Category } from '@/types/finance'
import * as LucideIcons from 'lucide-react'
import { LucideProps } from 'lucide-react'
import { ComponentType } from 'react'

type AnyIcon = ComponentType<LucideProps>

interface CategoryChipProps {
  category: Category | null
  size?: 'sm' | 'md'
}

export default function CategoryChip({ category, size = 'sm' }: CategoryChipProps) {
  if (!category) {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
        style={{ backgroundColor: 'var(--surface-2)', color: 'var(--text-muted)' }}
      >
        Kategorisiz
      </span>
    )
  }

  const Icon = (LucideIcons as unknown as Record<string, AnyIcon>)[category.icon] ?? LucideIcons.Tag

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{
        backgroundColor: `${category.color}22`,
        color: category.color,
      }}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {category.name}
    </span>
  )
}
