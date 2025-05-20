/**
 * Blog Post Page
 * 
 * A page for viewing individual blog posts with rich content.
 */

"use client"

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import AppContainer from "@/components/layout/AppContainer";

// Mock data for blog posts
const blogPosts = [
  {
    id: 1,
    title: "The Ultimate Guide to Paver Installation",
    content: `
      <h2>Introduction</h2>
      <p>Installing pavers correctly is crucial for creating a durable and beautiful outdoor space. This comprehensive guide will walk you through every step of the process.</p>

      <h2>Site Preparation</h2>
      <p>The foundation of any successful paver installation begins with proper site preparation. This includes clearing the area, excavating to the proper depth, ensuring proper drainage, and compacting the subgrade.</p>

      <h2>Base Installation</h2>
      <p>A strong base is essential for preventing settling and maintaining the integrity of your paver installation. We'll cover choosing the right base materials, proper compaction techniques, and establishing the correct slope.</p>

      <h2>Paver Installation</h2>
      <p>The actual installation process requires precision and attention to detail. Key steps include laying the first course, maintaining consistent joint spacing, cutting and fitting edge pieces, and final compaction.</p>

      <h2>Finishing Touches</h2>
      <p>Complete your installation with joint sand installation, sealing the surface, and final clean-up and inspection.</p>

      <h2>Let&apos;s walk through the essential steps and best practices for a perfect paver installation that&apos;ll last for years.</h2>
    `,
    category: "Installation Tips",
    created_at: "2024-03-15",
    read_time: "8 min read",
    author: {
      name: "John Smith",
      role: "Senior Installer"
    }
  }
];

export default function BlogPost() {
  const params = useParams();
  const postId = parseInt(params.id as string);
  const post = blogPosts.find(p => p.id === postId);

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
    );
  }

  return (
    <AppContainer>
      <div className="w-full h-full bg-white p-4">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link
            href="/expert-blog"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-red-500 mb-8 transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Article header */}
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

          {/* Article content */}
          <article 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>
    </AppContainer>
  );
} 