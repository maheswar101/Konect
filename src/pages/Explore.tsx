import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, TrendingUp } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import TopBar from "@/components/layout/TopBar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useTrendingTopics } from "@/hooks/usePosts";
import { useCommunities } from "@/hooks/useCommunities";

const Explore = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { data: trendingTopics, isLoading: loadingTrending } = useTrendingTopics(20);
  const { data: communities, isLoading: loadingCommunities } = useCommunities();

  const normalizedQuery = query.trim().toLowerCase();

  const filteredTopics = useMemo(() => {
    if (!trendingTopics) return [];
    if (!normalizedQuery) return trendingTopics;
    return trendingTopics.filter(
      (topic) =>
        topic.name.toLowerCase().includes(normalizedQuery) ||
        topic.category.toLowerCase().includes(normalizedQuery)
    );
  }, [normalizedQuery, trendingTopics]);

  const filteredCommunities = useMemo(() => {
    if (!communities) return [];
    if (!normalizedQuery) return communities;
    return communities.filter(
      (community) =>
        community.name.toLowerCase().includes(normalizedQuery) ||
        community.description.toLowerCase().includes(normalizedQuery) ||
        community.category?.toLowerCase().includes(normalizedQuery)
    );
  }, [communities, normalizedQuery]);

  const formatNumber = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
    return n.toString();
  };

  return (
    <AppLayout>
      <TopBar title="Explore" />

      <div className="px-4 py-3">
        <div className="flex items-center gap-3 bg-secondary rounded-2xl px-4 py-3">
          <Search size={18} className="text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics, people, communities..."
            className="bg-transparent text-foreground text-sm placeholder:text-muted-foreground outline-none flex-1"
          />
        </div>
      </div>

      <section className="px-4 py-2">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={18} className="text-primary" />
          <h2 className="font-display font-bold text-foreground">Trending Topics</h2>
        </div>
        {loadingTrending ? (
          <div className="py-8">
            <LoadingSpinner size="sm" text="Loading trending topics..." />
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTopics.map((topic, i) => (
              <div
                key={topic.id}
                className="flex items-center gap-4 p-3 rounded-2xl bg-card hover:bg-card-hover border border-border transition-colors"
                style={{ animation: `fade-up 0.4s ease-out ${i * 0.05}s both` }}
              >
                <span className="text-lg font-bold text-muted-foreground w-6">{i + 1}</span>
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm">{topic.name}</p>
                  <p className="text-xs text-muted-foreground">{formatNumber(topic.posts)} posts · {topic.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="px-4 py-4">
        <h2 className="font-display font-bold text-foreground mb-3">Discover Communities</h2>
        {loadingCommunities ? (
          <div className="py-8">
            <LoadingSpinner size="sm" text="Loading communities..." />
          </div>
        ) : (
          <div className="space-y-2">
            {filteredCommunities.map((c, i) => (
              <button
                key={c.id}
                onClick={() => navigate(`/community/${c.id}`)}
                className="flex items-center gap-3 w-full p-3 rounded-2xl bg-card hover:bg-card-hover border border-border transition-colors cursor-pointer text-left"
                style={{ animation: `fade-up 0.4s ease-out ${(i + 5) * 0.05}s both` }}
              >
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-lg" style={{ background: `${c.color}20` }}>
                  {c.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm">{c.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{c.description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-muted-foreground">{formatNumber(c.members)}</p>
                  {c.isJoined ? (
                    <span className="text-xs font-medium text-success">Joined</span>
                  ) : (
                    <span className="text-xs font-medium text-primary">Join</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </AppLayout>
  );
};

export default Explore;
