'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, Clock, Tag, Play } from 'lucide-react'
import { fallbackVideos, type PublicVideo } from '@/data/editorial'
import { getPublishedVideos } from '@/services/contentService'

export default function Videos() {
  const [videos, setVideos] = useState<PublicVideo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getPublishedVideos()
      .then((data) => {
        if (!cancelled) setVideos(data)
      })
      .catch(() => {
        if (!cancelled) setVideos(fallbackVideos)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="w-full h-full bg-white p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Expert Videos</h1>
      </div>

      {loading ? (
        <div className="flex min-h-[240px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rotate-45 rounded-sm border-2 border-black bg-red-500" />
        </div>
      ) : videos.length === 0 ? (
        <p className="text-gray-600">No videos yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {videos.map((video) => (
            <article
              key={video.id}
              className="group bg-white border-2 border-red-500 rounded-lg overflow-hidden hover:border-black transition-all duration-300 hover:shadow-xl"
            >
              <Link href={`/videos/${video.id}`} className="block p-6">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                    {video.category}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(video.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{video.duration}</span>
                  </div>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mb-3 group-hover:text-red-500 transition-colors duration-300">
                  {video.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {video.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {video.tags.map((tag) => (
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
                    <span className="text-sm font-medium block">{video.author.name}</span>
                    <span className="text-xs text-gray-500">{video.author.role}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-bold text-red-500 group-hover:text-black transition-colors duration-300">
                    Watch Video
                    <Play className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
