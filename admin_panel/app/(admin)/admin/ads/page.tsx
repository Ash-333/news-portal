'use client'

import { useState, useCallback } from 'react'
import { Plus, Trash2, Upload, Edit, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/ui/page-header'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { useAds, useCreateAd, useToggleAdActive, useDeleteAd, useUpdateAd } from '@/hooks/use-ads'
import { Advertisement } from '@/types'

const positions = [
  { value: 'SIDEBAR', label: 'Sidebar' },
  { value: 'BANNER', label: 'Banner' },
  { value: 'IN_ARTICLE', label: 'In Article' },
  { value: 'SIDEBAR_TOP', label: 'Sidebar Top' },
  { value: 'SIDEBAR_BOTTOM', label: 'Sidebar Bottom' },
  { value: 'HOME_MIDDLE', label: 'Home Middle' },
  { value: 'HOME_TOP', label: 'Home Top' },
  { value: 'TOP_BAR', label: 'Top Bar' },
  { value: 'ARTICLE_DETAIL', label: 'Article Detail' },
  { value: 'ARTICLE_TITLE', label: 'Article Title' },
  { value: 'ARTICLE_EXCERPT', label: 'Article Excerpt' },
  { value: 'ARTICLE_END', label: 'Article End' },
  { value: 'FEATURED_1', label: 'Featured 1' },
  { value: 'FEATURED_2', label: 'Featured 2' },
  { value: 'FEATURED_3', label: 'Featured 3' },
  { value: 'LATEST_NEWS', label: 'Latest News' },
  { value: 'CATEGORY_SECTION', label: 'Category Section' },
  { value: 'SECTION_SIDEBAR', label: 'Section Sidebar' },
]

export default function AdsPage() {
  const [showForm, setShowForm] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null)
  const [formData, setFormData] = useState({ titleNe: '', titleEn: '', linkUrl: '', position: 'SIDEBAR' })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const { data, isLoading } = useAds()
  const createAd = useCreateAd()
  const updateAd = useUpdateAd()
  const toggleActive = useToggleAdActive()
  const deleteAd = useDeleteAd()

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }, [])

  const handleCreate = async () => {
    if (!formData.titleEn || !formData.titleNe || !selectedFile) {
      toast.error('Please fill title fields and select an image/GIF')
      return
    }
    const fd = new FormData()
    fd.append('file', selectedFile)
    fd.append('titleNe', formData.titleNe)
    fd.append('titleEn', formData.titleEn)
    fd.append('linkUrl', formData.linkUrl)
    fd.append('position', formData.position)

    createAd.mutate(fd, {
      onSuccess: () => {
        toast.success('Ad created successfully')
        setShowForm(false)
        setFormData({ titleNe: '', titleEn: '', linkUrl: '', position: 'SIDEBAR' })
        setSelectedFile(null)
        setPreviewUrl(null)
      },
      onError: (error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create ad'
        toast.error(errorMessage)
      },
    })
  }

  const handleEdit = (ad: Advertisement) => {
    setEditingAd(ad)
    setFormData({
      titleNe: ad.titleNe,
      titleEn: ad.titleEn,
      linkUrl: ad.linkUrl || '',
      position: ad.position,
    })
    setPreviewUrl(ad.mediaUrl)
    setSelectedFile(null)
  }

  const handleUpdate = async () => {
    if (!editingAd || !formData.titleEn || !formData.titleNe) {
      toast.error('Please fill title fields')
      return
    }
    
    const fd = new FormData()
    fd.append('titleNe', formData.titleNe)
    fd.append('titleEn', formData.titleEn)
    fd.append('linkUrl', formData.linkUrl)
    fd.append('position', formData.position)
    if (selectedFile) {
      fd.append('file', selectedFile)
    }

    updateAd.mutate({ id: editingAd.id, data: fd }, {
      onSuccess: () => {
        toast.success('Ad updated successfully')
        setEditingAd(null)
        setFormData({ titleNe: '', titleEn: '', linkUrl: '', position: 'SIDEBAR' })
        setSelectedFile(null)
        setPreviewUrl(null)
      },
      onError: (error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update ad'
        toast.error(errorMessage)
      },
    })
  }

  const cancelEdit = () => {
    setEditingAd(null)
    setFormData({ titleNe: '', titleEn: '', linkUrl: '', position: 'SIDEBAR' })
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  const ads = data?.data ?? []

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ad Management"
        description="Manage advertisements (images & GIFs)"
        actions={
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Ad
          </Button>
        }
      />

      {/* Create Form */}
      {showForm && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Create New Advertisement</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Title (English)</label>
                <Input
                  value={formData.titleEn}
                  onChange={(e) => setFormData(p => ({ ...p, titleEn: e.target.value }))}
                  placeholder="Ad title in English"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Title (Nepali)</label>
                <Input
                  value={formData.titleNe}
                  onChange={(e) => setFormData(p => ({ ...p, titleNe: e.target.value }))}
                  placeholder="Ad title in Nepali"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Click Link URL (optional)</label>
                <Input
                  value={formData.linkUrl}
                  onChange={(e) => setFormData(p => ({ ...p, linkUrl: e.target.value }))}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Position</label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData(p => ({ ...p, position: e.target.value }))}
                  className="mt-1 w-full p-2 border rounded-md bg-background"
                >
                  {positions.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Upload Image / GIF</label>
              <div className="mt-1 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4 text-center">
                <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <Input
                  type="file"
                  accept="image/*,.gif"
                  onChange={handleFileChange}
                  className="hidden"
                  id="ad-upload"
                />
                <Button asChild size="sm">
                  <label htmlFor="ad-upload" className="cursor-pointer">
                    {selectedFile ? selectedFile.name : 'Select Image or GIF'}
                  </label>
                </Button>
              </div>
            </div>
            {previewUrl && (
              <div>
                <p className="text-sm text-slate-500 mb-1">Preview:</p>
                <img src={previewUrl} alt="Ad preview" className="max-w-xs rounded-lg border" />
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={createAd.isPending}>
                {createAd.isPending ? 'Creating...' : 'Create Ad'}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Form */}
      {editingAd && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Edit Advertisement</h3>
              <Button variant="ghost" size="sm" onClick={cancelEdit}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Title (English)</label>
                <Input
                  value={formData.titleEn}
                  onChange={(e) => setFormData(p => ({ ...p, titleEn: e.target.value }))}
                  placeholder="Ad title in English"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Title (Nepali)</label>
                <Input
                  value={formData.titleNe}
                  onChange={(e) => setFormData(p => ({ ...p, titleNe: e.target.value }))}
                  placeholder="Ad title in Nepali"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Click Link URL (optional)</label>
                <Input
                  value={formData.linkUrl}
                  onChange={(e) => setFormData(p => ({ ...p, linkUrl: e.target.value }))}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Position</label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData(p => ({ ...p, position: e.target.value }))}
                  className="mt-1 w-full p-2 border rounded-md bg-background"
                >
                  {positions.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Upload New Image / GIF (optional - leave empty to keep existing)</label>
              <div className="mt-1 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4 text-center">
                <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <Input
                  type="file"
                  accept="image/*,.gif"
                  onChange={handleFileChange}
                  className="hidden"
                  id="ad-edit-upload"
                />
                <Button asChild size="sm">
                  <label htmlFor="ad-edit-upload" className="cursor-pointer">
                    {selectedFile ? selectedFile.name : 'Select New Image or GIF'}
                  </label>
                </Button>
              </div>
            </div>
            {previewUrl && (
              <div>
                <p className="text-sm text-slate-500 mb-1">Preview:</p>
                <img src={previewUrl} alt="Ad preview" className="max-w-xs rounded-lg border" />
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={handleUpdate} disabled={updateAd.isPending}>
                {updateAd.isPending ? 'Updating...' : 'Update Ad'}
              </Button>
              <Button variant="outline" onClick={cancelEdit}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ads Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : ads.length === 0 ? (
        <EmptyState title="No advertisements" description="Create your first ad to get started." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ads.map((ad) => (
            <Card key={ad.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-video bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                  <img src={ad.mediaUrl} alt={ad.titleEn} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <p className="font-medium text-sm truncate">{ad.titleEn}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${ad.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {ad.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs text-slate-400 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">{ad.position}</span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    <Switch
                      checked={ad.isActive}
                      onCheckedChange={(checked) => toggleActive.mutate({ id: ad.id, isActive: checked }, {
                        onSuccess: () => toast.success(checked ? 'Activated' : 'Deactivated'),
                        onError: (error) => console.error('Toggle error:', error),
                      })}
                    />
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(ad)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteId(ad.id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteAd.mutate(deleteId, {
          onSuccess: () => { toast.success('Ad deleted'); setDeleteId(null) },
          onError: (error: unknown) => {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete ad'
            toast.error(errorMessage)
          },
        })}
        title="Delete Advertisement"
        description="Are you sure you want to delete this advertisement?"
        confirmText="Delete"
        variant="danger"
        isLoading={deleteAd.isPending}
      />
    </div>
  )
}
