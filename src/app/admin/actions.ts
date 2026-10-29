'use server'

import { supabase } from '@/lib/supabaseClient'
import { createServerSupabase } from '@/lib/supabase/server'
import { callAdmin, asRpcBody, friendlyRpcError, isMissingAdminSchema } from '@/lib/admin/rpc'
import { clearAdminToken, readAdminToken, writeAdminToken } from '@/lib/admin/session'
import type {
  ActionResult,
  AdminGate,
  AdminPost,
  AdminProduct,
  AdminService,
  AdminSupplier,
  AdminVideo,
  DashboardData,
  SupplierBranch,
} from '@/types/admin'

function clip(value: string, max: number) {
  return value.trim().slice(0, max)
}

function tags(value: string[]) {
  return value.map((tag) => tag.trim()).filter(Boolean).slice(0, 12)
}

async function openSession(body: { token?: string; username?: string; display_name?: string }, remember: boolean) {
  if (!body.token || !body.username) {
    return { ok: false as const, error: 'Could not start a session.' }
  }
  await writeAdminToken(body.token, remember)
  return {
    ok: true as const,
    data: {
      username: body.username,
      displayName: body.display_name || body.username,
    },
  }
}

export async function getAdminGate(): Promise<AdminGate> {
  const server = await createServerSupabase()
  const { data: userData, error: userError } = await server.auth.getUser()
  if (userError || !userData.user) {
    return { ready: true, hasAdmin: true, user: null, access: 'signed-out' }
  }

  const synced = await server.rpc('sync_my_profile')
  if (synced.error) {
    if (isMissingAdminSchema(synced.error.message)) {
      return { ready: false, hasAdmin: false, user: null }
    }
    return {
      ready: true,
      hasAdmin: true,
      user: null,
      access: 'forbidden',
      gateError: friendlyRpcError(synced.error.message),
    }
  }

  const profile = asRpcBody(synced.data)
  if (!profile.ok || !profile.is_admin) {
    return { ready: true, hasAdmin: true, user: null, access: 'forbidden' }
  }

  return {
    ready: true,
    hasAdmin: true,
    access: 'ok',
    user: {
      username: profile.email || userData.user.email || 'admin',
      displayName: profile.display_name || profile.email || 'Admin',
    },
  }
}

export async function loginAction(input: {
  username: string
  password: string
  remember: boolean
}): Promise<ActionResult<{ username: string; displayName: string }>> {
  const { data, error } = await supabase.rpc('admin_login', {
    p_username: input.username.trim(),
    p_password: input.password,
    p_remember: input.remember,
  })

  if (error) return { ok: false, error: friendlyRpcError(error.message) }
  const body = asRpcBody(data)
  if (!body.ok) return { ok: false, error: body.error || 'Invalid username or password.' }
  return openSession(body, input.remember)
}

export async function bootstrapAction(input: {
  username: string
  displayName: string
  password: string
  confirmPassword: string
}): Promise<ActionResult<{ username: string; displayName: string }>> {
  if (input.password !== input.confirmPassword) {
    return { ok: false, error: 'Passwords do not match.' }
  }

  const { data, error } = await supabase.rpc('admin_bootstrap', {
    p_username: input.username.trim(),
    p_password: input.password,
    p_display_name: input.displayName.trim(),
  })

  if (error) return { ok: false, error: friendlyRpcError(error.message) }
  const body = asRpcBody(data)
  if (!body.ok) return { ok: false, error: body.error || 'Could not create the administrator.' }
  return openSession(body, false)
}

export async function logoutAction() {
  const token = await readAdminToken()
  if (token) {
    await supabase.rpc('admin_logout', { p_token: token })
  }
  await clearAdminToken()
}

export async function loadDashboard(): Promise<ActionResult<DashboardData>> {
  return callAdmin<DashboardData>('dashboard')
}

export async function loadProducts(): Promise<ActionResult<AdminProduct[]>> {
  return callAdmin<AdminProduct[]>('list_products')
}

export async function saveProduct(input: {
  baseProductId: number | null
  productName: string
  productType: string
  productNote: string
  brandName: string
}): Promise<ActionResult<{ id: number }>> {
  if (!clip(input.productName, 160)) {
    return { ok: false, error: 'Product name is required.' }
  }
  return callAdmin<{ id: number }>('save_product', {
    base_product_id: input.baseProductId ? String(input.baseProductId) : '',
    product_name: clip(input.productName, 160),
    product_type: clip(input.productType, 80),
    product_note: input.productNote.trim().slice(0, 2000),
    brand_name: clip(input.brandName, 120),
  })
}

export async function deleteProduct(id: number) {
  return callAdmin('delete_product', { id })
}

export async function addVariant(input: {
  baseProductId: number
  colorName: string
  size: string
  thicknessMm: string
  thicknessIn: string
}) {
  return callAdmin('add_variant', {
    base_product_id: input.baseProductId,
    color_name: clip(input.colorName, 80),
    size: clip(input.size, 80),
    thickness_mm: clip(input.thicknessMm, 20),
    thickness_in: clip(input.thicknessIn, 20),
  })
}

