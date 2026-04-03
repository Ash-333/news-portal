'use client'

import { ReactNode } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Column<T> {
  key: string
  header: string
  sortable?: boolean
  width?: string
  render?: (item: T) => ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  onSort?: (key: string) => void
  onRowClick?: (item: T) => void
  selectable?: boolean
  selectedIds?: string[]
  onSelect?: (id: string, selected: boolean) => void
  onSelectAll?: (selected: boolean) => void
  emptyState?: ReactNode
  isLoading?: boolean
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  sortBy,
  sortOrder,
  onSort,
  onRowClick,
  selectable,
  selectedIds = [],
  onSelect,
  onSelectAll,
  emptyState,
  isLoading,
}: DataTableProps<T>) {
  const allSelected = data.length > 0 && data.every((item) => selectedIds.includes(keyExtractor(item)))

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="animate-pulse space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-200 dark:bg-slate-800 rounded" />
          ))}
        </div>
      </div>
    )
  }

  if (data.length === 0 && emptyState) {
    return <div className="w-full">{emptyState}</div>
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
          <tr>
            {selectable && (
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll?.(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'px-4 py-3 text-left font-medium text-slate-700 dark:text-slate-300',
                  column.sortable && 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800',
                  column.width
                )}
                onClick={() => column.sortable && onSort?.(column.key)}
              >
                <div className="flex items-center gap-1">
                  {column.header}
                  {column.sortable && sortBy === column.key && (
                    sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {data.map((item) => {
            const id = keyExtractor(item)
            const isSelected = selectedIds.includes(id)
            return (
              <tr
                key={id}
                className={cn(
                  'bg-white dark:bg-slate-950',
                  onRowClick && 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50',
                  isSelected && 'bg-blue-50 dark:bg-blue-900/10'
                )}
                onClick={() => onRowClick?.(item)}
              >
                {selectable && (
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => onSelect?.(id, e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3">
                    {column.render ? column.render(item) : (item as Record<string, unknown>)[column.key] as ReactNode}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
