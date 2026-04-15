'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Filter, MoreHorizontal, Edit, Eye, Trash2, Star, Zap, X } from 'lucide-react'
import { ArticleStatus } from '@prisma/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { PageHeader } from '@/components/ui/page-header'
import { StatusBadge } from '@/components/ui/status-badge'
import { DataTable, Column } from '@/components/ui/data-table'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { SkeletonTable } from '@/components/ui/skeleton-table'
import { useArticles, useDeleteArticle, useUpdateArticleStatus } from '@/hooks/use-articles'
import { useCategories } from '@/hooks/use-categories'
import { usePermissions } from '@/hooks/use-permissions'
import { permissions } from '@/lib/permissions'
import { ArticleWithRelations, CategoryWithChildren } from '@/types'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { toast } from 'sonner'

const tabs = [
  { key: 'ALL', label: 'All' },
  { key: 'DRAFT', label: 'Draft' },
  { key: 'REVIEW', label: 'Review' },
  { key: 'APPROVED', label: 'Approved' },
  { key: 'PUBLISHED', label: 'Published' },
  { key: 'ARCHIVED', label: 'Archived' },
]

export default function ArticlesPage() {
  const router = useRouter()
  const { hasPermission } = usePermissions()
  const [activeTab, setActiveTab] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  
  const status = activeTab === 'ALL' ? undefined : activeTab as ArticleStatus
  const { data, isLoading, refetch } = useArticles({ 
    status, 
    search: searchQuery || undefined,
    categoryId: categoryFilter || undefined
  })
  const { data: categories } = useCategories()
  const deleteArticle = useDeleteArticle()
  const updateStatus = useUpdateArticleStatus()
  const canReviewArticles = hasPermission(permissions.articlesReview)

  // Flatten categories for dropdown
  const flattenCategories = (cats: CategoryWithChildren[], prefix = ''): { id: string; name: string }[] => {
    let result: { id: string; name: string }[] = []
    for (const cat of cats) {
      result.push({ id: cat.id, name: prefix + (cat.nameEn || cat.nameNe) })
      if (cat.children && cat.children.length > 0) {
        result = result.concat(flattenCategories(cat.children as CategoryWithChildren[], prefix + '— '))
      }
    }
    return result
  }
  const flatCategories = categories ? flattenCategories(categories) : []

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteArticle.mutateAsync(deleteId)
      toast.success('Article deleted successfully')
      setDeleteId(null)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete article'
      toast.error(errorMessage)
    }
  }

  const handlePublish = async (id: string) => {
    try {
      await updateStatus.mutateAsync({ id, status: ArticleStatus.PUBLISHED })
      toast.success('Article published successfully')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to publish article'
      toast.error(errorMessage)
    }
  }

  const columns: Column<ArticleWithRelations>[] = [
    {
      key: 'title',
      header: 'Title',
      render: (article) => (
        <div>
          <p className="font-medium">{article.titleEn}</p>
          {article.isBreaking && (
            <span className="text-xs text-red-600 font-medium">Breaking News</span>
          )}
        </div>
      ),
    },
    {
      key: 'author',
      header: 'Author',
      render: (article) => article.author?.name || '-',
    },
    {
      key: 'category',
      header: 'Category',
      render: (article) => article.category?.nameEn || '-',
    },
    {
      key: 'status',
      header: 'Status',
      render: (article) => <StatusBadge status={article.status} />,
    },
    {
      key: 'publishedAt',
      header: 'Published',
      render: (article) => article.publishedAt 
        ? new Date(article.publishedAt).toLocaleDateString() 
        : '-',
    },
    {
      key: 'views',
      header: 'Views',
      render: (article) => article.viewCount.toLocaleString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (article) => (
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(`/admin/articles/${article.id}/edit`)
                }}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit article</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(`/articles/${article.slug}?preview=true`, '_blank')
                }}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Preview article</TooltipContent>
          </Tooltip>
          {canReviewArticles && article.status !== ArticleStatus.PUBLISHED && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePublish(article.id)
                  }}
                >
                  <Zap className="w-4 h-4 text-green-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Publish article</TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  setDeleteId(article.id)
                }}
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete article</TooltipContent>
          </Tooltip>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Articles"
        description="Manage your news articles"
        actions={
          <Button onClick={() => router.push('/admin/articles/new')}>
            <Plus className="w-4 h-4 mr-2" />
            New Article
          </Button>
        }
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

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select
            options={[{ value: '', label: 'All Categories' }, ...flatCategories.map((c) => ({ value: c.id, label: c.name }))]}
            value={categoryFilter}
            onChange={setCategoryFilter}
            className="min-w-[180px]"
          />
          {categoryFilter && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCategoryFilter('')}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <SkeletonTable rows={5} cols={7} />
          ) : data?.data.length === 0 ? (
            <EmptyState
              title="No articles found"
              description="Get started by creating your first article."
              action={{
                label: 'Create Article',
                onClick: () => router.push('/admin/articles/new'),
              }}
            />
          ) : (
            <DataTable
              columns={columns}
              data={data?.data || []}
              keyExtractor={(article) => article.id}
              onRowClick={(article) => router.push(`/admin/articles/${article.id}/edit`)}
            />
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Article"
        description="Are you sure you want to delete this article? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        isLoading={deleteArticle.isPending}
      />
    </div>
  )
}
