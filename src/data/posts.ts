
import type { Post } from '@/components/article-card';

// This file serves as a local data fallback when the WordPress API is unreachable.

export const fallbackPosts: Post[] = [
  {
    id: 1,
    title: "Anoushka Shankar Announces 'Chapter I: Forever, For Now' EP",
    slug: "anoushka-shankar-announces-chapter-i-forever-for-now-ep",
    category: "News",
    imageUrl: "https://picsum.photos/seed/14/1200/800",
    imageHint: "sitar instrument",
    author: {
      name: "RagaMagazine Staff",
      avatarUrl: "https://secure.gravatar.com/avatar/?s=96&d=mm&r=g",
    },
    date: "2023-10-26T12:00:00Z",
    excerpt: "The five-time Grammy-nominated artist returns with a new body of work, exploring themes of time, change, and connection.",
    tags: ["featured", "new music"],
    views: 1500,
    isEvent: false
  },
  {
    id: 2,
    title: "Exploring the Fusion: When Jazz Met Indian Classical",
    slug: "exploring-the-fusion-when-jazz-met-indian-classical",
    category: "Featured",
    imageUrl: "https://picsum.photos/seed/6/1200/800",
    imageHint: "guitar acoustic",
    author: {
      name: "Priya Sharma",
      avatarUrl: "https://secure.gravatar.com/avatar/?s=96&d=mm&r=g",
    },
    date: "2023-10-24T10:30:00Z",
    excerpt: "A deep dive into the historical and contemporary collaborations that have blended two of the world's most sophisticated musical traditions.",
    tags: ["jazz", "fusion", "history"],
    views: 2200,
    isEvent: false
  },
  {
    id: 3,
    title: "Live in Concert: Ustad Rashid Khan",
    slug: "live-in-concert-ustad-rashid-khan",
    category: "Events",
    imageUrl: "https://picsum.photos/seed/2/1200/800",
    imageHint: "concert stage",
    author: {
      name: "Events Team",
      avatarUrl: "https://secure.gravatar.com/avatar/?s=96&d=mm&r=g",
    },
    date: "2023-11-15T19:00:00Z",
    excerpt: "Experience the magic of the Rampur-Sahaswan gharana with a special performance by the legendary Ustad Rashid Khan. Book your tickets now!",
    tags: ["live music", "classical"],
    views: 950,
    isEvent: true
  },
  {
    id: 4,
    title: "The Rise of Lo-fi Hindustani Beats",
    slug: "the-rise-of-lo-fi-hindustani-beats",
    category: "Culture",
    imageUrl: "https://picsum.photos/seed/4/1200/800",
    imageHint: "vinyl record",
    author: {
      name: "Rohan Verma",
      avatarUrl: "https://secure.gravatar.com/avatar/?s=96&d=mm&r=g",
    },
    date: "2023-10-22T14:00:00Z",
    excerpt: "How a new generation of producers is reimagining classical melodies with chillhop aesthetics, creating a viral new genre.",
    tags: ["lo-fi", "electronic", "trends"],
    views: 3100,
    isEvent: false
  },
  {
    id: 5,
    title: "Review: 'The Soul of Sarangi' by Sabir Khan",
    slug: "review-the-soul-of-sarangi-by-sabir-khan",
    category: "Albums",
    imageUrl: "https://picsum.photos/seed/3/1200/800",
    imageHint: "musician portrait",
    author: {
      name: "Anjali Mehta",
      avatarUrl: "https://secure.gravatar.com/avatar/?s=96&d=mm&r=g",
    },
    date: "2023-10-20T18:00:00Z",
    excerpt: "Sabir Khan's latest album is a hauntingly beautiful exploration of the sarangi, proving its timeless appeal in the modern age.",
    tags: ["album review", "sarangi", "classical"],
    views: 800,
    isEvent: false
  },
  {
    id: 6,
    title: "Online Workshop: Introduction to Tabla Rhythms",
    slug: "online-workshop-introduction-to-tabla-rhythms",
    category: "Events",
    imageUrl: "https://picsum.photos/seed/1/1200/800",
    imageHint: "instrument music",
    author: {
      name: "Workshops",
      avatarUrl: "https://secure.gravatar.com/avatar/?s=96&d=mm&r=g",
    },
    date: "2023-12-02T11:00:00Z",
    excerpt: "Join our interactive online workshop and learn the fundamentals of tabla from renowned percussionist Vikram Patil. Limited spots available.",
    tags: ["workshop", "tabla", "education"],
    views: 500,
    isEvent: true
  },
  {
    id: 7,
    title: "Behind the Scenes: The Making of a Sitar",
    slug: "behind-the-scenes-the-making-of-a-sitar",
    category: "Culture",
    imageUrl: "https://picsum.photos/seed/5/1200/800",
    imageHint: "performance art",
    author: {
      name: "Siddharth Rao",
      avatarUrl: "https://secure.gravatar.com/avatar/?s=96&d=mm&r=g",
    },
    date: "2023-10-18T09:00:00Z",
    excerpt: "We visit a family of master craftsmen who have been making sitars for generations, to understand the art and science behind this iconic instrument.",
    tags: ["craftsmanship", "sitar", "documentary"],
    views: 1800,
    isEvent: false
  },
  {
    id: 8,
    title: "Indie-Folk Sensation Prateek Kuhad's US Tour",
    slug: "prateek-kuhad-us-tour",
    category: "News",
    imageUrl: "https://picsum.photos/seed/15/1200/800",
    imageHint: "music festival",
    author: {
      name: "RagaMagazine Staff",
      avatarUrl: "https://secure.gravatar.com/avatar/?s=96&d=mm&r=g",
    },
    date: "2023-10-15T15:20:00Z",
    excerpt: "Following the success of 'The Way That Lovers Do', Prateek Kuhad announces a 15-city tour across the United States this winter.",
    tags: ["featured", "tour", "indie"],
    views: 4500,
    isEvent: false
  },
  {
    id: 9,
    title: "Remembering Pandit Ravi Shankar on His 103rd Birth Anniversary",
    slug: "remembering-pandit-ravi-shankar",
    category: "History",
    imageUrl: "https://picsum.photos/seed/9/1200/800",
    imageHint: "classical music",
    author: {
      name: "Archive Team",
      avatarUrl: "https://secure.gravatar.com/avatar/?s=96&d=mm&r=g",
    },
    date: "2023-04-07T08:00:00Z",
    excerpt: "A look back at the life and legacy of the maestro who took the sitar to the world stage and became a global cultural icon.",
    tags: ["ravi shankar", "legend", "sitar"],
    views: 5000,
    isEvent: false
  },
  {
    id: 10,
    title: "A Beginner's Guide to Identifying Ragas",
    slug: "a-beginners-guide-to-identifying-ragas",
    category: "Education",
    imageUrl: "https://picsum.photos/seed/7/1200/800",
    imageHint: "piano keys",
    author: {
      name: "Dr. Alisha Singh",
      avatarUrl: "https://secure.gravatar.com/avatar/?s=96&d=mm&r=g",
    },
    date: "2023-10-12T11:00:00Z",
    excerpt: "Feeling lost in the ocean of ragas? Our simple guide will help you identify some of the most common ragas by their mood and key phrases.",
    tags: ["guide", "raga", "education"],
    views: 6200,
    isEvent: false
  }
];
