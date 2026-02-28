import AppLayout from "@/components/layout/AppLayout";
import TopBar from "@/components/layout/TopBar";
import PostCard from "@/components/feed/PostCard";
import { communities, mockPosts } from "@/data/mockData";

const Communities = () => {
  const formatNumber = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
    return n.toString();
  };

  const communityPosts = mockPosts.filter((p) => p.community);

  return (
    <AppLayout>
      <TopBar title="Communities" />

      {/* Joined communities */}
      <div className="px-4 py-3">
        <h2 className="font-display font-semibold text-sm text-muted-foreground mb-2">YOUR COMMUNITIES</h2>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {communities
            .filter((c) => c.isJoined)
            .map((c) => (
              <button
                key={c.id}
                className="flex items-center gap-2 flex-shrink-0 px-3 py-2 rounded-2xl bg-card border border-border hover:bg-card-hover transition-colors"
              >
                <span className="text-lg">{c.icon}</span>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground whitespace-nowrap">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{formatNumber(c.members)} members</p>
                </div>
              </button>
            ))}
        </div>
      </div>

      {/* Community posts */}
      <div className="border-t border-border">
        <div className="px-4 py-3">
          <h2 className="font-display font-semibold text-sm text-muted-foreground">COMMUNITY DISCUSSIONS</h2>
        </div>
        {communityPosts.map((post, i) => (
          <PostCard
            key={post.id}
            post={post}
            style={{ animation: `fade-up 0.4s ease-out ${i * 0.05}s both` }}
          />
        ))}
      </div>
    </AppLayout>
  );
};

export default Communities;
