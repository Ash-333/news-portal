import { ArticleStatus, CommentStatus, UserStatus } from '@prisma/client'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: ArticleStatus | CommentStatus | UserStatus
  className?: string
}

const statusConfig: Record<string, { label: string; className: string }> = {
  // Article statuses
  DRAFT: { label: 'Draft', className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  REVIEW: { label: 'Review', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  APPROVED: { label: 'Approved', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  PUBLISHED: { label: 'Published', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  ARCHIVED: { label: 'Archived', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  // Comment statuses
  PENDING: { label: 'Pending', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  REJECTED: { label: 'Rejected', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  SPAM: { label: 'Spam', className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  // User statuses
  ACTIVE: { label: 'Active', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  SUSPENDED: { label: 'Suspended', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  BANNED: { label: 'Banned', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: 'bg-slate-100 text-slate-700' }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
