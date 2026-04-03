'use client'

import { useSession } from 'next-auth/react'
import { Role } from '@prisma/client'
import { getAssignableRoles, getPermissionsForRole, hasPermission, type Permission } from '@/lib/permissions'

export function usePermissions() {
  const { data: session } = useSession()
  const role = (session?.user?.role as Role | undefined) ?? undefined
  const permissionList = getPermissionsForRole(role)

  return {
    role,
    permissions: permissionList,
    hasPermission: (permission: Permission) => hasPermission(role, permission),
    assignableRoles: getAssignableRoles(role),
  }
}
