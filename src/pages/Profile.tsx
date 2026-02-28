import { useState } from "react";
import { Settings, Shield, Eye, Star, Calendar } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import PostCard from "@/components/feed/PostCard";
import { mockPosts } from "@/data/mockData";

const Profile = () => {
  const [isAnonymous, setIsAnonymous] = useState(false);

  const userPosts = mockPosts.slice(0, 2);

  return (
    <AppLayout>
      {/* Header */}
      <div className="relative">
        <div className="h-28 bg-gradient-to-br from-primary/20 to-accent/20" />
        <div className="px-4 -mt-10">
          <div className="flex items-end justify-between mb-3">
            <div className="w-20 h-20 rounded-3xl bg-primary/20 text-primary flex items-center justify-center text-2xl font-bold border-4 border-background">
              JD
            </div>
            <button className="p-2 rounded-xl bg-secondary text-muted-foreground hover:text-foreground transition-colors">
              <Settings size={18} />
            </button>
          </div>
          <h1 className="text-xl font-display font-bold text-foreground">Jordan Davis</h1>
          <p className="text-sm text-muted-foreground mb-2">@jordand</p>
          <p className="text-sm text-foreground/80 mb-3">
            Building the future of social interaction. Privacy advocate. Open-source contributor.
          </p>

          {/* Stats */}
          <div className="flex gap-4 mb-4">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">1.2k</p>
              <p className="text-xs text-muted-foreground">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">24.5k</p>
              <p className="text-xs text-muted-foreground">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">892</p>
              <p className="text-xs text-muted-foreground">Following</p>
            </div>
          </div>

          {/* Reputation & Identity Toggle */}
          <div className="flex gap-2 mb-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-warning/10 text-warning text-sm">
              <Star size={14} />
              <span className="font-semibold">4,230</span>
              <span className="text-xs">reputation</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted text-muted-foreground text-sm">
              <Calendar size={14} />
              <span className="text-xs">Joined Mar 2024</span>
            </div>
          </div>

          {/* Anonymous toggle */}
          <button
            onClick={() => setIsAnonymous(!isAnonymous)}
            className={`flex items-center gap-2 w-full p-3 rounded-2xl border transition-colors mb-4 ${
              isAnonymous
                ? "bg-accent/10 border-accent text-accent"
                : "bg-card border-border text-muted-foreground"
            }`}
          >
            {isAnonymous ? <Shield size={18} /> : <Eye size={18} />}
            <span className="text-sm font-medium">
              {isAnonymous ? "Anonymous Mode Active" : "Public Identity Mode"}
            </span>
            <div
              className={`ml-auto w-10 h-6 rounded-full relative transition-colors ${
                isAnonymous ? "bg-accent" : "bg-muted"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-foreground transition-transform ${
                  isAnonymous ? "left-5" : "left-1"
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Posts */}
      <div className="border-t border-border">
        <div className="px-4 py-3">
          <h2 className="font-display font-semibold text-sm text-muted-foreground">YOUR POSTS</h2>
        </div>
        {userPosts.map((post, i) => (
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

export default Profile;
