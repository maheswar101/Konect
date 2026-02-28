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
  communityId?: string;
  type: "post" | "thread" | "poll" | "debate";
  tags?: string[];
}

export interface Comment {
  id: string;
  postId: string;
  parentId?: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    isAnonymous?: boolean;
  };
  content: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  replies?: Comment[];
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
  banner?: string;
  rules?: string[];
  moderators?: string[];
  createdAt?: string;
  onlineMembers?: number;
  category?: string;
}

export interface Notification {
  id: string;
  type: "like" | "comment" | "repost" | "follow" | "mention" | "community";
  actor: { name: string; avatar: string; handle: string };
  content: string;
  timestamp: string;
  read: boolean;
  postId?: string;
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
    communityId: "2",
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
    community: "Deep Science",
    communityId: "5",
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
    communityId: "1",
    tags: ["Internet", "Policy", "OpenWeb"],
  },
  {
    id: "6",
    author: { name: "James Wright", handle: "@jwright", avatar: "JW" },
    content: "Unpopular opinion: Microservices are overrated for 90% of startups. A well-structured monolith will serve you better until you hit real scale. Stop over-engineering. Ship faster. 🚀",
    timestamp: "6h",
    likes: 1234,
    comments: 456,
    reposts: 234,
    upvotes: 2100,
    downvotes: 340,
    type: "debate",
    community: "Indie Hackers",
    communityId: "3",
    tags: ["Startups", "Architecture", "Engineering"],
  },
  {
    id: "7",
    author: { name: "Luna Kim", handle: "@lunak", avatar: "LK" },
    content: "Just discovered that the golden ratio appears in DNA double helix measurements. The major groove measures 21 angstroms and the minor groove 13 — both Fibonacci numbers. Nature's code is math. 🧬✨",
    timestamp: "8h",
    likes: 3210,
    comments: 178,
    reposts: 567,
    upvotes: 4500,
    downvotes: 30,
    type: "post",
    community: "Deep Science",
    communityId: "5",
    tags: ["Science", "Math", "Biology"],
  },
  {
    id: "8",
    author: { name: "Dev Kumar", handle: "@devk", avatar: "DK" },
    content: "Design tokens are the unsung heroes of scalable design systems. If your team isn't using them yet, you're accumulating massive design debt. Here's a quick primer on how to start 👇",
    timestamp: "10h",
    likes: 890,
    comments: 67,
    reposts: 123,
    upvotes: 1500,
    downvotes: 15,
    type: "thread",
    community: "Design Systems",
    communityId: "4",
    tags: ["Design", "DesignSystems", "Frontend"],
  },
];

