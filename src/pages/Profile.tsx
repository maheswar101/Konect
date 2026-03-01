import { useEffect, useState } from "react";
import { Settings, Shield, Eye, Star, Calendar } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import PostCard from "@/components/feed/PostCard";
import { useAuth } from "@/contexts/AuthContext";
import { usePosts } from "@/hooks/usePosts";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "sonner";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isAnonymous, setIsAnonymous] = useState(!!user?.anonymousMode);
  const { data: userPosts, isLoading } = usePosts({ userId: user?.id });

  useEffect(() => {
    setIsAnonymous(!!user?.anonymousMode);
  }, [user?.anonymousMode]);

  const formatNumber = (n: number = 0) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return n.toString();
  };

  const handleAnonymousToggle = async () => {
    const newValue = !isAnonymous;
    setIsAnonymous(newValue);
    try {
      await updateProfile({ anonymousMode: newValue });
      toast.success(newValue ? "Anonymous mode enabled" : "Anonymous mode disabled");
    } catch (error) {
      setIsAnonymous(!newValue);
    }
  };

  if (!user) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <LoadingSpinner text="Loading profile..." />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Header */}
      <div className="relative">
        <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/20" />
        <div className="px-4 -mt-12">
          <div className="flex items-end justify-between mb-3">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-3xl font-bold border-4 border-background shadow-xl">
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-full h-full rounded-3xl" />
              ) : (
                user.username.charAt(0).toUpperCase()
              )}
            </div>
            <button className="p-2.5 rounded-xl bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all hover:scale-105">
              <Settings size={20} />
            </button>
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">{user.username}</h1>
          <p className="text-sm text-muted-foreground mb-2">@{user.username}</p>
          {user.bio && (
            <p className="text-sm text-foreground/80 mb-3 leading-relaxed">
              {user.bio}
            </p>
          )}

          {/* Stats */}
          <div className="flex gap-6 mb-4">
            <div className="text-center">
              <p className="text-xl font-bold text-foreground">{formatNumber(userPosts?.length || 0)}</p>
              <p className="text-xs text-muted-foreground">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-foreground">{formatNumber(user.followers)}</p>
              <p className="text-xs text-muted-foreground">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-foreground">{formatNumber(user.following)}</p>
              <p className="text-xs text-muted-foreground">Following</p>
            </div>
          </div>

          {/* Reputation & Join Date */}
          <div className="flex gap-2 mb-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-warning/10 text-warning text-sm shadow-sm">
              <Star size={16} fill="currentColor" />
              <span className="font-semibold">{formatNumber(user.reputation)}</span>
              <span className="text-xs">reputation</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted text-muted-foreground text-sm">
              <Calendar size={16} />
              <span className="text-xs">
                Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'}
              </span>
            </div>
          </div>

          {/* Anonymous toggle */}
          <button
            onClick={handleAnonymousToggle}
            className={`flex items-center gap-3 w-full p-4 rounded-2xl border transition-all mb-4 hover:scale-[1.02] ${
              isAnonymous
                ? "bg-accent/10 border-accent/50 text-accent shadow-lg shadow-accent/20"
                : "bg-card border-border/50 text-muted-foreground hover:bg-card-hover"
            }`}
          >
            {isAnonymous ? <Shield size={20} /> : <Eye size={20} />}
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold">
                {isAnonymous ? "Anonymous Mode Active" : "Public Identity Mode"}
              </p>
              <p className="text-xs opacity-80">
                {isAnonymous ? "Your posts will be anonymous" : "Your posts will show your identity"}
              </p>
            </div>
            <div
              className={`w-12 h-7 rounded-full relative transition-all ${
                isAnonymous ? "bg-accent" : "bg-muted"
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform shadow-md ${
                  isAnonymous ? "left-6" : "left-1"
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Posts */}
      <div className="border-t border-border/50">
        <div className="px-4 py-4">
          <h2 className="font-display font-semibold text-sm text-muted-foreground">YOUR POSTS</h2>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner text="Loading posts..." />
          </div>
        ) : userPosts && userPosts.length > 0 ? (
          userPosts.map((post, i) => (
            <PostCard
              key={post.id}
              post={post}
              style={{ animation: `fade-up 0.4s ease-out ${i * 0.05}s both` }}
            />
          ))
        ) : (
          <div className="text-center py-12 px-4">
            <p className="text-muted-foreground mb-2">No posts yet</p>
            <p className="text-sm text-muted-foreground/70">Share your first thought with the community!</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Profile;
