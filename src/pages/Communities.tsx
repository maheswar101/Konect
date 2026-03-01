import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import TopBar from "@/components/layout/TopBar";
import PostCard from "@/components/feed/PostCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useCommunities, useJoinedCommunities, useJoinCommunity } from "@/hooks/useCommunities";
import { usePosts } from "@/hooks/usePosts";

const Communities = () => {
  const navigate = useNavigate();
  const { data: allCommunities, isLoading: loadingAll } = useCommunities();
  const { data: joinedCommunities, isLoading: loadingJoined } = useJoinedCommunities();
  const { data: communityPosts, isLoading: loadingPosts } = usePosts({});
  const joinCommunityMutation = useJoinCommunity();

  const formatNumber = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
    return n.toString();
  };

  const handleJoinToggle = (id: string, isJoined: boolean) => {
    joinCommunityMutation.mutate({ id, isJoined });
  };

  const filteredPosts = communityPosts?.filter((p) => p.community) || [];
  const notJoinedCommunities = allCommunities?.filter((c) => !c.isJoined) || [];

  return (
    <AppLayout>
      <TopBar title="Communities" />

      {/* Joined communities */}
      <div className="px-4 py-4">
        <h2 className="font-display font-semibold text-sm text-muted-foreground mb-3">YOUR COMMUNITIES</h2>
        {loadingJoined ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="sm" />
          </div>
        ) : joinedCommunities && joinedCommunities.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {joinedCommunities.map((c) => (
              <button
                key={c.id}
                onClick={() => navigate(`/community/${c.id}`)}
                className="flex items-center gap-3 flex-shrink-0 px-4 py-3 rounded-2xl bg-card border border-border/50 hover:bg-card-hover hover:border-primary/30 transition-all hover:scale-105 shadow-sm"
              >
                <span className="text-2xl">{c.icon}</span>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground whitespace-nowrap">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{formatNumber(c.members)} members</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            You haven't joined any communities yet
          </p>
        )}
      </div>

      {/* All communities */}
      <div className="px-4 py-2">
        <h2 className="font-display font-semibold text-sm text-muted-foreground mb-3">DISCOVER</h2>
        {loadingAll ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="sm" />
          </div>
        ) : notJoinedCommunities.length > 0 ? (
          <div className="space-y-3 mb-4">
            {notJoinedCommunities.map((c, i) => (
              <div
                key={c.id}
                className="flex items-center gap-4 w-full p-4 rounded-2xl bg-card hover:bg-card-hover border border-border/50 hover:border-primary/30 transition-all hover:scale-[1.02] text-left shadow-sm"
                style={{ animation: `fade-up 0.4s ease-out ${i * 0.05}s both` }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-md"
                  style={{ background: `${c.color}20` }}
                >
                  {c.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-base mb-1">{c.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{c.description}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{formatNumber(c.members)} members</span>
                    {c.onlineMembers && <span>• {formatNumber(c.onlineMembers)} online</span>}
                  </div>
                </div>
                <button
                  onClick={() => handleJoinToggle(c.id, false)}
                  disabled={joinCommunityMutation.isPending}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  Join
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No more communities to discover
          </p>
        )}
      </div>

      {/* Community posts */}
      <div className="border-t border-border/50">
        <div className="px-4 py-4">
          <h2 className="font-display font-semibold text-sm text-muted-foreground">COMMUNITY DISCUSSIONS</h2>
        </div>
        {loadingPosts ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner text="Loading discussions..." />
          </div>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post, i) => (
            <PostCard
              key={post.id}
              post={post}
              style={{ animation: `fade-up 0.4s ease-out ${i * 0.05}s both` }}
            />
          ))
        ) : (
          <div className="text-center py-12 px-4">
            <p className="text-muted-foreground mb-2">No discussions yet</p>
            <p className="text-sm text-muted-foreground/70">Join a community to see discussions</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Communities;
