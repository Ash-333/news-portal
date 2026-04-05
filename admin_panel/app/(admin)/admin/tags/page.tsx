'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Tag } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageHeader } from '@/components/ui/page-header'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useTags, useCreateTag, useUpdateTag, useDeleteTag } from '@/hooks/use-tags'
import { toast } from 'sonner'
import type { Tag as TagType } from '@/types'

export default function TagsPage() {
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [formData, setFormData] = useState({ nameNe: '', nameEn: '', slug: '' })

  const { data: tags, isLoading } = useTags(search)
  const createTag = useCreateTag()
  const updateTag = useUpdateTag()
  const deleteTag = useDeleteTag()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateTag.mutateAsync({ id: editingId, data: formData })
        toast.success('Tag updated successfully')
      } else {
        await createTag.mutateAsync(formData)
        toast.success('Tag created successfully')
      }
      setIsCreating(false)
      setEditingId(null)
      setFormData({ nameNe: '', nameEn: '', slug: '' })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save tag'
      toast.error(errorMessage)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteTag.mutateAsync(deleteId)
      toast.success('Tag deleted successfully')
      setDeleteId(null)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete tag'
      toast.error(errorMessage)
    }
  }

  const startEdit = (tag: TagType) => {
    setEditingId(tag.id)
    setFormData({
      nameNe: tag.nameNe,
      nameEn: tag.nameEn,
      slug: tag.slug,
    })
    setIsCreating(true)
  }

  const cancelEdit = () => {
    setIsCreating(false)
    setEditingId(null)
    setFormData({ nameNe: '', nameEn: '', slug: '' })
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader title="Tags" description="Manage article tags" />

      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Input
            placeholder="Search tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Tag
          </Button>
        )}
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Tag' : 'Create New Tag'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nameEn">English Name</Label>
                  <Input
                    id="nameEn"
                    value={formData.nameEn}
                    onChange={(e) =>
                      setFormData({ ...formData, nameEn: e.target.value })
                    }
                    placeholder="Enter English name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nameNe">Nepali Name</Label>
                  <Input
                    id="nameNe"
                    value={formData.nameNe}
                    onChange={(e) =>
                      setFormData({ ...formData, nameNe: e.target.value })
                    }
                    placeholder="Enter Nepali name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="example-tag"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createTag.isPending || updateTag.isPending}>
                  {editingId ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tags List */}
      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left">English Name</th>
                <th className="px-4 py-3 text-left">Nepali Name</th>
                <th className="px-4 py-3 text-left">Slug</th>
                <th className="px-4 py-3 text-left">Articles</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center">
                    Loading...
                  </td>
                </tr>
              ) : tags?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center">
                    No tags found
                  </td>
                </tr>
              ) : (
                tags?.map((tag) => (
                  <tr key={tag.id} className="border-b">
                    <td className="px-4 py-3">{tag.nameEn}</td>
                    <td className="px-4 py-3">{tag.nameNe}</td>
                    <td className="px-4 py-3">{tag.slug}</td>
                    <td className="px-4 py-3">{(tag as any)._count?.articles || 0}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEdit(tag)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(tag.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Tag"
        description="Are you sure you want to delete this tag? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}