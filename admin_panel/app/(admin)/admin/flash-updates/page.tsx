'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Trash2, CheckCircle, XCircle, Edit, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/ui/page-header'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { toast } from 'sonner'
import { useFlashUpdates, useDeleteFlashUpdate } from '@/hooks/use-flash-updates'

export default function FlashUpdatesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data, isLoading } = useFlashUpdates({ search: searchQuery || undefined })
  const deleteMutation = useDeleteFlashUpdate()

  const updates = data?.data ?? []

  return (
    <div className="space-y-6">
      <PageHeader
        title="Flash Updates"
        description="Manage quick updates"
        actions={
          <Button onClick={() => router.push('/admin/flash-updates/new')}>
            <Plus className="w-4 h-4 mr-2" />
            New Update
          </Button>
        }
      />

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search updates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Updates List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3 mb-2" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : updates.length === 0 ? (
        <EmptyState title="No flash updates" description="Create your first update." />
      ) : (
        <div className="space-y-3">
          {updates.map((update) => (
            <Card key={update.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">{update.titleEn}</p>
                    {update.isPublished ? (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Live
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{update.titleNe}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-400">by {update.author?.name}</span>
                  </div>
                </div>
                <div className="flex gap-1 ml-4">
                  {update.slug && update.isPublished && (
                    <Button variant="ghost" size="sm" onClick={() => window.open(`/flash-updates/${update.slug}`, '_blank')}>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/flash-updates/${update.id}/edit`)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteId(update.id)}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId, {
          onSuccess: () => { toast.success('Flash update deleted'); setDeleteId(null) },
          onError: (error: unknown) => {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete flash update'
            toast.error(errorMessage)
          },
        })}
        title="Delete Flash Update"
        description="Are you sure you want to delete this flash update?"
        confirmText="Delete"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
