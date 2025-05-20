'use client';

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Calendar, Clock, ArrowLeft, Play } from "lucide-react";
import AppContainer from "@/components/layout/AppContainer";

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
    content: `
      <h2>Introduction</h2>
      <p>In this comprehensive video guide, we&apos;ll walk you through the complete process of installing pavers. Whether you&apos;re a DIY enthusiast or a professional contractor, this guide will help you achieve professional results.</p>

      <h2>Tools and Materials</h2>
      <p>Before we begin, make sure you have all the necessary tools and materials. You&apos;ll need:</p>
      <ul>
        <li>Pavers of your choice</li>
        <li>Base material (crushed stone)</li>
        <li>Sand for leveling</li>
        <li>Edge restraints</li>
        <li>Basic tools (shovel, rake, level, etc.)</li>
      </ul>

      <h2>Site Preparation</h2>
      <p>The first step is proper site preparation. This includes:</p>
      <ul>
        <li>Clearing the area</li>
        <li>Excavating to the proper depth</li>
        <li>Ensuring proper drainage</li>
        <li>Compacting the subgrade</li>
      </ul>

      <h2>Base Installation</h2>
      <p>A strong base is crucial for a long-lasting installation. We&apos;ll show you how to:</p>
      <ul>
        <li>Spread and level the base material</li>
        <li>Properly compact the base</li>
        <li>Establish the correct slope</li>
      </ul>

      <h2>Paver Installation</h2>
      <p>The actual installation process requires precision and attention to detail. We&apos;ll cover:</p>
      <ul>
        <li>Laying the first course</li>
        <li>Maintaining consistent joint spacing</li>
        <li>Cutting and fitting edge pieces</li>
        <li>Final compaction</li>
      </ul>

      <h2>Finishing Touches</h2>
      <p>Complete your installation with these final steps:</p>
      <ul>
        <li>Joint sand installation</li>
        <li>Sealing the surface</li>
        <li>Clean-up and inspection</li>
      </ul>
    `
  }
];

export default function VideoPost() {
  const params = useParams();
  const videoId = parseInt(params.id as string);
  const video = videos.find(v => v.id === videoId);

  if (!video) {
    return (
      <AppContainer>
        <div className="w-full h-full bg-white p-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Video Not Found</h1>
            <p className="text-gray-600 mb-8">The video you&apos;re looking for doesn&apos;t exist.</p>
            <Link
              href="/videos"
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-bold rounded-md hover:bg-black transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Videos
            </Link>
          </div>
        </div>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <div className="w-full h-full bg-white p-4">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link
            href="/videos"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-red-500 mb-8 transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Videos
          </Link>

          {/* Video header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(video.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{video.duration}</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{video.title}</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{video.author.name}</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{video.author.role}</span>
            </div>
          </header>

          {/* Video content */}
          <article 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: video.content }}
          />

          {/* Video player placeholder */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-center">
            <p className="text-gray-600 mb-4">Video player will be embedded here</p>
            <a
              href={video.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-bold rounded-md hover:bg-black transition-colors duration-300"
            >
              <Play className="w-4 h-4" />
              Watch on YouTube
            </a>
          </div>
        </div>
      </div>
    </AppContainer>
  );
} 