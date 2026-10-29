'use client'

import { useMemo, useState } from 'react'
import { deleteSupplier, loadSuppliers, saveSupplier } from '@/app/admin/actions'
import {
  AdminDialog,
  AdminSpinner,
  AdminTable,
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
import type { AdminSupplier, SupplierBranch } from '@/types/admin'

interface SupplierDraft {
  id: string | null
  supplierName: string
  websiteUrl: string
  branches: SupplierBranch[]
}

function blankBranch(): SupplierBranch {
  return {
    id: '',
    branch_name: '',
    cross_street: '',
    phone: '',
    address: '',
    is_main_branch: false,
  }
}

export function SuppliersManager() {
  const { rows, loading, error, banner, setBanner, refresh } = useAdminList(loadSuppliers)
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState<SupplierDraft | null>(null)
  const [pendingDelete, setPendingDelete] = useState<AdminSupplier[]>([])
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return rows
    return rows.filter((supplier) => {
      const branches = supplier.branches.map((branch) => `${branch.branch_name} ${branch.address} ${branch.cross_street}`).join(' ')
      return `${supplier.supplier_name} ${branches}`.toLowerCase().includes(needle)
    })
  }, [rows, query])

  function openEdit(supplier: AdminSupplier) {
    setFormError(null)
    setDraft({
      id: supplier.id,
      supplierName: supplier.supplier_name,
      websiteUrl: supplier.websites?.[0]?.website_url || '',
      branches: supplier.branches?.length ? supplier.branches : [blankBranch()],
    })
  }

  function updateBranch(index: number, patch: Partial<SupplierBranch>) {
    if (!draft) return
    setDraft({
      ...draft,
      branches: draft.branches.map((branch, branchIndex) => {
        if (branchIndex !== index) {
          return patch.is_main_branch ? { ...branch, is_main_branch: false } : branch
        }
        return { ...branch, ...patch }
      }),
    })
  }

  async function onSave(event: React.FormEvent) {
    event.preventDefault()
    if (!draft) return
    setSaving(true)
    setFormError(null)
    const result = await saveSupplier(draft)
    setSaving(false)
    if (!result.ok) {
      setFormError(result.error || 'Could not save the supplier.')
      return
    }
    setDraft(null)
    setBanner('Supplier saved')
    await refresh()
  }

  async function onDelete() {
    if (pendingDelete.length === 0) return
    const count = pendingDelete.length
    setSaving(true)
    const failed = await deleteSelected(
      pendingDelete,
      (supplier) => deleteSupplier(supplier.id),
      'Could not delete the supplier.',
    )
    setSaving(false)
    setPendingDelete([])
    if (failed) setFormError(failed)
    else setBanner(count === 1 ? 'Supplier deleted' : `${count} suppliers deleted`)
    await refresh()
  }

  return (
    <div>
      <PageHeader
        title="Suppliers"
        description="Supplier names, websites, and the branches shown on the map and list."
        action={<PrimaryButton onClick={() => { setFormError(null); setDraft({ id: null, supplierName: '', websiteUrl: '', branches: [blankBranch()] }) }}>Add supplier</PrimaryButton>}
      />
      <SavedBanner message={banner} />
      <ErrorNote message={error || (!draft ? formError : null)} />
      <SearchField value={query} onChange={setQuery} placeholder="Search suppliers..." />
      {loading ? (
        <AdminSpinner label="Loading suppliers..." />
      ) : (
        <AdminTable
          rows={visible}
          rowKey={(supplier) => supplier.id}
          itemLabel="supplier"
          resetKey={query}
          emptyLabel={rows.length === 0 ? 'No suppliers yet.' : 'No suppliers match this search.'}
          onEdit={openEdit}
          onDelete={setPendingDelete}
          columns={[
            {
              id: 'name',
              header: 'Supplier',
              sortValue: (supplier) => supplier.supplier_name,
              filterValue: (supplier) => supplier.supplier_name,
              cell: (supplier) => <span className="font-bold">{supplier.supplier_name}</span>,
            },
            {
              id: 'branches',
              header: 'Branches',
              sortValue: (supplier) => supplier.branches?.length ?? 0,
              filterValue: (supplier) => String(supplier.branches?.length ?? 0),
              cell: (supplier) => supplier.branches?.length ?? 0,
            },
            {
              id: 'website',
              header: 'Website',
              sortValue: (supplier) => supplier.websites?.[0]?.website_url || '',
              filterValue: (supplier) => supplier.websites?.[0]?.website_url || '',
              cell: (supplier) => supplier.websites?.[0]?.website_url || '—',
            },
          ]}
        />
      )}

      {draft && (
        <AdminDialog title={draft.id ? 'Edit supplier' : 'Add supplier'} onClose={() => setDraft(null)}>
          <form onSubmit={onSave} className="space-y-3">
            <ErrorNote message={formError} />
            <TextField label="Supplier name" required value={draft.supplierName} onChange={(supplierName) => setDraft({ ...draft, supplierName })} />
            <TextField label="Website" value={draft.websiteUrl} onChange={(websiteUrl) => setDraft({ ...draft, websiteUrl })} />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">Branches</h3>
                <SecondaryButton onClick={() => setDraft({ ...draft, branches: [...draft.branches, blankBranch()] })}>
                  Add branch
                </SecondaryButton>
              </div>
              {draft.branches.map((branch, index) => (
                <div key={`${branch.id || 'new'}-${index}`} className="space-y-2 rounded-md border-2 border-black p-3">
                  <TextField label="Branch name" value={branch.branch_name} onChange={(branch_name) => updateBranch(index, { branch_name })} />
                  <TextField label="Cross street" value={branch.cross_street} onChange={(cross_street) => updateBranch(index, { cross_street })} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <TextField label="Phone" value={branch.phone} onChange={(phone) => updateBranch(index, { phone })} />
                    <TextField label="Address" value={branch.address} onChange={(address) => updateBranch(index, { address })} />
                  </div>
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={branch.is_main_branch}
                      onChange={(event) => updateBranch(index, { is_main_branch: event.target.checked })}
                      className="h-4 w-4 accent-red-500"
                    />
                    Main branch
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <SecondaryButton onClick={() => setDraft(null)}>Cancel</SecondaryButton>
              <PrimaryButton type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save supplier'}</PrimaryButton>
            </div>
          </form>
        </AdminDialog>
      )}

      {pendingDelete.length > 0 && (
        <AdminDialog
          title={pendingDelete.length === 1 ? 'Delete supplier?' : `Delete ${pendingDelete.length} suppliers?`}
          onClose={() => setPendingDelete([])}
        >
          <p className="text-sm text-neutral-700">
            {pendingDelete.length === 1
              ? `${pendingDelete[0].supplier_name} and its branches will be removed.`
              : `${pendingDelete.length} suppliers and their branches will be removed.`}
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
