import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import TopBar from "@/components/layout/TopBar";
import FeedTabs from "@/components/feed/FeedTabs";
import PostCard from "@/components/feed/PostCard";
import StoriesBar from "@/components/feed/StoriesBar";
import TrendingSidebar from "@/components/feed/TrendingSidebar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { usePosts } from "@/hooks/usePosts";

const Index = () => {
  const [activeTab, setActiveTab] = useState("foryou");
  
  const { data: posts, isLoading, error } = usePosts({
    sortBy: activeTab === "trending" ? "trending" : "recent",
  });

  return (
    <AppLayout>
      <TopBar />
      <StoriesBar />
      <FeedTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "trending" && <TrendingSidebar />}
      
      <div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner text="Loading posts..." />
          </div>
        ) : error ? (
          <div className="text-center py-12 px-4">
            <p className="text-destructive mb-2">Failed to load posts</p>
            <p className="text-sm text-muted-foreground">Please try again later</p>
          </div>
        ) : posts && posts.length > 0 ? (
          posts.map((post, i) => (
            <PostCard
              key={post.id}
              post={post}
              style={{ animation: `fade-up 0.4s ease-out ${i * 0.05}s both` }}
            />
          ))
        ) : (
          <div className="text-center py-12 px-4">
            <p className="text-muted-foreground mb-2">No posts yet</p>
            <p className="text-sm text-muted-foreground/70">Be the first to share something!</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Index;
