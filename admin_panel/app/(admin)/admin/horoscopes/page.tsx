'use client'

import { useState } from 'react'
import { Plus, Search, Trash2, Eye, EyeOff } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PageHeader } from '@/components/ui/page-header'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { DynamicIcon } from '@/components/ui/dynamic-icon'
import { toast } from 'sonner'
import {
  useHoroscopes,
  useCreateHoroscope,
  useDeleteHoroscope,
  useTogglePublishHoroscope,
  ZODIAC_SIGNS,
  getZodiacIcon
} from '@/hooks/use-horoscopes'

export default function HoroscopesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedZodiac, setSelectedZodiac] = useState<string>('')
  const [formData, setFormData] = useState({
    zodiacSign: '',
    icon: 'Sparkles',
    titleNe: '',
    titleEn: '',
    contentNe: '',
    contentEn: '',
    isPublished: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data, isLoading } = useHoroscopes({ search: searchQuery || undefined, zodiacSign: selectedZodiac || undefined })
  const createMutation = useCreateHoroscope()
  const deleteMutation = useDeleteHoroscope()
  const togglePublish = useTogglePublishHoroscope()

  const handleCreate = async () => {
    if (!formData.zodiacSign || !formData.titleEn || !formData.titleNe || !formData.contentEn || !formData.contentNe) {
      toast.error('Please fill all required fields')
      return
    }
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/admin/horoscopes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const result = await response.json()
      if (result.success) {
        toast.success('Horoscope created successfully')
        setShowForm(false)
        setFormData({ zodiacSign: '', icon: 'Sparkles', titleNe: '', titleEn: '', contentNe: '', contentEn: '', isPublished: false })
      } else {
        const errorMessage = result.message || 'Failed to create horoscope'
        toast.error(errorMessage)
      }
    } catch {
      toast.error('Failed to create horoscope')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingId || !formData.zodiacSign || !formData.titleEn || !formData.titleNe || !formData.contentEn || !formData.contentNe) {
      toast.error('Please fill all required fields')
      return
    }
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/admin/horoscopes/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const result = await response.json()
      if (result.success) {
        toast.success('Horoscope updated successfully')
        setShowForm(false)
        setEditingId(null)
        setFormData({ zodiacSign: '', icon: 'Sparkles', titleNe: '', titleEn: '', contentNe: '', contentEn: '', isPublished: false })
      } else {
        const errorMessage = result.message || 'Failed to update horoscope'
        toast.error(errorMessage)
      }
    } catch {
      toast.error('Failed to update horoscope')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (horoscope: any) => {
    setFormData({
      zodiacSign: horoscope.zodiacSign,
      icon: horoscope.icon || getZodiacIcon(horoscope.zodiacSign),
      titleNe: horoscope.titleNe,
      titleEn: horoscope.titleEn,
      contentNe: horoscope.contentNe,
      contentEn: horoscope.contentEn,
      isPublished: horoscope.isPublished
    })
    setEditingId(horoscope.id)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({ zodiacSign: '', icon: 'Sparkles', titleNe: '', titleEn: '', contentNe: '', contentEn: '', isPublished: false })
  }

  const horoscopes = data?.data ?? []

  return (
    <div className="space-y-6">
      <PageHeader
        title="Horoscopes"
        description="Manage daily horoscopes for all zodiac signs"
        actions={
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Horoscope
          </Button>
        }
      />

      {/* Create/Edit Form */}
      {showForm && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">{editingId ? 'Edit Horoscope' : 'Add New Horoscope'}</h3>
            <div>
              <label className="text-sm font-medium">Zodiac Sign *</label>
              <select
                value={formData.zodiacSign}
                onChange={(e) => {
                  const selectedSign = ZODIAC_SIGNS.find(s => s.value === e.target.value)
                  setFormData(p => ({ ...p, zodiacSign: e.target.value, icon: selectedSign?.icon || 'Sparkles' }))
                }}
                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select zodiac sign</option>
                {ZODIAC_SIGNS.map((sign) => (
                  <option key={sign.value} value={sign.value}>
                    {sign.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Icon</label>
              <div className="flex items-center gap-2 mt-1">
                <DynamicIcon name={formData.icon} className="w-6 h-6 text-purple-500" />
                <span className="text-sm text-slate-500">{formData.icon}</span>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Title (English) *</label>
                <Input
                  value={formData.titleEn}
                  onChange={(e) => setFormData(p => ({ ...p, titleEn: e.target.value }))}
                  placeholder="Enter title in English"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Title (Nepali) *</label>
                <Input
                  value={formData.titleNe}
                  onChange={(e) => setFormData(p => ({ ...p, titleNe: e.target.value }))}
                  placeholder="Enter title in Nepali"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Content (English) *</label>
              <Textarea
                value={formData.contentEn}
                onChange={(e) => setFormData(p => ({ ...p, contentEn: e.target.value }))}
                placeholder="Enter horoscope content in English"
                className="mt-1"
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Content (Nepali) *</label>
              <Textarea
                value={formData.contentNe}
                onChange={(e) => setFormData(p => ({ ...p, contentNe: e.target.value }))}
                placeholder="Enter horoscope content in Nepali"
                className="mt-1"
                rows={4}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData(p => ({ ...p, isPublished: e.target.checked }))}
                className="w-4 h-4"
              />
              <label htmlFor="isPublished" className="text-sm font-medium">Publish immediately</label>
            </div>
            <div className="flex gap-2">
              <Button onClick={editingId ? handleUpdate : handleCreate} disabled={isSubmitting}>
                {isSubmitting ? (editingId ? 'Updating...' : 'Creating...') : (editingId ? 'Update Horoscope' : 'Create Horoscope')}
              </Button>
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search horoscopes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedZodiac}
          onChange={(e) => setSelectedZodiac(e.target.value)}
          className="flex h-10 w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">All Signs</option>
          {ZODIAC_SIGNS.map((sign) => (
            <option key={sign.value} value={sign.value}>
              {sign.label}
            </option>
          ))}
        </select>
      </div>

      {/* Horoscopes List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4 mb-2" />
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : horoscopes.length === 0 ? (
        <EmptyState title="No horoscopes yet" description="Add your first horoscope to get started." />
      ) : (
        <div className="space-y-4">
          {horoscopes.map((horoscope) => (
            <Card key={horoscope.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <DynamicIcon name={horoscope.icon || getZodiacIcon(horoscope.zodiacSign)} className="w-6 h-6 text-purple-500" />
                      <span className="text-sm font-medium text-slate-500 uppercase">{horoscope.zodiacSign}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${horoscope.isPublished ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}>
                        {horoscope.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <h3 className="font-semibold">{horoscope.titleEn}</h3>
                    <p className="text-sm text-slate-500 mb-2">{horoscope.titleNe}</p>
                    <p className="text-sm text-slate-600 line-clamp-2">{horoscope.contentEn}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(horoscope.date).toLocaleDateString()} | by {horoscope.author?.name}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(horoscope)}>
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePublish.mutate({ id: horoscope.id, isPublished: !horoscope.isPublished }, {
                        onSuccess: () => toast.success(horoscope.isPublished ? 'Unpublished' : 'Published'),
                      })}
                    >
                      {horoscope.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteId(horoscope.id)}>
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
        onConfirm={() => {
          if (deleteId) {
            deleteMutation.mutate(deleteId, {
              onSuccess: () => { toast.success('Horoscope deleted'); setDeleteId(null) },
              onError: (error: unknown) => {
                const errorMessage = error instanceof Error ? error.message : 'Failed to delete horoscope'
                toast.error(errorMessage)
              },
            })
          }
        }}
        title="Delete Horoscope"
        description="Are you sure you want to delete this horoscope? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}