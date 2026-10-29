'use client'

import { useMemo, useState } from 'react'
import { deletePost, loadPosts, savePost } from '@/app/admin/actions'
import {
  AdminDialog,
  AdminSpinner,
  AdminTable,
  AreaField,
  deleteSelected,
  ErrorNote,
  PageHeader,
  PrimaryButton,
  PublishedBadge,
  SavedBanner,
  SearchField,
  SecondaryButton,
  TextField,
} from '@/components/admin/ui'
import { useAdminList } from '@/components/admin/use-admin-list'
import type { AdminPost } from '@/types/admin'

interface PostDraft {
  id: string | null
  title: string
  excerpt: string
  body: string
  category: string
  authorName: string
  authorRole: string
  tags: string
  readTime: string
  published: boolean
}

const blank: PostDraft = {
  id: null,
  title: '',
  excerpt: '',
  body: '',
  category: '',
  authorName: '',
  authorRole: '',
  tags: '',
  readTime: '',
  published: true,
}

function toDraft(post: AdminPost): PostDraft {
  return {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    body: post.body,
    category: post.category,
    authorName: post.author_name,
    authorRole: post.author_role,
    tags: (post.tags || []).join(', '),
    readTime: post.read_time,
    published: post.published,
  }
}

export function PostsManager() {
  const { rows, loading, error, banner, setBanner, refresh } = useAdminList(loadPosts)
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState<PostDraft | null>(null)
  const [pendingDelete, setPendingDelete] = useState<AdminPost[]>([])
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return rows
    return rows.filter((post) => `${post.title} ${post.category} ${post.author_name}`.toLowerCase().includes(needle))
  }, [rows, query])

  async function onSave(event: React.FormEvent) {
    event.preventDefault()
    if (!draft) return
    setSaving(true)
    setFormError(null)
    const result = await savePost({
      ...draft,
      tags: draft.tags.split(','),
    })
    setSaving(false)
    if (!result.ok) {
      setFormError(result.error || 'Could not save the post.')
      return
    }
    setDraft(null)
    setBanner('Post saved')
    await refresh()
  }

  async function onDelete() {
    if (pendingDelete.length === 0) return
    const count = pendingDelete.length
    setSaving(true)
    const failed = await deleteSelected(
      pendingDelete,
      (post) => deletePost(post.id),
      'Could not delete the post.',
    )
    setSaving(false)
    setPendingDelete([])
    if (failed) setFormError(failed)
    else setBanner(count === 1 ? 'Post deleted' : `${count} posts deleted`)
    await refresh()
  }

  return (
    <div>
      <PageHeader
        title="Blog"
        description="Articles on the Expert Blog. Drafts stay off the public page until you publish them."
        action={<PrimaryButton onClick={() => { setFormError(null); setDraft(blank) }}>Add post</PrimaryButton>}
      />
      <SavedBanner message={banner} />
      <ErrorNote message={error || (!draft ? formError : null)} />
      <SearchField value={query} onChange={setQuery} placeholder="Search posts..." />
      {loading ? (
        <AdminSpinner label="Loading posts..." />
      ) : (
        <AdminTable
          rows={visible}
          rowKey={(post) => post.id}
          itemLabel="post"
          resetKey={query}
          emptyLabel={rows.length === 0 ? 'No posts yet.' : 'No posts match this search.'}
          onEdit={(post) => { setFormError(null); setDraft(toDraft(post)) }}
          onDelete={setPendingDelete}
          columns={[
            {
              id: 'title',
              header: 'Title',
              sortValue: (post) => post.title,
              filterValue: (post) => post.title,
              cell: (post) => <span className="font-bold">{post.title}</span>,
            },
            {
              id: 'category',
              header: 'Category',
              sortValue: (post) => post.category || '',
              filterValue: (post) => post.category || '',
              cell: (post) => post.category || '—',
            },
            {
              id: 'author',
              header: 'Author',
              sortValue: (post) => post.author_name || '',
              filterValue: (post) => post.author_name || '',
              cell: (post) => post.author_name || '—',
            },
            {
              id: 'status',
              header: 'Status',
              sortValue: (post) => (post.published ? 'Published' : 'Draft'),
              filterValue: (post) => (post.published ? 'Published' : 'Draft'),
              cell: (post) => <PublishedBadge published={post.published} />,
            },
          ]}
        />
      )}

      {draft && (
        <AdminDialog title={draft.id ? 'Edit post' : 'Add post'} onClose={() => setDraft(null)}>
          <form onSubmit={onSave} className="space-y-3">
            <ErrorNote message={formError} />
            <TextField label="Title" required value={draft.title} onChange={(title) => setDraft({ ...draft, title })} />
            <div className="grid gap-3 sm:grid-cols-2">
              <TextField label="Category" value={draft.category} onChange={(category) => setDraft({ ...draft, category })} />
              <TextField label="Read time" value={draft.readTime} onChange={(readTime) => setDraft({ ...draft, readTime })} />
              <TextField label="Author" value={draft.authorName} onChange={(authorName) => setDraft({ ...draft, authorName })} />
              <TextField label="Role" value={draft.authorRole} onChange={(authorRole) => setDraft({ ...draft, authorRole })} />
            </div>
            <TextField label="Tags" value={draft.tags} onChange={(tags) => setDraft({ ...draft, tags })} />
            <AreaField label="Excerpt" value={draft.excerpt} onChange={(excerpt) => setDraft({ ...draft, excerpt })} rows={3} />
            <AreaField label="Body" value={draft.body} onChange={(body) => setDraft({ ...draft, body })} rows={8} />
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={draft.published}
                onChange={(event) => setDraft({ ...draft, published: event.target.checked })}
                className="h-4 w-4 accent-red-500"
              />
              Published
            </label>
            <div className="flex justify-end gap-2">
              <SecondaryButton onClick={() => setDraft(null)}>Cancel</SecondaryButton>
              <PrimaryButton type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save post'}</PrimaryButton>
            </div>
          </form>
        </AdminDialog>
      )}

      {pendingDelete.length > 0 && (
        <AdminDialog
          title={pendingDelete.length === 1 ? 'Delete post?' : `Delete ${pendingDelete.length} posts?`}
          onClose={() => setPendingDelete([])}
        >
          <p className="text-sm text-neutral-700">
            {pendingDelete.length === 1
              ? `${pendingDelete[0].title} will be removed from the blog.`
              : `${pendingDelete.length} posts will be removed from the blog.`}
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
