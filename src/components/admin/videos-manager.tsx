'use client'

import { useMemo, useState } from 'react'
import { deleteVideo, loadVideos, saveVideo } from '@/app/admin/actions'
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
import type { AdminVideo } from '@/types/admin'

interface VideoDraft {
  id: string | null
  title: string
  description: string
  category: string
  videoUrl: string
  duration: string
  authorName: string
  authorRole: string
  tags: string
  published: boolean
}

const blank: VideoDraft = {
  id: null,
  title: '',
  description: '',
  category: '',
  videoUrl: '',
  duration: '',
  authorName: '',
  authorRole: '',
  tags: '',
  published: true,
}

function toDraft(video: AdminVideo): VideoDraft {
  return {
    id: video.id,
    title: video.title,
    description: video.description,
    category: video.category,
    videoUrl: video.video_url,
    duration: video.duration,
    authorName: video.author_name,
    authorRole: video.author_role,
    tags: (video.tags || []).join(', '),
    published: video.published,
  }
}

export function VideosManager() {
  const { rows, loading, error, banner, setBanner, refresh } = useAdminList(loadVideos)
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState<VideoDraft | null>(null)
  const [pendingDelete, setPendingDelete] = useState<AdminVideo[]>([])
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return rows
    return rows.filter((video) => `${video.title} ${video.category} ${video.author_name}`.toLowerCase().includes(needle))
  }, [rows, query])

  async function onSave(event: React.FormEvent) {
    event.preventDefault()
    if (!draft) return
    setSaving(true)
    setFormError(null)
    const result = await saveVideo({ ...draft, tags: draft.tags.split(',') })
    setSaving(false)
    if (!result.ok) {
      setFormError(result.error || 'Could not save the video.')
      return
    }
    setDraft(null)
    setBanner('Video saved')
    await refresh()
  }

  async function onDelete() {
    if (pendingDelete.length === 0) return
    const count = pendingDelete.length
    setSaving(true)
    const failed = await deleteSelected(
      pendingDelete,
      (video) => deleteVideo(video.id),
      'Could not delete the video.',
    )
    setSaving(false)
    setPendingDelete([])
    if (failed) setFormError(failed)
    else setBanner(count === 1 ? 'Video deleted' : `${count} videos deleted`)
    await refresh()
  }

  return (
    <div>
      <PageHeader
        title="Videos"
        description="Expert videos. Paste a YouTube link and the public page can play it. Drafts stay hidden."
        action={<PrimaryButton onClick={() => { setFormError(null); setDraft(blank) }}>Add video</PrimaryButton>}
      />
      <SavedBanner message={banner} />
      <ErrorNote message={error || (!draft ? formError : null)} />
      <SearchField value={query} onChange={setQuery} placeholder="Search videos..." />
      {loading ? (
        <AdminSpinner label="Loading videos..." />
      ) : (
        <AdminTable
          rows={visible}
          rowKey={(video) => video.id}
          itemLabel="video"
          resetKey={query}
          emptyLabel={rows.length === 0 ? 'No videos yet.' : 'No videos match this search.'}
          onEdit={(video) => { setFormError(null); setDraft(toDraft(video)) }}
          onDelete={setPendingDelete}
          columns={[
            {
              id: 'title',
              header: 'Title',
              sortValue: (video) => video.title,
              filterValue: (video) => video.title,
              cell: (video) => <span className="font-bold">{video.title}</span>,
            },
            {
              id: 'category',
              header: 'Category',
              sortValue: (video) => video.category || '',
              filterValue: (video) => video.category || '',
              cell: (video) => video.category || '—',
            },
            {
              id: 'duration',
              header: 'Duration',
              sortValue: (video) => video.duration || '',
              filterValue: (video) => video.duration || '',
              cell: (video) => video.duration || '—',
            },
            {
              id: 'status',
              header: 'Status',
              sortValue: (video) => (video.published ? 'Published' : 'Draft'),
              filterValue: (video) => (video.published ? 'Published' : 'Draft'),
              cell: (video) => <PublishedBadge published={video.published} />,
            },
          ]}
        />
      )}

      {draft && (
        <AdminDialog title={draft.id ? 'Edit video' : 'Add video'} onClose={() => setDraft(null)}>
          <form onSubmit={onSave} className="space-y-3">
            <ErrorNote message={formError} />
            <TextField label="Title" required value={draft.title} onChange={(title) => setDraft({ ...draft, title })} />
            <TextField label="YouTube or video URL" value={draft.videoUrl} onChange={(videoUrl) => setDraft({ ...draft, videoUrl })} />
            <div className="grid gap-3 sm:grid-cols-2">
              <TextField label="Category" value={draft.category} onChange={(category) => setDraft({ ...draft, category })} />
              <TextField label="Duration" value={draft.duration} onChange={(duration) => setDraft({ ...draft, duration })} />
              <TextField label="Author" value={draft.authorName} onChange={(authorName) => setDraft({ ...draft, authorName })} />
              <TextField label="Role" value={draft.authorRole} onChange={(authorRole) => setDraft({ ...draft, authorRole })} />
            </div>
            <TextField label="Tags" value={draft.tags} onChange={(tags) => setDraft({ ...draft, tags })} />
            <AreaField label="Description" value={draft.description} onChange={(description) => setDraft({ ...draft, description })} rows={4} />
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
              <PrimaryButton type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save video'}</PrimaryButton>
            </div>
          </form>
        </AdminDialog>
      )}

      {pendingDelete.length > 0 && (
        <AdminDialog
          title={pendingDelete.length === 1 ? 'Delete video?' : `Delete ${pendingDelete.length} videos?`}
          onClose={() => setPendingDelete([])}
        >
          <p className="text-sm text-neutral-700">
            {pendingDelete.length === 1
              ? `${pendingDelete[0].title} will be removed from the videos page.`
              : `${pendingDelete.length} videos will be removed from the videos page.`}
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
