import { Bell, Zap } from "lucide-react";

interface TopBarProps {
  title?: string;
}

const TopBar = ({ title = "Nexus" }: TopBarProps) => {
  return (
    <header className="sticky top-0 z-40 glass border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold font-display text-gradient">{title}</h1>
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <Zap size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
          </button>
          <button className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
