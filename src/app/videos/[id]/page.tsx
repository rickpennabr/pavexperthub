'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Clock } from 'lucide-react'
import { fallbackVideos, type PublicVideo } from '@/data/editorial'
import { youtubeEmbedUrl } from '@/lib/youtube'
import { getPublishedVideo } from '@/services/contentService'

export default function VideoPage() {
  const params = useParams()
  const videoId = String(params.id ?? '')
  const [video, setVideo] = useState<PublicVideo | null | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    getPublishedVideo(videoId)
      .then((found) => {
        if (cancelled) return
        setVideo(found ?? fallbackVideos.find((item) => item.id === videoId) ?? null)
      })
      .catch(() => {
        if (!cancelled) setVideo(fallbackVideos.find((item) => item.id === videoId) ?? null)
      })
    return () => {
      cancelled = true
    }
  }, [videoId])

  if (video === undefined) {
    return (
      <div className="flex min-h-[240px] items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rotate-45 rounded-sm border-2 border-black bg-red-500" />
      </div>
    )
  }

  if (!video) {
    return (
      <div className="bg-white p-4">
        <h1 className="text-3xl font-bold text-gray-900">Video not found</h1>
        <Link href="/videos" className="mt-4 inline-flex items-center gap-2 font-bold text-red-500">
          <ArrowLeft className="h-4 w-4" />
          Back to videos
        </Link>
      </div>
    )
  }

  const embed = youtubeEmbedUrl(video.video_url)

  return (
    <div className="bg-white p-4">
      <div className="mx-auto max-w-4xl">
        <Link href="/videos" className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-red-500">
          <ArrowLeft className="h-4 w-4" />
          Back to videos
        </Link>
        <p className="mb-3 inline-block rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
          {video.category}
        </p>
        <h1 className="text-3xl font-bold text-gray-900">{video.title}</h1>
        <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          {video.duration}
          <span>·</span>
          {video.author.name}
        </p>
        {embed ? (
          <div className="mt-6 aspect-video overflow-hidden rounded-lg border-2 border-red-500">
            <iframe
              src={embed}
              title={video.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : video.video_url ? (
          <a
            href={video.video_url}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-block rounded-md border-2 border-red-500 bg-black px-4 py-2 font-bold text-white"
          >
            Open video
          </a>
        ) : null}
        <p className="mt-6 leading-7 text-gray-700">{video.description}</p>
      </div>
    </div>
  )
}
