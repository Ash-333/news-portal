'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, MoreHorizontal, Edit, Eye, Trash2, Image } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/ui/page-header'
import { DataTable, Column } from '@/components/ui/data-table'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { SkeletonTable } from '@/components/ui/skeleton-table'
import { usePhotoGalleries, useDeletePhotoGallery, usePublishPhotoGallery } from '@/hooks/use-photo-galleries'
import { usePermissions } from '@/hooks/use-permissions'
import { permissions } from '@/lib/permissions'
import { PhotoGalleryWithRelations } from '@/types'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { toast } from 'sonner'

export default function PhotoGalleriesPage() {
  const router = useRouter()
  const { hasPermission } = usePermissions()
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data, isLoading, refetch } = usePhotoGalleries({ search: searchQuery || undefined })
  const deleteMutation = useDeletePhotoGallery()
  const publishMutation = usePublishPhotoGallery()

  const galleries = data?.data ?? []

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteMutation.mutateAsync(deleteId)
      toast.success('Photo gallery deleted successfully')
      setDeleteId(null)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete photo gallery'
      toast.error(errorMessage)
    }
  }

  const handlePublish = async (id: string) => {
    try {
      await publishMutation.mutateAsync(id)
      toast.success('Photo gallery published successfully')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to publish photo gallery'
      toast.error(errorMessage)
    }
  }

  const columns: Column<PhotoGalleryWithRelations>[] = [
    {
      key: 'title',
      header: 'Title',
      render: (gallery) => (
        <div>
          <p className="font-medium">{gallery.titleEn}</p>
          {gallery.titleNe && (
            <p className="text-xs text-slate-500 truncate">{gallery.titleNe}</p>
          )}
        </div>
      ),
    },
    {
      key: 'photos',
      header: 'Photos',
      render: (gallery) => (
        <div className="flex items-center gap-2">
          <Image className="w-4 h-4 text-slate-400" />
          <span>{gallery._count?.photos || 0}</span>
        </div>
      ),
    },
    {
      key: 'coverImage',
      header: 'Cover',
      render: (gallery) => (
        gallery.coverImage?.url ? (
          <img
            src={gallery.coverImage.url}
            alt="Cover"
            className="w-12 h-12 object-cover rounded-md"
          />
        ) : (
          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center">
            <Image className="w-5 h-5 text-slate-400" />
          </div>
        )
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (gallery) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            gallery.isPublished
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
          }`}
        >
          {gallery.isPublished ? 'Published' : 'Draft'}
        </span>
      ),
    },
    {
      key: 'author',
      header: 'Author',
      render: (gallery) => gallery.author?.name || '-',
    },
    {
      key: 'updatedAt',
      header: 'Updated',
      render: (gallery) => new Date(gallery.updatedAt).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (gallery) => (
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(`/admin/photo-galleries/${gallery.id}/edit`)
                }}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit gallery</TooltipContent>
          </Tooltip>
          {!gallery.isPublished && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePublish(gallery.id)
                  }}
                >
                  <Eye className="w-4 h-4 text-green-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Publish gallery</TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  setDeleteId(gallery.id)
                }}
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete gallery</TooltipContent>
          </Tooltip>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Photo Galleries"
        description="Manage photo galleries"
        actions={
          <Button onClick={() => router.push('/admin/photo-galleries/new')}>
            <Plus className="w-4 h-4 mr-2" />
            New Gallery
          </Button>
        }
      />

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search galleries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <SkeletonTable rows={5} cols={6} />
          ) : galleries.length === 0 ? (
            <EmptyState
              title="No photo galleries found"
              description="Get started by creating your first photo gallery."
              action={{
                label: 'Create Gallery',
                onClick: () => router.push('/admin/photo-galleries/new'),
              }}
            />
          ) : (
            <DataTable
              columns={columns}
              data={galleries}
              keyExtractor={(gallery) => gallery.id}
              onRowClick={(gallery) => router.push(`/admin/photo-galleries/${gallery.id}/edit`)}
            />
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Photo Gallery"
        description="Are you sure you want to delete this photo gallery? This action cannot be undone and all photos in the gallery will be removed."
        confirmText="Delete"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
