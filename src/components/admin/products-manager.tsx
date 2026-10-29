'use client'

import { useMemo, useState } from 'react'
import { addVariant, deleteProduct, deleteVariant, loadProducts, saveProduct } from '@/app/admin/actions'
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
import type { AdminProduct, ProductVariant } from '@/types/admin'

interface ProductDraft {
  baseProductId: number | null
  productName: string
  productType: string
  productNote: string
  brandName: string
  variants: ProductVariant[]
}

const emptyVariant = { colorName: '', size: '', thicknessMm: '', thicknessIn: '' }

function matches(product: AdminProduct, query: string) {
  const haystack = [product.product_name, product.product_type, product.brand_name || ''].join(' ').toLowerCase()
  return haystack.includes(query.trim().toLowerCase())
}

export function ProductsManager() {
  const { rows, setRows, loading, error, banner, setBanner, refresh } = useAdminList(loadProducts)
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState<ProductDraft | null>(null)
  const [variant, setVariant] = useState(emptyVariant)
  const [pendingDelete, setPendingDelete] = useState<AdminProduct[]>([])
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const visible = useMemo(
    () => rows.filter((product) => matches(product, query)),
    [rows, query],
  )

  function openNew() {
    setFormError(null)
    setVariant(emptyVariant)
    setDraft({
      baseProductId: null,
      productName: '',
      productType: '',
      productNote: '',
      brandName: '',
      variants: [],
    })
  }

  function openEdit(product: AdminProduct) {
    setFormError(null)
    setVariant(emptyVariant)
    setDraft({
      baseProductId: product.base_product_id,
      productName: product.product_name,
      productType: product.product_type,
      productNote: product.product_note,
      brandName: product.brand_name || '',
      variants: product.variants || [],
    })
  }

  async function onSave(event: React.FormEvent) {
    event.preventDefault()
    if (!draft) return
    setSaving(true)
    setFormError(null)
    const result = await saveProduct(draft)
    setSaving(false)
    if (!result.ok) {
      setFormError(result.error || 'Could not save the product.')
      return
    }
    setDraft(null)
    setBanner('Product saved')
    await refresh()
  }

  async function onAddVariant() {
    if (!draft?.baseProductId) return
    setSaving(true)
    setFormError(null)
    const result = await addVariant({ baseProductId: draft.baseProductId, ...variant })
    if (!result.ok) {
      setSaving(false)
      setFormError(result.error || 'Could not add that variant.')
      return
    }
    const reloaded = await loadProducts()
    setSaving(false)
    setVariant(emptyVariant)
    if (reloaded.ok && reloaded.data) {
      setRows(reloaded.data)
      const current = reloaded.data.find((product) => product.base_product_id === draft.baseProductId)
      if (current) {
        setDraft((open) => open ? { ...open, variants: current.variants || [] } : open)
      }
    }
    setBanner('Color and size added')
  }

  async function onDeleteVariant(id: number) {
    if (!draft) return
    setSaving(true)
    const result = await deleteVariant(id)
    setSaving(false)
    if (!result.ok) {
      setFormError(result.error || 'Could not remove that variant.')
      return
    }
    setDraft({ ...draft, variants: draft.variants.filter((item) => item.variant_id !== id) })
    setBanner('Variant removed')
    await refresh()
  }

  async function onDelete() {
    if (pendingDelete.length === 0) return
    const count = pendingDelete.length
    setSaving(true)
    const failed = await deleteSelected(
      pendingDelete,
      (product) => deleteProduct(product.base_product_id),
      'Could not delete the product.',
    )
    setSaving(false)
    setPendingDelete([])
    if (failed) {
      setBanner(null)
      setFormError(failed)
    } else {
      setBanner(count === 1 ? 'Product deleted' : `${count} products deleted`)
    }
    await refresh()
  }

  return (
    <div>
      <PageHeader
        title="Products"
        description="Names, brands, and notes shown in the catalog. Colors and sizes are added after the product is saved."
        action={<PrimaryButton onClick={openNew}>Add product</PrimaryButton>}
      />
      <SavedBanner message={banner} />
      <ErrorNote message={error || (!draft ? formError : null)} />
      <SearchField value={query} onChange={setQuery} placeholder="Search products..." />
      {loading ? (
        <AdminSpinner label="Loading products..." />
      ) : (
        <AdminTable
          rows={visible}
          rowKey={(product) => String(product.base_product_id)}
          itemLabel="product"
          resetKey={query}
          emptyLabel={rows.length === 0 ? 'No products yet.' : 'No products match this search.'}
          onEdit={openEdit}
          onDelete={setPendingDelete}
          columns={[
            {
              id: 'name',
              header: 'Product',
              sortValue: (product) => product.product_name,
              filterValue: (product) => product.product_name,
              cell: (product) => <span className="font-bold">{product.product_name}</span>,
            },
            {
              id: 'brand',
              header: 'Brand',
              sortValue: (product) => product.brand_name || '',
              filterValue: (product) => product.brand_name || '',
              cell: (product) => product.brand_name || '—',
            },
            {
              id: 'type',
              header: 'Type',
              sortValue: (product) => product.product_type || '',
              filterValue: (product) => product.product_type || '',
              cell: (product) => product.product_type || '—',
            },
            {
              id: 'variants',
              header: 'Variants',
              sortValue: (product) => product.variants?.length ?? 0,
              filterValue: (product) => String(product.variants?.length ?? 0),
              cell: (product) => product.variants?.length ?? 0,
            },
          ]}
        />
      )}

      {draft && (
        <AdminDialog title={draft.baseProductId ? 'Edit product' : 'Add product'} onClose={() => setDraft(null)}>
          <form onSubmit={onSave} className="space-y-3">
            <ErrorNote message={formError} />
            <TextField label="Name" required value={draft.productName} onChange={(productName) => setDraft({ ...draft, productName })} />
            <div className="grid gap-3 sm:grid-cols-2">
              <TextField label="Brand" value={draft.brandName} onChange={(brandName) => setDraft({ ...draft, brandName })} />
              <TextField label="Type" value={draft.productType} onChange={(productType) => setDraft({ ...draft, productType })} />
            </div>
            <AreaField label="Note" value={draft.productNote} onChange={(productNote) => setDraft({ ...draft, productNote })} rows={3} />
            <div className="flex justify-end gap-2">
              <SecondaryButton onClick={() => setDraft(null)}>Cancel</SecondaryButton>
              <PrimaryButton type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save product'}</PrimaryButton>
            </div>
          </form>

          {draft.baseProductId && (
            <div className="mt-6 border-t border-neutral-200 pt-4">
              <h3 className="font-bold">Colors and sizes</h3>
              <ul className="mt-2 space-y-1 text-sm">
                {draft.variants.length === 0 && <li className="text-neutral-500">No variants yet.</li>}
                {draft.variants.map((item) => (
                  <li key={item.variant_id} className="flex items-center justify-between gap-2">
                    <span>
                      {[item.color_name, item.size, item.thickness_mm && item.thickness_in ? `${item.thickness_mm} mm / ${item.thickness_in} in` : ''].filter(Boolean).join(' · ') || 'Variant'}
                    </span>
                    <button type="button" onClick={() => onDeleteVariant(item.variant_id)} className="font-bold text-red-600">
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <TextField label="Color" value={variant.colorName} onChange={(colorName) => setVariant({ ...variant, colorName })} />
                <TextField label="Size" value={variant.size} onChange={(size) => setVariant({ ...variant, size })} />
                <TextField label="Thickness mm" value={variant.thicknessMm} onChange={(thicknessMm) => setVariant({ ...variant, thicknessMm })} />
                <TextField label="Thickness in" value={variant.thicknessIn} onChange={(thicknessIn) => setVariant({ ...variant, thicknessIn })} />
              </div>
              <div className="mt-3">
                <SecondaryButton disabled={saving} onClick={onAddVariant}>Add variant</SecondaryButton>
              </div>
            </div>
          )}
        </AdminDialog>
      )}

      {pendingDelete.length > 0 && (
        <AdminDialog
          title={pendingDelete.length === 1 ? 'Delete product?' : `Delete ${pendingDelete.length} products?`}
          onClose={() => setPendingDelete([])}
        >
          <p className="text-sm text-neutral-700">
            {pendingDelete.length === 1
              ? `${pendingDelete[0].product_name} and its colors and sizes will be removed from the catalog.`
              : `${pendingDelete.length} products and their colors and sizes will be removed from the catalog.`}
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
