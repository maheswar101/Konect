import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Clock, Shield, ChevronDown, ChevronUp, Plus } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import PostCard from "@/components/feed/PostCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useCommunity, useCommunityPosts, useJoinCommunity } from "@/hooks/useCommunities";

const CommunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showRules, setShowRules] = useState(false);
  const [activeTab, setActiveTab] = useState<"hot" | "new" | "top">("hot");

  const sortBy = activeTab === "hot" ? "trending" : activeTab === "new" ? "recent" : "top";
  const { data: community, isLoading: loadingCommunity, error: communityError } = useCommunity(id || "");
  const { data: communityPosts, isLoading: loadingPosts } = useCommunityPosts(id || "", sortBy);
  const joinCommunityMutation = useJoinCommunity();

  const formatNumber = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
    return n.toString();
  };

  const tabs = [
    { id: "hot" as const, label: "Hot" },
    { id: "new" as const, label: "New" },
    { id: "top" as const, label: "Top" },
  ];

  if (loadingCommunity) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <LoadingSpinner text="Loading community..." />
        </div>
      </AppLayout>
    );
  }

  if (communityError || !community) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <p>Community not found</p>
          <button onClick={() => navigate("/communities")} className="text-primary mt-2 text-sm">
            Back to Communities
          </button>
        </div>
      </AppLayout>
    );
  }

  const handleJoinToggle = () => {
    joinCommunityMutation.mutate({ id: community.id, isJoined: !!community.isJoined });
  };

  return (
    <AppLayout>
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xl">{community.icon}</span>
            <h1 className="font-display font-bold text-foreground truncate">{community.name}</h1>
          </div>
        </div>
      </div>

      <div
        className="h-24 relative"
        style={{ background: `linear-gradient(135deg, ${community.color}40, ${community.color}10)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="px-4 -mt-6 relative z-10 pb-4">
        <div className="flex items-end justify-between mb-3">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl border-4 border-background"
            style={{ background: `${community.color}25` }}
          >
            {community.icon}
          </div>
          <button
            onClick={handleJoinToggle}
            disabled={joinCommunityMutation.isPending}
            className={`px-5 py-2 rounded-2xl text-sm font-semibold transition-colors ${
              community.isJoined
                ? "bg-secondary text-foreground border border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {community.isJoined ? "Joined" : "Join"}
          </button>
        </div>

        <p className="text-sm text-foreground/80 mb-3">{community.description}</p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>{formatNumber(community.members)} members</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-success rounded-full" />
            <span>{formatNumber(community.onlineMembers || 0)} online</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>Created {community.createdAt}</span>
          </div>
        </div>

        {community.category && (
          <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2.5 py-1 rounded-lg">
            {community.category}
          </span>
        )}
      </div>

      {community.rules && community.rules.length > 0 && (
        <div className="px-4 pb-3">
          <button
            onClick={() => setShowRules(!showRules)}
            className="flex items-center justify-between w-full p-3 rounded-2xl bg-card border border-border hover:bg-card-hover transition-colors"
          >
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-warning" />
              <span className="text-sm font-semibold text-foreground">Community Rules</span>
            </div>
            {showRules ? (
              <ChevronUp size={16} className="text-muted-foreground" />
            ) : (
              <ChevronDown size={16} className="text-muted-foreground" />
            )}
          </button>
          {showRules && (
            <div className="mt-2 p-3 rounded-2xl bg-card border border-border space-y-2">
              {community.rules.map((rule, i) => (
                <div key={i} className="flex gap-2 text-sm">
                  <span className="text-muted-foreground font-semibold min-w-[20px]">{i + 1}.</span>
                  <span className="text-foreground/80">{rule}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex border-b border-border px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="px-4 py-3">
        <button
          onClick={() => navigate("/create", { state: { communityId: community.id } })}
          className="flex items-center gap-3 w-full p-3 rounded-2xl bg-card border border-border hover:bg-card-hover transition-colors"
        >
          <div className="w-8 h-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
            <Plus size={16} />
          </div>
          <span className="text-sm text-muted-foreground">Create a post in {community.name}...</span>
        </button>
      </div>

      {loadingPosts ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="sm" text="Loading posts..." />
        </div>
      ) : communityPosts && communityPosts.length > 0 ? (
        communityPosts.map((post, i) => (
          <PostCard
            key={post.id}
            post={post}
            style={{ animation: `fade-up 0.4s ease-out ${i * 0.05}s both` }}
          />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <span className="text-4xl mb-3">{community.icon}</span>
          <p className="text-sm">No posts yet. Be the first!</p>
        </div>
      )}
    </AppLayout>
  );
};

export default CommunityDetail;
