interface FeedTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "foryou", label: "For You" },
  { id: "trending", label: "Trending" },
  { id: "communities", label: "Deep Dives" },
];

const FeedTabs = ({ activeTab, onTabChange }: FeedTabsProps) => {
  return (
    <div className="flex border-b border-border/50 sticky top-[57px] z-30 glass backdrop-blur-xl">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 py-4 text-sm font-semibold transition-all relative group ${
            activeTab === tab.id
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary to-accent rounded-full shadow-lg shadow-primary/50" />
          )}
          {activeTab !== tab.id && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-primary to-accent rounded-full transition-all group-hover:w-8" />
          )}
        </button>
      ))}
    </div>
  );
};

export default FeedTabs;
