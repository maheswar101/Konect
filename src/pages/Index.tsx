import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import TopBar from "@/components/layout/TopBar";
import FeedTabs from "@/components/feed/FeedTabs";
import PostCard from "@/components/feed/PostCard";
import StoriesBar from "@/components/feed/StoriesBar";
import TrendingSidebar from "@/components/feed/TrendingSidebar";
import { mockPosts } from "@/data/mockData";

const Index = () => {
  const [activeTab, setActiveTab] = useState("foryou");

  return (
    <AppLayout>
      <TopBar />
      <StoriesBar />
      <FeedTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "trending" && <TrendingSidebar />}
      <div>
        {mockPosts.map((post, i) => (
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

export default Index;
