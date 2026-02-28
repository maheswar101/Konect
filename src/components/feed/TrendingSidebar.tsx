import { TrendingUp } from "lucide-react";
import { trendingTopics } from "@/data/mockData";

const TrendingSidebar = () => {
  const formatNumber = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return n.toString();
  };

  return (
    <div className="px-4 py-3">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp size={16} className="text-primary" />
        <h3 className="font-display font-semibold text-sm text-foreground">Trending Now</h3>
      </div>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {trendingTopics.map((topic) => (
          <button
            key={topic.id}
            className="flex-shrink-0 px-3 py-2 rounded-2xl bg-secondary hover:bg-card-hover border border-border transition-colors"
          >
            <span className="text-xs text-muted-foreground">{topic.category}</span>
            <p className="text-sm font-medium text-foreground whitespace-nowrap">{topic.name}</p>
            <span className="text-xs text-muted-foreground">{formatNumber(topic.posts)} posts</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendingSidebar;
