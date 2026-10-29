'use client'

import { useMemo, useState } from 'react'
import { deleteService, loadServices, saveService } from '@/app/admin/actions'
import { supabase } from '@/lib/supabaseClient'
import {
  AdminDialog,
  AdminSpinner,
  AdminTable,
  AreaField,
  deleteSelected,
  ErrorNote,
  PageHeader,
  PrimaryButton,
  SavedBanner,
  SearchField,
  SecondaryButton,
  TextField,
} from '@/components/admin/ui'
import { useAdminList } from '@/components/admin/use-admin-list'
import type { AdminService } from '@/types/admin'

interface ServiceDraft {
  id: string | null
  name: string
  description: string
  price: string
  link: string
  details: string
  image_url: string
}

const blank: ServiceDraft = { id: null, name: '', description: '', price: '', link: '', details: '', image_url: '' }

export function ServicesManager() {
  const { rows, loading, error, banner, setBanner, refresh } = useAdminList(loadServices)
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState<ServiceDraft | null>(null)
  const [pendingDelete, setPendingDelete] = useState<AdminService[]>([])
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return rows
    return rows.filter((service) => `${service.name} ${service.description} ${service.price}`.toLowerCase().includes(needle))
  }, [rows, query])

  async function onSave(event: React.FormEvent) {
    event.preventDefault()
    if (!draft) return
    setSaving(true)
    setFormError(null)
    const result = await saveService(draft)
    setSaving(false)
    if (!result.ok) {
      if (result.data?.id) setDraft({ ...draft, id: result.data.id })
      setFormError(result.error || 'Could not save the service.')
      return
    }
    setDraft(null)
    setBanner('Service saved')
    await refresh()
  }

  async function onDelete() {
    if (pendingDelete.length === 0) return
    const count = pendingDelete.length
    setSaving(true)
    const failed = await deleteSelected(
      pendingDelete,
      (service) => deleteService(service.id),
      'Could not delete the service.',
    )
    setSaving(false)
    setPendingDelete([])
    if (failed) setFormError(failed)
    else setBanner(count === 1 ? 'Service deleted' : `${count} services deleted`)
    await refresh()
  }

  async function onPickImage(file: File | undefined) {
    if (!file || !draft) return
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(file.type)) {
      setFormError('Use a JPEG, PNG, WebP, or GIF image.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image must be 5MB or smaller.')
      return
    }

    setUploading(true)
    setFormError(null)
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `${crypto.randomUUID()}.${extension}`
    const { error: uploadError } = await supabase.storage.from('service-images').upload(path, file, {
      cacheControl: '3600',
      contentType: file.type,
    })
    setUploading(false)
    if (uploadError) {
      const missingBucket = /bucket not found/i.test(uploadError.message)
      setFormError(
        missingBucket
          ? 'Run database/migrations/service-images.sql in the Supabase SQL editor, then upload the image again.'
          : uploadError.message,
      )
      return
    }

    const { data } = supabase.storage.from('service-images').getPublicUrl(path)
    setDraft({ ...draft, image_url: data.publicUrl })
  }

  return (
    <div>
      <PageHeader
        title="Services"
        description="Installation and repair services. The photo and price show on the services page."
        action={<PrimaryButton onClick={() => { setFormError(null); setDraft(blank) }}>Add service</PrimaryButton>}
      />
      <SavedBanner message={banner} />
      <ErrorNote message={error || formError} />
      <SearchField value={query} onChange={setQuery} placeholder="Search services..." />
      {loading ? (
        <AdminSpinner label="Loading services..." />
      ) : (
        <AdminTable
          rows={visible}
          rowKey={(service) => service.id}
          itemLabel="service"
          resetKey={query}
          emptyLabel={rows.length === 0 ? 'No services yet.' : 'No services match this search.'}
          onEdit={(service) => { setFormError(null); setDraft({ ...service, image_url: service.image_url || '' }) }}
          onDelete={setPendingDelete}
          columns={[
            {
              id: 'photo',
              header: 'Photo',
              className: 'w-24',
              sortValue: (service) => (service.image_url ? 1 : 0),
              filterValue: (service) => (service.image_url ? 'Has photo' : 'No photo'),
              cell: (service) => service.image_url ? (
                <img src={service.image_url} alt="" className="h-10 w-10 rounded object-cover" />
              ) : (
                <span className="inline-block h-10 w-10 rounded bg-neutral-100" />
              ),
            },
            {
              id: 'name',
              header: 'Service',
              sortValue: (service) => service.name,
              filterValue: (service) => service.name,
              cell: (service) => <span className="font-bold">{service.name}</span>,
            },
            {
              id: 'price',
              header: 'Price',
              sortValue: (service) => service.price || '',
              filterValue: (service) => service.price || '',
              cell: (service) => service.price || '—',
            },
            {
              id: 'description',
              header: 'Description',
              className: 'max-w-md',
              sortValue: (service) => service.description || '',
              cell: (service) => <span className="line-clamp-2">{service.description}</span>,
            },
          ]}
        />
      )}

      {draft && (
        <AdminDialog title={draft.id ? 'Edit service' : 'Add service'} onClose={() => setDraft(null)}>
          <form onSubmit={onSave} className="space-y-3">
            <ErrorNote message={formError} />
            <div>
              <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-neutral-600">Photo</span>
              <div className="overflow-hidden rounded-md border-2 border-red-500 bg-neutral-100">
                {draft.image_url ? (
                  <img src={draft.image_url} alt="" className="h-44 w-full object-cover" />
                ) : (
                  <div className="flex h-44 items-center justify-center text-sm text-neutral-500">No photo yet</div>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <label className="cursor-pointer rounded-md border-2 border-black bg-white px-4 py-2 text-sm font-bold text-black hover:border-red-500 hover:text-red-600">
                  {uploading ? 'Uploading...' : draft.image_url ? 'Replace photo' : 'Upload photo'}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    disabled={uploading}
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      event.target.value = ''
                      void onPickImage(file)
                    }}
                  />
                </label>
                {draft.image_url && (
                  <SecondaryButton onClick={() => setDraft({ ...draft, image_url: '' })}>Remove photo</SecondaryButton>
                )}
              </div>
            </div>
            <TextField label="Name" required value={draft.name} onChange={(name) => setDraft({ ...draft, name })} />
            <TextField label="Price" value={draft.price} onChange={(price) => setDraft({ ...draft, price })} />
            <TextField label="Link" value={draft.link} onChange={(link) => setDraft({ ...draft, link })} />
            <AreaField label="Description" value={draft.description} onChange={(description) => setDraft({ ...draft, description })} rows={3} />
            <AreaField label="Details" value={draft.details} onChange={(details) => setDraft({ ...draft, details })} rows={4} />
            <div className="flex justify-end gap-2">
              <SecondaryButton onClick={() => setDraft(null)}>Cancel</SecondaryButton>
              <PrimaryButton type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save service'}</PrimaryButton>
            </div>
          </form>
        </AdminDialog>
      )}

      {pendingDelete.length > 0 && (
        <AdminDialog
          title={pendingDelete.length === 1 ? 'Delete service?' : `Delete ${pendingDelete.length} services?`}
          onClose={() => setPendingDelete([])}
        >
          <p className="text-sm text-neutral-700">
            {pendingDelete.length === 1
              ? `${pendingDelete[0].name} will be removed from the services page.`
              : `${pendingDelete.length} services will be removed from the services page.`}
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <SecondaryButton onClick={() => setPendingDelete([])}>Cancel</SecondaryButton>
            <PrimaryButton disabled={saving} onClick={onDelete}>{saving ? 'Deleting...' : 'Delete'}</PrimaryButton>
          </div>
        </AdminDialog>
      )}
    </div>
  )
}
