'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react'
import AppContainer from '@/components/layout/AppContainer'
import { fallbackPosts, type PublicArticle } from '@/data/editorial'
import { getPublishedPosts } from '@/services/contentService'

export default function ExpertBlog() {
  const [posts, setPosts] = useState<PublicArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getPublishedPosts()
      .then((data) => {
        if (!cancelled) setPosts(data)
      })
      .catch(() => {
        if (!cancelled) setPosts(fallbackPosts)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <AppContainer>
      <div className="w-full h-full bg-white p-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Expert Blog</h1>
        </div>

        {loading ? (
          <div className="flex min-h-[240px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rotate-45 rounded-sm border-2 border-black bg-red-500" />
          </div>
        ) : posts.length === 0 ? (
          <p className="text-gray-600">No articles yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group bg-white border-2 border-red-500 rounded-lg overflow-hidden hover:border-black transition-all duration-300 hover:shadow-xl"
              >
                <Link href={`/expert-blog/${post.id}`} className="block p-6">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.read_time}</span>
                    </div>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-3 group-hover:text-red-500 transition-colors duration-300">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-500 bg-red-50 rounded-full"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium block">{post.author.name}</span>
                      <span className="text-xs text-gray-500">{post.author.role}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-bold text-red-500 group-hover:text-black transition-colors duration-300">
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </AppContainer>
  )
}