export async function deleteVariant(id: number) {
  return callAdmin('delete_variant', { id })
}

export async function loadServices(): Promise<ActionResult<AdminService[]>> {
  const result = await callAdmin<AdminService[]>('list_services')
  if (!result.ok || !result.data) return result

  const images = await supabase.from('services').select('id, image_url')
  if (images.error || !images.data) {
    return {
      ok: true,
      data: result.data.map((service) => ({ ...service, image_url: service.image_url || '' })),
    }
  }

  const byId = new Map(
    images.data.map((row) => [String(row.id), typeof row.image_url === 'string' ? row.image_url : '']),
  )
  return {
    ok: true,
    data: result.data.map((service) => ({ ...service, image_url: byId.get(service.id) || '' })),
  }
}

export async function saveService(input: {
  id: string | null
  name: string
  description: string
  price: string
  link: string
  details: string
  image_url: string
}) {
  if (!clip(input.name, 160)) return { ok: false, error: 'Service name is required.' }
  const imageUrl = clip(input.image_url, 1000)
  const saved = await callAdmin<{ id: string }>('save_service', {
    id: input.id ?? '',
    name: clip(input.name, 160),
    description: input.description.trim().slice(0, 2000),
    price: clip(input.price, 80),
    link: clip(input.link, 300),
    details: input.details.trim().slice(0, 4000),
    image_url: imageUrl,
  })
  if (!saved.ok) return saved

  const id = saved.data?.id || input.id
  if (!id) return saved

  const token = await readAdminToken()
  const image = await supabase.rpc('admin_set_service_image', {
    p_token: token,
    p_id: id,
    p_image_url: imageUrl,
  })
  if (image.error) {
    if (!imageUrl && isMissingAdminSchema(image.error.message)) return saved
    return {
      ok: false,
      error: isMissingAdminSchema(image.error.message)
        ? 'Run database/migrations/service-images.sql in the Supabase SQL editor, then save the service again.'
        : friendlyRpcError(image.error.message),
      data: { id },
    }
  }

  const body = asRpcBody(image.data)
  if (!body.ok) return { ok: false, error: body.error || 'Could not save the service image.', data: { id } }
  return saved
}

export async function deleteService(id: string) {
  return callAdmin('delete_service', { id })
}

export async function loadSuppliers(): Promise<ActionResult<AdminSupplier[]>> {
  return callAdmin<AdminSupplier[]>('list_suppliers')
}

export async function saveSupplier(input: {
  id: string | null
  supplierName: string
  websiteUrl: string
  branches: SupplierBranch[]
}) {
  if (!clip(input.supplierName, 160)) {
    return { ok: false, error: 'Supplier name is required.' }
  }
  return callAdmin('save_supplier', {
    id: input.id ?? '',
    supplier_name: clip(input.supplierName, 160),
    website_url: clip(input.websiteUrl, 300),
    branches: input.branches.map((branch) => ({
      id: branch.id,
      branch_name: clip(branch.branch_name, 160),
      cross_street: clip(branch.cross_street, 160),
      phone: clip(branch.phone, 40),
      address: clip(branch.address, 240),
      is_main_branch: branch.is_main_branch,
    })),
  })
}

export async function deleteSupplier(id: string) {
  return callAdmin('delete_supplier', { id })
}

export async function loadPosts(): Promise<ActionResult<AdminPost[]>> {
  return callAdmin<AdminPost[]>('list_posts')
}

export async function savePost(input: {
  id: string | null
  title: string
  excerpt: string
  body: string
  category: string
  authorName: string
  authorRole: string
  tags: string[]
  readTime: string
  published: boolean
}) {
  if (!clip(input.title, 180)) return { ok: false, error: 'Title is required.' }
  return callAdmin('save_post', {
    id: input.id ?? '',
    title: clip(input.title, 180),
    excerpt: clip(input.excerpt, 500),
    body: input.body.slice(0, 20000),
    category: clip(input.category, 80),
    author_name: clip(input.authorName, 80),
    author_role: clip(input.authorRole, 80),
    tags: tags(input.tags),
    read_time: clip(input.readTime, 40),
    published: input.published,
  })
}

export async function deletePost(id: string) {
  return callAdmin('delete_post', { id })
}

export async function loadVideos(): Promise<ActionResult<AdminVideo[]>> {
  return callAdmin<AdminVideo[]>('list_videos')
}

export async function saveVideo(input: {
  id: string | null
  title: string
  description: string
  category: string
  videoUrl: string
  duration: string
  authorName: string
  authorRole: string
  tags: string[]
  published: boolean
}) {
  if (!clip(input.title, 180)) return { ok: false, error: 'Title is required.' }
  return callAdmin('save_video', {
    id: input.id ?? '',
    title: clip(input.title, 180),
    description: input.description.trim().slice(0, 2000),
    category: clip(input.category, 80),
    video_url: clip(input.videoUrl, 400),
    duration: clip(input.duration, 20),
    author_name: clip(input.authorName, 80),
    author_role: clip(input.authorRole, 80),
    tags: tags(input.tags),
    published: input.published,
  })
}

export async function deleteVideo(id: string) {
  return callAdmin('delete_video', { id })
}
