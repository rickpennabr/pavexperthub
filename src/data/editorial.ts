export interface PublicArticle {
  id: string
  title: string
  excerpt: string
  body: string
  html?: string
  category: string
  created_at: string
  read_time: string
  author: { name: string; role: string }
  tags: string[]
}

export interface PublicVideo {
  id: string
  title: string
  description: string
  category: string
  video_url: string
  created_at: string
  duration: string
  author: { name: string; role: string }
  tags: string[]
}

export const fallbackPosts: PublicArticle[] = [
  {
    id: '1',
    title: 'The Ultimate Guide to Paver Installation',
    excerpt: 'Learn the essential steps and best practices for a perfect paver installation that lasts for years. From site preparation to final sealing, we cover everything you need to know.',
    body: '',
    html: `
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
    `,
    category: 'Installation Tips',
    created_at: '2024-03-15',
    read_time: '8 min read',
    author: { name: 'John Smith', role: 'Senior Installer' },
    tags: ['Installation', 'Best Practices', 'DIY Guide'],
  },
  {
    id: '2',
    title: 'Choosing the Right Materials for Your Patio',
    excerpt: 'A comprehensive guide to selecting the perfect materials for your outdoor living space. Compare different types of pavers, their durability, and aesthetic appeal.',
    body: 'Patio materials have to handle sun, water, and foot traffic. Concrete pavers, porcelain, and travertine each bring a different look and a different level of upkeep.\n\nMatch the thickness and finish to how the space will be used. A driveway needs a different build than a pool deck.',
    category: 'Materials & Products',
    created_at: '2024-03-14',
    read_time: '6 min read',
    author: { name: 'Sarah Johnson', role: 'Materials Specialist' },
    tags: ['Materials', 'Design', 'Patio'],
  },
  {
    id: '3',
    title: 'Maintenance Tips for Long-Lasting Pavers',
    excerpt: 'Essential maintenance practices to keep your pavers looking beautiful year after year. Learn about cleaning, sealing, and repair techniques.',
    body: 'Sweep sand and debris out of the joints before it stains. Rinse the field, and skip harsh acid unless an installer has called for it.\n\nReseal on the schedule for your product, and reset any pavers that rock or hold water.',
    category: 'Maintenance Guide',
    created_at: '2024-03-13',
    read_time: '5 min read',
    author: { name: 'Mike Wilson', role: 'Maintenance Expert' },
    tags: ['Maintenance', 'Cleaning', 'Repair'],
  },
]

export const fallbackVideos: PublicVideo[] = [
  {
    id: '1',
    title: 'How to Install Pavers: Step by Step Guide',
    description: 'A comprehensive video guide showing the complete process of installing pavers, from site preparation to final sealing.',
    category: 'Installation',
    video_url: 'https://www.youtube.com/watch?v=example1',
    created_at: '2024-03-15',
    duration: '15:30',
    author: { name: 'John Smith', role: 'Senior Installer' },
    tags: ['Installation', 'Tutorial', 'DIY'],
  },
  {
    id: '2',
    title: 'Choosing the Right Paver Materials',
    description: 'Learn about different types of pavers, their durability, and which ones are best suited for your project.',
    category: 'Materials',
    video_url: 'https://www.youtube.com/watch?v=example2',
    created_at: '2024-03-14',
    duration: '12:45',
    author: { name: 'Sarah Johnson', role: 'Materials Specialist' },
    tags: ['Materials', 'Selection', 'Guide'],
  },
  {
    id: '3',
    title: 'Paver Maintenance Tips',
    description: 'Essential maintenance practices to keep your pavers looking beautiful year after year.',
    category: 'Maintenance',
    video_url: 'https://www.youtube.com/watch?v=example3',
    created_at: '2024-03-13',
    duration: '10:20',
    author: { name: 'Mike Wilson', role: 'Maintenance Expert' },
    tags: ['Maintenance', 'Cleaning', 'Care'],
  },
]
