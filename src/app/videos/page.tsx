'use client';

import React from "react";
import Link from "next/link";
import { Calendar, Clock, Tag, Play } from "lucide-react";

// Mock data for videos
const videos = [
  {
    id: 1,
    title: "How to Install Pavers: Step by Step Guide",
    description: "A comprehensive video guide showing the complete process of installing pavers, from site preparation to final sealing.",
    category: "Installation",
    video_url: "https://www.youtube.com/watch?v=example1",
    created_at: "2024-03-15",
    duration: "15:30",
    author: {
      name: "John Smith",
      role: "Senior Installer"
    },
    tags: ["Installation", "Tutorial", "DIY"]
  },
  {
    id: 2,
    title: "Choosing the Right Paver Materials",
    description: "Learn about different types of pavers, their durability, and which ones are best suited for your project.",
    category: "Materials",
    video_url: "https://www.youtube.com/watch?v=example2",
    created_at: "2024-03-14",
    duration: "12:45",
    author: {
      name: "Sarah Johnson",
      role: "Materials Specialist"
    },
    tags: ["Materials", "Selection", "Guide"]
  },
  {
    id: 3,
    title: "Paver Maintenance Tips",
    description: "Essential maintenance practices to keep your pavers looking beautiful year after year.",
    category: "Maintenance",
    video_url: "https://www.youtube.com/watch?v=example3",
    created_at: "2024-03-13",
    duration: "10:20",
    author: {
      name: "Mike Wilson",
      role: "Maintenance Expert"
    },
    tags: ["Maintenance", "Cleaning", "Care"]
  }
];

export default function Videos() {
  return (
    <div className="w-full h-full bg-white p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Expert Videos</h1>
      </div>

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
                {video.tags.map((tag, index) => (
                  <span
                    key={index}
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
    </div>
  );
} 