export const mockComments: Comment[] = [
  {
    id: "c1",
    postId: "1",
    author: { name: "Maya Chen", handle: "@mayac_design", avatar: "MC" },
    content: "This is incredible! What framework did you use for the on-device ML? I've been experimenting with TensorFlow Lite.",
    timestamp: "1m",
    upvotes: 45,
    downvotes: 2,
    replies: [
      {
        id: "c1-1",
        postId: "1",
        parentId: "c1",
        author: { name: "Alex Rivera", handle: "@arivera", avatar: "AR" },
        content: "We're using Core ML on iOS and TF Lite on Android. The key is quantizing the models properly — went from 120MB to 8MB with barely any accuracy loss.",
        timestamp: "1m",
        upvotes: 89,
        downvotes: 0,
        replies: [
          {
            id: "c1-1-1",
            postId: "1",
            parentId: "c1-1",
            author: { name: "Dev Kumar", handle: "@devk", avatar: "DK" },
            content: "Model quantization is a game changer. Have you tried ONNX Runtime? It's been great for cross-platform inference.",
            timestamp: "30s",
            upvotes: 12,
            downvotes: 0,
          },
        ],
      },
    ],
  },
  {
    id: "c2",
    postId: "1",
    author: { name: "Dr. Sarah Kim", handle: "@drsarahk", avatar: "SK" },
    content: "Privacy-first ML is definitely the way forward. The EU's AI Act is going to make server-side processing much more complicated. Smart move getting ahead of it.",
    timestamp: "5m",
    upvotes: 67,
    downvotes: 3,
  },
  {
    id: "c3",
    postId: "1",
    author: { name: "Anonymous", handle: "@anon_thinker", avatar: "?", isAnonymous: true },
    content: "Skeptical about the 3ms claim. What's your benchmark methodology? Are you counting just inference or the full pipeline including preprocessing?",
    timestamp: "8m",
    upvotes: 34,
    downvotes: 5,
    replies: [
      {
        id: "c3-1",
        postId: "1",
        parentId: "c3",
        author: { name: "Alex Rivera", handle: "@arivera", avatar: "AR" },
        content: "Fair question! That's inference only on preprocessed data. Full pipeline is ~12ms including tokenization. Still a massive improvement over 200ms+ network round-trip.",
        timestamp: "6m",
        upvotes: 56,
        downvotes: 1,
      },
    ],
  },
  {
    id: "c4",
    postId: "2",
    author: { name: "James Wright", handle: "@jwright", avatar: "JW" },
    content: "Engagement-driven design is a feature, not a bug — at least from the business perspective. The real question is whether we can build sustainable businesses around healthier metrics.",
    timestamp: "10m",
    upvotes: 120,
    downvotes: 34,
  },
  {
    id: "c5",
    postId: "2",
    author: { name: "Luna Kim", handle: "@lunak", avatar: "LK" },
    content: "I think the answer lies in subscription-based models. When your revenue comes from ads, you optimize for attention. When it comes from subscriptions, you optimize for satisfaction.",
    timestamp: "12m",
    upvotes: 230,
    downvotes: 8,
    replies: [
      {
        id: "c5-1",
        postId: "2",
        parentId: "c5",
        author: { name: "Anonymous", handle: "@anon_thinker", avatar: "?", isAnonymous: true },
        content: "That's a good point but it creates a different problem — only people who can afford subscriptions get the 'healthy' platform. Free platforms need a third way.",
        timestamp: "10m",
        upvotes: 89,
        downvotes: 4,
      },
    ],
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
  {
    id: "1",
    name: "Tech Policy",
    description: "Discussing the intersection of technology and governance. From AI regulation to data privacy laws, we explore how policy shapes the tech landscape.",
    members: 234000,
    icon: "⚖️",
    color: "hsl(205 100% 55%)",
    isJoined: true,
    rules: ["No partisan political commentary", "Cite your sources", "Stay on topic", "Be respectful to all viewpoints", "No self-promotion"],
    moderators: ["@policywatch", "@techlaw_daily"],
    createdAt: "Jan 2024",
    onlineMembers: 1240,
    category: "Politics & Law",
  },
  {
    id: "2",
    name: "Digital Ethics",
    description: "Exploring ethics in the digital age. AI bias, algorithmic transparency, digital rights, and the moral implications of emerging technology.",
    members: 189000,
    icon: "🧭",
    color: "hsl(280 80% 60%)",
    isJoined: true,
    rules: ["Structured arguments only", "No ad hominem attacks", "Provide evidence for claims", "Respect anonymity"],
    moderators: ["@ethicsbot", "@digital_rights"],
    createdAt: "Feb 2024",
    onlineMembers: 890,
    category: "Ethics & Philosophy",
  },
  {
    id: "3",
    name: "Indie Hackers",
    description: "Building products, sharing journeys. A community for solo founders, bootstrappers, and small teams building profitable businesses.",
    members: 156000,
    icon: "🚀",
    color: "hsl(145 65% 42%)",
    isJoined: false,
    rules: ["Share your revenue numbers", "No spam or self-promotion without context", "Be constructive in feedback", "Weekly build updates encouraged"],
    moderators: ["@buildinpublic", "@solofounder"],
    createdAt: "Dec 2023",
    onlineMembers: 2100,
    category: "Business & Startups",
  },
  {
    id: "4",
    name: "Design Systems",
    description: "Patterns, tokens, and component architecture. Deep dives into building and maintaining scalable design systems.",
    members: 98000,
    icon: "🎨",
    color: "hsl(38 92% 55%)",
    isJoined: false,
    rules: ["Show your work", "Constructive criticism only", "Credit original designers", "No low-effort posts"],
    moderators: ["@designops", "@tokensftw"],
    createdAt: "Mar 2024",
    onlineMembers: 560,
    category: "Design & UX",
  },
  {
    id: "5",
    name: "Deep Science",
    description: "Peer-reviewed discussions on cutting-edge research. From quantum computing to neuroscience, explore the frontiers of human knowledge.",
    members: 145000,
    icon: "🔬",
    color: "hsl(0 72% 55%)",
    isJoined: true,
    rules: ["Cite peer-reviewed sources", "No pseudoscience", "ELI5 encouraged for complex topics", "Respect the scientific method"],
    moderators: ["@sciencemod", "@peerreview_bot"],
    createdAt: "Nov 2023",
    onlineMembers: 780,
    category: "Science & Research",
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "like",
    actor: { name: "Maya Chen", avatar: "MC", handle: "@mayac_design" },
    content: "liked your post about on-device ML",
    timestamp: "2m ago",
    read: false,
    postId: "1",
  },
  {
    id: "n2",
    type: "comment",
    actor: { name: "Dr. Sarah Kim", avatar: "SK", handle: "@drsarahk" },
    content: "commented on your post: \"Privacy-first ML is definitely the way forward...\"",
    timestamp: "5m ago",
    read: false,
    postId: "1",
  },
  {
    id: "n3",
    type: "repost",
    actor: { name: "James Wright", avatar: "JW", handle: "@jwright" },
    content: "reposted your thread about sleep science",
    timestamp: "15m ago",
    read: false,
    postId: "4",
  },
  {
    id: "n4",
    type: "follow",
    actor: { name: "Luna Kim", avatar: "LK", handle: "@lunak" },
    content: "started following you",
    timestamp: "1h ago",
    read: true,
  },
  {
    id: "n5",
    type: "mention",
    actor: { name: "Dev Kumar", avatar: "DK", handle: "@devk" },
    content: "mentioned you in a post about design tokens",
    timestamp: "2h ago",
    read: true,
    postId: "8",
  },
  {
    id: "n6",
    type: "community",
    actor: { name: "Tech Policy", avatar: "⚖️", handle: "community" },
    content: "New trending post in Tech Policy: \"The EU AI Act explained\"",
    timestamp: "3h ago",
    read: true,
    postId: "5",
  },
  {
    id: "n7",
    type: "like",
    actor: { name: "Alex Rivera", avatar: "AR", handle: "@arivera" },
    content: "liked your comment on the digital ethics debate",
    timestamp: "4h ago",
    read: true,
    postId: "2",
  },
  {
    id: "n8",
    type: "community",
    actor: { name: "Indie Hackers", avatar: "🚀", handle: "community" },
    content: "Weekly showcase thread is live! Share what you built this week.",
    timestamp: "5h ago",
    read: true,
  },
];
