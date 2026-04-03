import { Role } from '@prisma/client'
import { cn } from '@/lib/utils'

interface RoleBadgeProps {
  role: Role
  className?: string
}

const roleConfig: Record<Role, { label: string; className: string }> = {
  PUBLIC_USER: { 
    label: 'User', 
    className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' 
  },
  AUTHOR: { 
    label: 'Author', 
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
  },
  ADMIN: { 
    label: 'Admin', 
    className: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' 
  },
  SUPERADMIN: { 
    label: 'SuperAdmin', 
    className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' 
  },
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const config = roleConfig[role]

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
