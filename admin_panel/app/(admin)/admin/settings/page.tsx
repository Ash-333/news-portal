'use client'

import { useState } from 'react'
import { Save, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { PageHeader } from '@/components/ui/page-header'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [showClearCacheConfirm, setShowClearCacheConfirm] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('Settings saved successfully')
    setIsSaving(false)
  }

  const handleClearCache = async () => {
    try {
      const response = await fetch('/api/admin/cache/clear', { method: 'POST' })
      if (response.ok) {
        toast.success('Cache cleared successfully')
      } else {
        toast.error('Failed to clear cache')
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to clear cache'
      toast.error(errorMessage)
    }
    setShowClearCacheConfirm(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure system settings"
        actions={
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Site Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="siteName">Site Name</Label>
                <Input id="siteName" defaultValue="News Portal" />
              </div>
              <div>
                <Label htmlFor="siteLogo">Site Logo URL</Label>
                <Input id="siteLogo" placeholder="https://example.com/logo.png" />
              </div>
              <div>
                <Label htmlFor="favicon">Favicon URL</Label>
                <Input id="favicon" placeholder="https://example.com/favicon.ico" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="defaultLanguage">Default Language</Label>
                <select id="defaultLanguage" className="p-2 border rounded-md">
                  <option value="en">English</option>
                  <option value="ne">Nepali</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">SMTP Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input id="smtpHost" placeholder="smtp.gmail.com" />
              </div>
              <div>
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input id="smtpPort" type="number" placeholder="587" />
              </div>
              <div>
                <Label htmlFor="smtpUser">SMTP Username</Label>
                <Input id="smtpUser" placeholder="your-email@gmail.com" />
              </div>
              <div>
                <Label htmlFor="smtpPassword">SMTP Password</Label>
                <Input id="smtpPassword" type="password" />
              </div>
              <div>
                <Label htmlFor="smtpFrom">From Address</Label>
                <Input id="smtpFrom" placeholder="News Portal <noreply@example.com>" />
              </div>
              <Button variant="outline">Send Test Email</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Social Media Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="facebookUrl">Facebook URL</Label>
                <Input id="facebookUrl" placeholder="https://facebook.com/yourpage" />
              </div>
              <div>
                <Label htmlFor="twitterUrl">Twitter/X URL</Label>
                <Input id="twitterUrl" placeholder="https://twitter.com/yourhandle" />
              </div>
              <div>
                <Label htmlFor="youtubeUrl">YouTube URL</Label>
                <Input id="youtubeUrl" placeholder="https://youtube.com/yourchannel" />
              </div>
              <div>
                <Label htmlFor="instagramUrl">Instagram URL</Label>
                <Input id="instagramUrl" placeholder="https://instagram.com/yourhandle" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Comment Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoApprove">Auto-approve Comments</Label>
                  <p className="text-sm text-slate-500">Automatically approve comments without moderation</p>
                </div>
                <Switch id="autoApprove" />
              </div>
              <div>
                <Label htmlFor="bannedWords">Banned Words</Label>
                <Textarea
                  id="bannedWords"
                  placeholder="Enter banned words, one per line"
                  rows={5}
                />
                <p className="text-sm text-slate-500 mt-1">Comments containing these words will be automatically rejected</p>
              </div>
              <div>
                <Label htmlFor="maxReports">Max Reports Before Auto-hide</Label>
                <Input id="maxReports" type="number" defaultValue={5} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="force2FA">Force 2FA for Admins</Label>
                  <p className="text-sm text-slate-500">Require two-factor authentication for all admin users</p>
                </div>
                <Switch id="force2FA" />
              </div>
              <div>
                <Label htmlFor="ipWhitelist">IP Whitelist</Label>
                <Textarea
                  id="ipWhitelist"
                  placeholder="Enter allowed IP addresses, one per line"
                  rows={5}
                />
                <p className="text-sm text-slate-500 mt-1">Only these IPs can access the admin panel</p>
              </div>
              <div>
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input id="sessionTimeout" type="number" defaultValue={60} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="danger" className="space-y-4">
          <Card className="border-red-200 dark:border-red-900">
            <CardHeader>
              <CardTitle className="text-lg text-red-600 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div>
                  <h4 className="font-medium">Clear Cache</h4>
                  <p className="text-sm text-slate-500">Clear all cached data from Redis</p>
                </div>
                <Button variant="destructive" onClick={() => setShowClearCacheConfirm(true)}>
                  Clear Cache
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div>
                  <h4 className="font-medium">Export All Data</h4>
                  <p className="text-sm text-slate-500">Download a complete backup of your data</p>
                </div>
                <Button variant="destructive">Export Data</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Clear Cache Confirmation */}
      <ConfirmDialog
        isOpen={showClearCacheConfirm}
        onClose={() => setShowClearCacheConfirm(false)}
        onConfirm={handleClearCache}
        title="Clear Cache"
        description="Are you sure you want to clear all cached data? This may temporarily slow down the site."
        confirmText="Clear Cache"
        variant="danger"
      />
    </div>
  )
}
