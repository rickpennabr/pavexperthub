import { supabase } from '@/lib/supabaseClient'
import type { PublicArticle, PublicVideo } from '@/data/editorial'

function asTags(value: unknown) {
  return Array.isArray(value) ? value.filter((tag): tag is string => typeof tag === 'string') : []
}

export async function getPublishedPosts(): Promise<PublicArticle[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, excerpt, body, category, author_name, author_role, tags, read_time, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data ?? []).map((post) => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    body: post.body,
    category: post.category,
    created_at: post.created_at,
    read_time: post.read_time,
    author: { name: post.author_name, role: post.author_role },
    tags: asTags(post.tags),
  }))
}

export async function getPublishedPost(id: string): Promise<PublicArticle | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, excerpt, body, category, author_name, author_role, tags, read_time, created_at')
    .eq('id', id)
    .eq('published', true)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  return {
    id: data.id,
    title: data.title,
    excerpt: data.excerpt,
    body: data.body,
    category: data.category,
    created_at: data.created_at,
    read_time: data.read_time,
    author: { name: data.author_name, role: data.author_role },
    tags: asTags(data.tags),
  }
}

export async function getPublishedVideos(): Promise<PublicVideo[]> {
  const { data, error } = await supabase
    .from('videos')
    .select('id, title, description, category, video_url, duration, author_name, author_role, tags, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data ?? []).map((video) => ({
    id: video.id,
    title: video.title,
    description: video.description,
    category: video.category,
    video_url: video.video_url,
    created_at: video.created_at,
    duration: video.duration,
    author: { name: video.author_name, role: video.author_role },
    tags: asTags(video.tags),
  }))
}

export async function getPublishedVideo(id: string): Promise<PublicVideo | null> {
  const { data, error } = await supabase
    .from('videos')
    .select('id, title, description, category, video_url, duration, author_name, author_role, tags, created_at')
    .eq('id', id)
    .eq('published', true)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    category: data.category,
    video_url: data.video_url,
    created_at: data.created_at,
    duration: data.duration,
    author: { name: data.author_name, role: data.author_role },
    tags: asTags(data.tags),
  }
}
