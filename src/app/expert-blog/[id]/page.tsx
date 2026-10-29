'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import AppContainer from '@/components/layout/AppContainer'
import { fallbackPosts, type PublicArticle } from '@/data/editorial'
import { getPublishedPost } from '@/services/contentService'

export default function BlogPost() {
  const params = useParams()
  const postId = String(params.id ?? '')
  const [post, setPost] = useState<PublicArticle | null | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    getPublishedPost(postId)
      .then((found) => {
        if (cancelled) return
        setPost(found ?? fallbackPosts.find((item) => item.id === postId) ?? null)
      })
      .catch(() => {
        if (!cancelled) setPost(fallbackPosts.find((item) => item.id === postId) ?? null)
      })
    return () => {
      cancelled = true
    }
  }, [postId])

  if (post === undefined) {
    return (
      <AppContainer>
        <div className="flex min-h-[240px] items-center justify-center bg-white">
          <div className="h-8 w-8 animate-spin rotate-45 rounded-sm border-2 border-black bg-red-500" />
        </div>
      </AppContainer>
    )
  }

  if (!post) {
    return (
      <AppContainer>
        <div className="w-full h-full bg-white p-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-8">The blog post you&apos;re looking for doesn&apos;t exist.</p>
            <Link
              href="/expert-blog"
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-bold rounded-md hover:bg-black transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </div>
      </AppContainer>
    )
  }

  const paragraphs = post.body.split(/\n\n+/).map((paragraph) => paragraph.trim()).filter(Boolean)

  return (
    <AppContainer>
      <div className="w-full h-full bg-white p-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/expert-blog"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-red-500 mb-8 transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <header className="mb-8">
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.read_time}</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{post.author.name}</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{post.author.role}</span>
            </div>
          </header>

          {post.html ? (
            <article
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          ) : (
            <article className="space-y-4 text-base leading-7 text-gray-800">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </article>
          )}
        </div>
      </div>
    </AppContainer>
  )
}
