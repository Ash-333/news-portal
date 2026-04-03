'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { CommentStatus } from '@prisma/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { StatusBadge } from '@/components/ui/status-badge'
import { DataTable, Column } from '@/components/ui/data-table'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { SkeletonTable } from '@/components/ui/skeleton-table'
import { useComments, useDeleteComment } from '@/hooks/use-comments'
import { CommentWithRelations } from '@/types'
import { toast } from 'sonner'

const tabs = [
  { key: 'ALL', label: 'All' },
  { key: 'APPROVED', label: 'Approved' },
]

export default function CommentsPage() {
  const [activeTab, setActiveTab] = useState('ALL')
  const [actionComment, setActionComment] = useState<{ id: string; action: 'delete' } | null>(null)

  const status = activeTab === 'ALL' ? undefined : activeTab as CommentStatus
  const { data, isLoading } = useComments({ status, limit: 20 })
  const deleteComment = useDeleteComment()

  const handleAction = async () => {
    if (!actionComment) return

    try {
      await deleteComment.mutateAsync(actionComment.id)
      toast.success('Comment deleted successfully')
      setActionComment(null)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to perform action'
      toast.error(errorMessage)
    }
  }

  const columns: Column<CommentWithRelations>[] = [
    {
      key: 'content',
      header: 'Comment',
      render: (comment) => (
        <div>
          <p className="text-sm line-clamp-2">{comment.content}</p>
          <p className="text-xs text-slate-500 mt-1">
            on &quot;{comment.article?.titleEn}&quot;
          </p>
        </div>
      ),
    },
    {
      key: 'user',
      header: 'User',
      render: (comment) => comment.user?.name || 'Unknown',
    },
    {
      key: 'status',
      header: 'Status',
      render: (comment) => <StatusBadge status={comment.status} />,
    },
    {
      key: 'date',
      header: 'Date',
      render: (comment) => new Date(comment.createdAt).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (comment) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              setActionComment({ id: comment.id, action: 'delete' })
            }}
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Comments"
        description="Moderate user comments"
      />

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <SkeletonTable rows={5} cols={5} />
          ) : data?.data.length === 0 ? (
            <EmptyState
              title="No comments found"
              description="There are no comments in this category."
            />
          ) : (
            <DataTable
              columns={columns}
              data={data?.data || []}
              keyExtractor={(comment) => comment.id}
            />
          )}
        </CardContent>
      </Card>

      {/* Action Confirmation */}
      <ConfirmDialog
        isOpen={!!actionComment}
        onClose={() => setActionComment(null)}
        onConfirm={handleAction}
        title={
          actionComment?.action === 'delete'
            ? 'Delete Comment'
            : `${actionComment?.action === 'approve' ? 'Approve' : actionComment?.action === 'reject' ? 'Reject' : 'Mark as Spam'} Comment`
        }
        description="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        isLoading={deleteComment.isPending}
      />
    </div>
  )
}
