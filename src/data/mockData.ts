export interface Post {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    isAnonymous?: boolean;
  };
  content: string;
  media?: string;
  timestamp: string;
  likes: number;
  comments: number;
  reposts: number;
  upvotes: number;
  downvotes: number;
  isLiked?: boolean;
  isUpvoted?: boolean;
  isDownvoted?: boolean;
  community?: string;
  type: "post" | "thread" | "poll" | "debate";
  tags?: string[];
}

export interface TrendingTopic {
  id: string;
  name: string;
  posts: number;
  category: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  members: number;
  icon: string;
  color: string;
  isJoined?: boolean;
}

export const mockPosts: Post[] = [
  {
    id: "1",
    author: { name: "Alex Rivera", handle: "@arivera", avatar: "AR" },
    content: "Just shipped a new feature that uses on-device ML for real-time content recommendations. The latency improvement is insane — 3ms vs 200ms from server. Privacy-first AI is the future. 🧠⚡",
    timestamp: "2m",
    likes: 847,
    comments: 132,
    reposts: 89,
    upvotes: 1240,
    downvotes: 23,
    type: "post",
    tags: ["AI", "Privacy", "Engineering"],
  },
  {
    id: "2",
    author: { name: "Anonymous", handle: "@anon_thinker", avatar: "?", isAnonymous: true },
    content: "Hot take: Social media platforms are intentionally designed to create outrage because engagement metrics reward negative emotions. We need platforms that optimize for understanding, not reaction.\n\nThoughts?",
    timestamp: "15m",
    likes: 2341,
    comments: 567,
    reposts: 423,
    upvotes: 3892,
    downvotes: 156,
    type: "debate",
    community: "Digital Ethics",
    tags: ["SocialMedia", "Ethics"],
  },
  {
    id: "3",
    author: { name: "Maya Chen", handle: "@mayac_design", avatar: "MC" },
    content: "Redesigned my portfolio using only CSS Grid and custom properties. Zero JavaScript, zero frameworks. Sometimes constraints breed the best creativity. ✨",
    media: "design",
    timestamp: "1h",
    likes: 1456,
    comments: 234,
    reposts: 167,
    upvotes: 890,
    downvotes: 12,
    type: "post",
    tags: ["Design", "CSS", "WebDev"],
  },
  {
    id: "4",
    author: { name: "Dr. Sarah Kim", handle: "@drsarahk", avatar: "SK" },
    content: "Thread: Why sleep is the most underrated productivity hack 🧵\n\n1/ Your brain consolidates memories during REM sleep. Skip it, and yesterday's learning literally evaporates.\n\n2/ Deep sleep triggers growth hormone release — it's when your body repairs and your immune system recharges.\n\n3/ Just one night of poor sleep reduces your prefrontal cortex activity by 60%. That's your decision-making center.",
    timestamp: "3h",
    likes: 5678,
    comments: 891,
    reposts: 1234,
    upvotes: 7823,
    downvotes: 45,
    type: "thread",
    tags: ["Health", "Productivity", "Science"],
  },
  {
    id: "5",
    author: { name: "Anonymous", handle: "@deep_diver", avatar: "?", isAnonymous: true },
    content: "Poll: What's the biggest threat to open internet?\n\n🔴 Corporate consolidation (42%)\n🔵 Government censorship (28%)\n🟡 AI-generated misinformation (23%)\n🟢 User apathy (7%)",
    timestamp: "5h",
    likes: 3456,
    comments: 1234,
    reposts: 678,
    upvotes: 5432,
    downvotes: 89,
    type: "poll",
    community: "Tech Policy",
    tags: ["Internet", "Policy", "OpenWeb"],
  },
];

export const trendingTopics: TrendingTopic[] = [
  { id: "1", name: "On-Device AI", posts: 12400, category: "Technology" },
  { id: "2", name: "Digital Privacy", posts: 8900, category: "Ethics" },
  { id: "3", name: "Open Source", posts: 6700, category: "Development" },
  { id: "4", name: "Climate Tech", posts: 5200, category: "Science" },
  { id: "5", name: "Sleep Science", posts: 4100, category: "Health" },
];

export const communities: Community[] = [
  { id: "1", name: "Tech Policy", description: "Discussing the intersection of technology and governance", members: 234000, icon: "⚖️", color: "hsl(205 100% 55%)", isJoined: true },
  { id: "2", name: "Digital Ethics", description: "Exploring ethics in the digital age", members: 189000, icon: "🧭", color: "hsl(280 80% 60%)", isJoined: true },
  { id: "3", name: "Indie Hackers", description: "Building products, sharing journeys", members: 156000, icon: "🚀", color: "hsl(145 65% 42%)" },
  { id: "4", name: "Design Systems", description: "Patterns, tokens, and component architecture", members: 98000, icon: "🎨", color: "hsl(38 92% 55%)" },
  { id: "5", name: "Deep Science", description: "Peer-reviewed discussions on cutting-edge research", members: 145000, icon: "🔬", color: "hsl(0 72% 55%)" },
];
