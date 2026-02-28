const stories = [
  { id: "you", name: "You", avatar: "+", isYou: true },
  { id: "1", name: "Alex", avatar: "AR" },
  { id: "2", name: "Maya", avatar: "MC" },
  { id: "3", name: "Sarah", avatar: "SK" },
  { id: "4", name: "James", avatar: "JW" },
  { id: "5", name: "Luna", avatar: "LK" },
  { id: "6", name: "Dev", avatar: "DK" },
];

const StoriesBar = () => {
  return (
    <div className="flex gap-3 px-4 py-3 overflow-x-auto scrollbar-hide border-b border-border">
      {stories.map((story) => (
        <button
          key={story.id}
          className="flex flex-col items-center gap-1 flex-shrink-0"
        >
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-bold transition-transform active:scale-95 ${
              story.isYou
                ? "border-2 border-dashed border-muted-foreground text-muted-foreground"
                : "bg-gradient-to-br from-primary/30 to-accent/30 text-foreground ring-2 ring-primary/50"
            }`}
          >
            {story.avatar}
          </div>
          <span className="text-[10px] text-muted-foreground font-medium">{story.name}</span>
        </button>
      ))}
    </div>
  );
};

export default StoriesBar;
