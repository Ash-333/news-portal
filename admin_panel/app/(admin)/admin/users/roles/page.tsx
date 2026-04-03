import { Role } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { permissionGroups, getPermissionsForRole } from '@/lib/permissions'

const roles: Role[] = [Role.AUTHOR, Role.ADMIN, Role.SUPERADMIN]

export default function RolesAndPermissionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        description="Reference how each admin role maps to available capabilities"
      />

      <div className="grid gap-6 xl:grid-cols-3">
        {roles.map((role) => {
          const permissions = getPermissionsForRole(role)

          return (
            <Card key={role}>
              <CardHeader>
                <CardTitle>{role}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {permissionGroups.map((group) => (
                  <div key={group.title}>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {group.title}
                    </h3>
                    <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      {group.items.map((item) => (
                        <li key={item.permission} className="flex items-start justify-between gap-3">
                          <span>{item.label}</span>
                          <span
                            className={
                              permissions.includes(item.permission)
                                ? 'text-green-600 font-medium'
                                : 'text-slate-400'
                            }
                          >
                            {permissions.includes(item.permission) ? 'Allowed' : 'No access'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
