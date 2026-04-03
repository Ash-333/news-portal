'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { PageHeader } from '@/components/ui/page-header'
import { toast } from 'sonner'

const pollSchema = z.object({
  questionEn: z.string().min(1, 'English question is required'),
  questionNe: z.string().min(1, 'Nepali question is required'),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  isMultiple: z.boolean().default(false),
  startsAt: z.string().optional(),
  expiresAt: z.string().optional(),
  // Options are validated manually since they're in separate state
  options: z.array(z.object({
    textEn: z.string(),
    textNe: z.string(),
  })).optional(),
})

type PollFormData = z.infer<typeof pollSchema>

interface Option {
  id: string
  textEn: string
  textNe: string
}

export default function NewPollPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [options, setOptions] = useState<Option[]>([
    { id: '1', textEn: '', textNe: '' },
    { id: '2', textEn: '', textNe: '' },
  ])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PollFormData>({
    resolver: zodResolver(pollSchema),
    defaultValues: {
      isActive: true,
      isMultiple: false,
      options: [],
    },
  })

  const isActive = watch('isActive')
  const isMultiple = watch('isMultiple')

  const addOption = () => {
    setOptions([...options, { id: Date.now().toString(), textEn: '', textNe: '' }])
  }

  const removeOption = (id: string) => {
    if (options.length <= 2) {
      toast.error('At least 2 options are required')
      return
    }
    setOptions(options.filter(opt => opt.id !== id))
  }

  const updateOption = (id: string, field: 'textEn' | 'textNe', value: string) => {
    setOptions(options.map(opt => 
      opt.id === id ? { ...opt, [field]: value } : opt
    ))
  }

  const onSubmit = async (data: PollFormData) => {
    // Validate options manually since they're in separate state
    if (options.length < 2) {
      toast.error('At least 2 options are required')
      return
    }
    
    // Check if all options have text
    const hasEmptyOption = options.some(opt => !opt.textEn.trim() || !opt.textNe.trim())
    if (hasEmptyOption) {
      toast.error('All options must have text in both languages')
      return
    }

    setIsSubmitting(true)
    try {
      // Convert datetime-local format to ISO format with timezone
      const formatDateTime = (dateStr: string) => {
        if (!dateStr) return undefined
        // datetime-local gives "2026-03-25T12:14", convert to ISO with Z
        return new Date(dateStr).toISOString()
      }

      const response = await fetch('/api/admin/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          startsAt: formatDateTime(data.startsAt || ''),
          expiresAt: formatDateTime(data.expiresAt || ''),
          options: options.map(opt => ({
            textEn: opt.textEn,
            textNe: opt.textNe,
          })),
        }),
      })
      const result = await response.json()
      
      if (result.success) {
        toast.success('Poll created successfully')
        router.push('/admin/polls')
      } else {
        const errorMessage = result.message || 'Failed to create poll'
        toast.error(errorMessage)
      }
    } catch (error) {
      toast.error('Failed to create poll')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Poll"
        description="Create a new poll for user engagement"
        actions={
          <Button variant="outline" onClick={() => router.push('/admin/polls')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Polls
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Poll Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Poll Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="questionEn">Question (English) *</Label>
                  <Input
                    id="questionEn"
                    {...register('questionEn')}
                    placeholder="Enter question in English"
                    className="mt-1"
                  />
                  {errors.questionEn && (
                    <p className="text-sm text-red-600 mt-1">{errors.questionEn.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="questionNe">Question (Nepali) *</Label>
                  <Input
                    id="questionNe"
                    {...register('questionNe')}
                    placeholder="Enter question in Nepali"
                    className="mt-1"
                    dir="ltr"
                  />
                  {errors.questionNe && (
                    <p className="text-sm text-red-600 mt-1">{errors.questionNe.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Add a description for this poll"
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Poll Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {options.map((option, index) => (
                  <div key={option.id} className="flex gap-4 items-start">
                    <div className="flex-1 space-y-2">
                      <Input
                        value={option.textEn}
                        onChange={(e) => updateOption(option.id, 'textEn', e.target.value)}
                        placeholder={`Option ${index + 1} (English)`}
                      />
                      <Input
                        value={option.textNe}
                        onChange={(e) => updateOption(option.id, 'textNe', e.target.value)}
                        placeholder={`Option ${index + 1} (Nepali)`}
                        dir="ltr"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(option.id)}
                      disabled={options.length <= 2}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
                {errors.options && (
                  <p className="text-sm text-red-600">{errors.options.message}</p>
                )}
                <Button type="button" variant="outline" onClick={addOption}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Option
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Poll Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isActive">Active</Label>
                    <p className="text-sm text-slate-500">Make poll visible to users</p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={isActive}
                    onCheckedChange={(checked) => setValue('isActive', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isMultiple">Multiple Choices</Label>
                    <p className="text-sm text-slate-500">Allow users to select multiple options</p>
                  </div>
                  <Switch
                    id="isMultiple"
                    checked={isMultiple}
                    onCheckedChange={(checked) => setValue('isMultiple', checked)}
                  />
                </div>

                <div className="pt-4 border-t">
                  <Label htmlFor="startsAt">Start Date (Optional)</Label>
                  <Input
                    id="startsAt"
                    type="datetime-local"
                    {...register('startsAt')}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="expiresAt">End Date (Optional)</Label>
                  <Input
                    id="expiresAt"
                    type="datetime-local"
                    {...register('expiresAt')}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Poll'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}