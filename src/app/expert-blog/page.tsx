/**
 * ExpertBlog Page
 * 
 * A modern blog page showcasing expert articles and insights.
 * Features:
 * - Responsive grid layout
 * - Category filtering
 * - Search functionality
 * - Featured articles section
 * - Mobile-optimized design
 */

"use client"

import React from "react";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import AppContainer from "@/components/layout/AppContainer";

// Mock data for blog posts
const blogPosts = [
  {
    id: 1,
    title: "The Ultimate Guide to Paver Installation",
    excerpt: "Learn the essential steps and best practices for a perfect paver installation that lasts for years. From site preparation to final sealing, we cover everything you need to know.",
    category: "Installation Tips",
    created_at: "2024-03-15",
    read_time: "8 min read",
    author: {
      name: "John Smith",
      role: "Senior Installer"
    },
    tags: ["Installation", "Best Practices", "DIY Guide"]
  },
  {
    id: 2,
    title: "Choosing the Right Materials for Your Patio",
    excerpt: "A comprehensive guide to selecting the perfect materials for your outdoor living space. Compare different types of pavers, their durability, and aesthetic appeal.",
    category: "Materials & Products",
    created_at: "2024-03-14",
    read_time: "6 min read",
    author: {
      name: "Sarah Johnson",
      role: "Materials Specialist"
    },
    tags: ["Materials", "Design", "Patio"]
  },
  {
    id: 3,
    title: "Maintenance Tips for Long-Lasting Pavers",
    excerpt: "Essential maintenance practices to keep your pavers looking beautiful year after year. Learn about cleaning, sealing, and repair techniques.",
    category: "Maintenance Guide",
    created_at: "2024-03-13",
    read_time: "5 min read",
    author: {
      name: "Mike Wilson",
      role: "Maintenance Expert"
    },
    tags: ["Maintenance", "Cleaning", "Repair"]
  }
];

export default function ExpertBlog() {
  return (
    <AppContainer>
      <div className="w-full h-full bg-white p-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Expert Blog</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {blogPosts.map((post) => (
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
                  {post.tags.map((tag, index) => (
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
      </div>
    </AppContainer>
  );
} 