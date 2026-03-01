import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useJoinedCommunities } from "@/hooks/useCommunities";
import { useAuth } from "@/contexts/AuthContext";

const StoriesBar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: joinedCommunities } = useJoinedCommunities();

  const stories = useMemo(() => {
    const you = {
      id: "you",
      name: "You",
      avatar: user?.username?.charAt(0).toUpperCase() || "+",
      isYou: true,
    };
    const communityStories = (joinedCommunities || []).slice(0, 10).map((community) => ({
      id: community.id,
      name: community.name,
      avatar: community.icon,
      isYou: false,
    }));
    return [you, ...communityStories];
  }, [joinedCommunities, user?.username]);

  return (
    <div className="flex gap-4 px-4 py-4 overflow-x-auto scrollbar-hide border-b border-border/50 bg-gradient-to-r from-background via-primary/5 to-background">
      {stories.map((story) => (
        <button
          key={story.id}
          onClick={() => {
            if (!story.isYou) {
              navigate(`/community/${story.id}`);
            }
          }}
          className="flex flex-col items-center gap-2 flex-shrink-0 group"
        >
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-sm font-bold transition-all active:scale-95 group-hover:scale-105 ${
              story.isYou
                ? "border-2 border-dashed border-primary/50 text-primary hover:border-primary hover:bg-primary/5"
                : "bg-gradient-to-br from-primary/30 to-accent/30 text-foreground ring-2 ring-primary/40 shadow-lg shadow-primary/20 hover:shadow-primary/40"
            }`}
          >
            {story.avatar}
          </div>
          <span className="text-xs text-muted-foreground font-medium group-hover:text-foreground transition-colors">{story.name}</span>
        </button>
      ))}
    </div>
  );
};

export default StoriesBar;
