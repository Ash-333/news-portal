'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Folder } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageHeader } from '@/components/ui/page-header'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/use-categories'
import { usePermissions } from '@/hooks/use-permissions'
import { permissions } from '@/lib/permissions'
import { toast } from 'sonner'

export default function CategoriesPage() {
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ nameNe: '', nameEn: '', slug: '', parentId: '' })
  const { hasPermission } = usePermissions()
  const canManageCategories = hasPermission(permissions.categoriesManage)

  const { data: categories, isLoading } = useCategories()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateCategory.mutateAsync({ id: editingId, data: formData })
        toast.success('Category updated successfully')
      } else {
        await createCategory.mutateAsync(formData)
        toast.success('Category created successfully')
      }
      setIsCreating(false)
      setEditingId(null)
      setFormData({ nameNe: '', nameEn: '', slug: '', parentId: '' })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save category'
      toast.error(errorMessage)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteCategory.mutateAsync(deleteId)
      toast.success('Category deleted successfully')
      setDeleteId(null)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete category'
      toast.error(errorMessage)
    }
  }

  const startEdit = (category: { id: string; nameNe: string; nameEn: string; slug: string; parentId?: string | null }) => {
    setEditingId(category.id)
    setFormData({
      nameNe: category.nameNe,
      nameEn: category.nameEn,
      slug: category.slug,
      parentId: category.parentId || '',
    })
    setIsCreating(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories & Tags"
        description="Manage article categories and tags"
        actions={canManageCategories ? (
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        ) : null}
      />

      {/* Categories List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories?.map((category) => (
          <Card key={category.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Folder className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium">{category.nameEn}</p>
                    <p className="text-sm text-slate-500 font-nepali">{category.nameNe}</p>
                    <p className="text-xs text-slate-400">{category._count?.articles || 0} articles</p>
                  </div>
                </div>
                {canManageCategories && (
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => startEdit(category)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(category.id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Form */}
      {canManageCategories && isCreating && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{editingId ? 'Edit Category' : 'New Category'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="nameEn">Name (English)</Label>
                  <Input
                    id="nameEn"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="Category name in English"
                  />
                </div>
                <div>
                  <Label htmlFor="nameNe">Name (Nepali)</Label>
                  <Input
                    id="nameNe"
                    value={formData.nameNe}
                    onChange={(e) => setFormData({ ...formData, nameNe: e.target.value })}
                    placeholder="Category name in Nepali"
                    className="font-nepali"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="category-slug"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={createCategory.isPending || updateCategory.isPending}>
                  {editingId ? 'Update' : 'Create'}
                </Button>
                <Button type="button" variant="outline" onClick={() => {
                  setIsCreating(false)
                  setEditingId(null)
                  setFormData({ nameNe: '', nameEn: '', slug: '', parentId: '' })
                }}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation */}
      {canManageCategories && (
        <ConfirmDialog
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title="Delete Category"
          description="Are you sure you want to delete this category? This action cannot be undone."
          confirmText="Delete"
          variant="danger"
          isLoading={deleteCategory.isPending}
        />
      )}
    </div>
  )
}
