'use client'

import { cn } from '@/lib/utils'

interface SkeletonTableProps {
  rows?: number
  cols?: number
  className?: string
}

export function SkeletonTable({ rows = 5, cols = 4, className }: SkeletonTableProps) {
  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      <div className="flex gap-4 mb-2">
        {[...Array(cols)].map((_, i) => (
          <div
            key={`header-${i}`}
            className="h-10 bg-slate-200 dark:bg-slate-800 rounded flex-1"
          />
        ))}
      </div>
      {/* Rows */}
      {[...Array(rows)].map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4 mb-2">
          {[...Array(cols)].map((_, colIndex) => (
            <div
              key={`cell-${rowIndex}-${colIndex}`}
              className="h-12 bg-slate-100 dark:bg-slate-900 rounded flex-1 animate-pulse"
              style={{ animationDelay: `${(rowIndex * cols + colIndex) * 50}ms` }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
