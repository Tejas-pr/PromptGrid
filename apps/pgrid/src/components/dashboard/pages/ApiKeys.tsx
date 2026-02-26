import { useEffect, useState } from 'react'
import { useElysiaClient } from '@/providers/elysiaProvider'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Copy, Trash2, Eye, EyeOff, Plus, Loader2 } from 'lucide-react'

function ApiKeys() {
  const client = useElysiaClient()

  const [apiKeys, setApiKeys] = useState<any>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    id?: string
  }>({ isOpen: false })

  const [newKeyDialog, setNewKeyDialog] = useState<{
    isOpen: boolean
    key?: string
    name?: string
  }>({ isOpen: false })

  /* ---------------- Fetch API Keys ---------------- */
  useEffect(() => {
    fetchApiKeys()
  }, [])

  const fetchApiKeys = async () => {
    try {
      setIsLoading(true)
      const response = await client['api-keys'].get()
      setApiKeys(response.data?.apiKeys ?? [])
    } catch (error) {
      console.error('Failed to fetch API keys:', error)
    } finally {
      setIsLoading(false)
    }
  }

  /* ---------------- Create API Key ---------------- */
  const handleCreateApiKey = async () => {
    try {
      setIsCreating(true)

      const keyName = `Key-${new Date().toLocaleDateString()}`
      const response = await client['api-keys'].post({ name: keyName })

      const apiKey = response.data?.apiKey
      if (!apiKey) throw new Error('API key missing in response')

      setNewKeyDialog({
        isOpen: true,
        key: apiKey,
        name: keyName,
      })

      await fetchApiKeys()
    } catch (error) {
      console.error('Failed to create API key:', error)
    } finally {
      setIsCreating(false)
    }
  }

  /* ---------------- Toggle Visibility ---------------- */
  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  /* ---------------- Enable / Disable ---------------- */
  const handleToggleApiKey = async (id: string, disabled: boolean) => {
    try {
      await client['api-keys'].put({
        id,
        disable: !disabled,
      })
      await fetchApiKeys()
    } catch (error) {
      console.error('Failed to update API key:', error)
    }
  }

  /* ---------------- Delete API Key ---------------- */
  const handleDeleteApiKey = async () => {
    if (!deleteDialog.id) return

    try {
      await client['api-keys']({ id: deleteDialog.id }).delete()
      setDeleteDialog({ isOpen: false })
      await fetchApiKeys()
    } catch (error) {
      console.error('Failed to delete API key:', error)
    }
  }

  /* ---------------- Helpers ---------------- */
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const maskApiKey = (key?: string) => {
    if (!key) return '••••••••••••••••'
    return key.slice(0, 4) + '•'.repeat(Math.max(0, key.length - 8)) + key.slice(-4)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading API keys...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Keys</h1>
          <p className="text-muted-foreground mt-1">
            Manage your API keys to access our services
          </p>
        </div>

        <Button onClick={handleCreateApiKey} disabled={isCreating} className="gap-2">
          {isCreating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Create API Key
        </Button>
      </div>

      {/* API Keys List */}
      <div className="space-y-3">
        {apiKeys.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">
              No API keys yet. Create one to get started.
            </p>
            <Button onClick={handleCreateApiKey} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Create First API Key
            </Button>
          </Card>
        ) : (
          apiKeys.map((key: any) => (
            <Card key={key.id} className="p-4">
              <div className="flex justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{key.name}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        key.disabled
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {key.disabled ? 'Disabled' : 'Active'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                      {visibleKeys.has(key.id)
                        ? key.apiKey
                        : maskApiKey(key.apiKey)}
                    </code>

                    <button onClick={() => copyToClipboard(key.apiKey ?? '')}>
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    </button>

                    <button onClick={() => toggleKeyVisibility(key.id)}>
                      {visibleKeys.has(key.id) ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Created:{' '}
                    {key.createdAt
                      ? new Date(key.createdAt).toLocaleDateString()
                      : '—'}
                    {key.lastUsed &&
                      ` • Last used: ${new Date(key.lastUsed).toLocaleDateString()}`}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={key.disabled ? 'outline' : 'secondary'}
                    onClick={() => handleToggleApiKey(key.id, key.disabled)}
                  >
                    {key.disabled ? 'Enable' : 'Disable'}
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteDialog({ isOpen: true, id: key.id })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Delete Dialog */}
      <AlertDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) =>
          setDeleteDialog({ ...deleteDialog, isOpen: open })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete API Key?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteApiKey}
              className="bg-destructive"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* New Key Dialog */}
      <AlertDialog
        open={newKeyDialog.isOpen}
        onOpenChange={(open) =>
          setNewKeyDialog({ ...newKeyDialog, isOpen: open })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>API Key Created</AlertDialogTitle>
            <AlertDialogDescription>
              Save this key somewhere safe. You won’t see it again.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <code className="block bg-muted p-3 rounded font-mono overflow-x-auto">
            {newKeyDialog.key}
          </code>

          <div className="flex justify-end pt-4">
            <AlertDialogAction
              onClick={() => setNewKeyDialog({ isOpen: false })}
            >
              Done
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default ApiKeys