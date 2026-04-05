'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  FileText,
  Image,
  Tag,
  FolderTree,
  Users,
  BarChart3,
  ClipboardList,
  Settings,
  Menu,
  X,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Globe,
  Newspaper,
  Video,
  Megaphone,
  Zap,
  Vote,
  Sparkles, // for Horoscope
  Headphones  // for Audio News
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { RoleBadge } from '@/components/ui/role-badge'
import { getPermissionsForRole, hasPermission, permissions, type Permission } from '@/lib/permissions'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Role } from '@prisma/client'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  permission?: Permission
  children?: NavItem[]
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, permission: permissions.dashboardView },
  {
    label: 'Articles',
    href: '/admin/articles',
    icon: FileText,
    permission: permissions.articlesView,
    children: [
      { label: 'All Articles', href: '/admin/articles', icon: FileText, permission: permissions.articlesView },
      { label: 'Add New', href: '/admin/articles/new', icon: FileText, permission: permissions.articlesCreate },
      { label: 'Pending Review', href: '/admin/articles?status=REVIEW', icon: FileText, permission: permissions.articlesReview },
    ]
  },
  { label: 'Media Manager', href: '/admin/media', icon: Image, permission: permissions.mediaView },
  { label: 'Categories', href: '/admin/categories', icon: FolderTree, permission: permissions.categoriesView },
  { label: 'Tags', href: '/admin/tags', icon: Tag, permission: permissions.categoriesView },
  { label: 'Videos', href: '/admin/videos', icon: Video, permission: permissions.videosView },
  { label: 'Ads', href: '/admin/ads', icon: Megaphone, permission: permissions.adsView },
  {
    label: '24hrs Updates',
    href: '/admin/flash-updates',
    icon: Zap,
    permission: permissions.flashUpdatesView,
    children: [
      { label: 'All Updates', href: '/admin/flash-updates', icon: Zap, permission: permissions.flashUpdatesView },
      { label: 'Add New', href: '/admin/flash-updates/new', icon: Zap, permission: permissions.flashUpdatesCreate },
    ]
  },
  { label: 'Polls', href: '/admin/polls', icon: Vote, permission: permissions.pollsView },
  { label: 'Horoscopes', href: '/admin/horoscopes', icon: Sparkles, permission: permissions.videosView },
  { label: 'Audio News', href: '/admin/audio-news', icon: Headphones, permission: permissions.videosView },
  {
    label: 'Users',
    href: '/admin/users',
    icon: Users,
    permission: permissions.usersView,
    children: [
      { label: 'All Users', href: '/admin/users', icon: Users, permission: permissions.usersView },
      { label: 'Create User', href: '/admin/users/create', icon: Users, permission: permissions.usersCreate },
      { label: 'Roles & Permissions', href: '/admin/users/roles', icon: Users, permission: permissions.userRolesManage },
    ]
  },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3, permission: permissions.analyticsView },
  { label: 'Audit Logs', href: '/admin/audit-logs', icon: ClipboardList, permission: permissions.auditView },
  { label: 'Settings', href: '/admin/settings', icon: Settings, permission: permissions.settingsManage },
]

function Sidebar({
  isOpen,
  onClose,
  userRole
}: {
  isOpen: boolean
  onClose: () => void
  userRole: Role
}) {
  const pathname = usePathname()
  const userPermissions = getPermissionsForRole(userRole)

  const filteredNavItems = navItems
    .map((item) => ({
      ...item,
      children: item.children?.filter((child) =>
        !child.permission || userPermissions.includes(child.permission)
      ),
    }))
    .filter((item) => {
      if (item.permission && !userPermissions.includes(item.permission)) {
        return false
      }

      return !item.children || item.children.length > 0 || !item.children
    })

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-transform duration-200 lg:translate-x-0',
        !isOpen && '-translate-x-full'
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-200 dark:border-slate-800">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Newspaper className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-slate-900 dark:text-slate-100">News Portal</h1>
            <p className="text-xs text-slate-500">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-4rem)]">
          {filteredNavItems.map((item) => {
            const isActive = pathname ? (pathname === item.href || pathname.startsWith(item.href + '/')) : false
            const Icon = item.icon

            return (
              <div key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>

                {item.children && isActive && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onClose}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                          pathname ? pathname === child.href : false
                            ? 'text-blue-700 dark:text-blue-400 font-medium'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        )}
                      >
                        <child.icon className="w-4 h-4" />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

function TopNavbar({
  onMenuClick,
  onLanguageToggle,
  language
}: {
  onMenuClick: () => void
  onLanguageToggle: () => void
  language: 'ne' | 'en'
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleLogout = async () => {
    // Sign out using NextAuth
    const response = await fetch('/api/auth/signout', { method: 'POST' })
    if (response.ok) {
      router.push('/login')
    }
  }

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-30 h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 hidden sm:block">
            Dashboard
          </h2>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onLanguageToggle}
            className="gap-2"
          >
            <Globe className="w-4 h-4" />
            {language === 'en' ? 'English' : 'नेपाली'}
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </Button>

          {/* User menu */}
          {status === 'authenticated' && session?.user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                    {session.user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline">{session.user.name}</span>
                  <RoleBadge role={session.user.role as Role} />
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{session.user.name}</p>
                  <p className="text-xs text-slate-500">{session.user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/admin/profile')}>
                  <User className="w-4 h-4 mr-2" />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/admin/change-password')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Change Password
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [language, setLanguage] = useState<'ne' | 'en'>('en')
  const { data: session, status } = useSession()
  const router = useRouter()

  // Redirect to login if not authenticated
  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  const userRole = (session?.user?.role as Role) || Role.AUTHOR

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userRole={userRole}
      />

      <TopNavbar
        onMenuClick={() => setSidebarOpen(true)}
        onLanguageToggle={() => setLanguage(prev => prev === 'en' ? 'ne' : 'en')}
        language={language}
      />

      <main className="pt-16 lg:pl-64">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
