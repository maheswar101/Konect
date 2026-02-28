import { useState } from "react";
import { ArrowLeft, Image, BarChart3, Mic, MessageSquare, Globe, Shield, Hash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";

const postTypes = [
  { id: "post", icon: MessageSquare, label: "Post" },
  { id: "thread", icon: Hash, label: "Thread" },
  { id: "poll", icon: BarChart3, label: "Poll" },
  { id: "audio", icon: Mic, label: "Audio" },
];

const Create = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [activeType, setActiveType] = useState("post");
  const [isAnonymous, setIsAnonymous] = useState(false);

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-display font-bold text-foreground">Create</h1>
        <button
          disabled={!content.trim()}
          className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-40 transition-opacity"
        >
          Post
        </button>
      </div>

      {/* Post type selector */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
        {postTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => setActiveType(type.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-sm font-medium transition-colors flex-shrink-0 ${
                activeType === type.id
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "bg-secondary text-muted-foreground border border-transparent"
              }`}
            >
              <Icon size={16} />
              {type.label}
            </button>
          );
        })}
      </div>

      {/* Identity toggle */}
      <div className="px-4 pb-2">
        <button
          onClick={() => setIsAnonymous(!isAnonymous)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors ${
            isAnonymous
              ? "bg-accent/10 text-accent"
              : "bg-card text-muted-foreground"
          }`}
        >
          {isAnonymous ? <Shield size={16} /> : <Globe size={16} />}
          {isAnonymous ? "Posting anonymously" : "Posting as Jordan Davis"}
        </button>
      </div>

      {/* Editor */}
      <div className="px-4 py-2">
        <div className="flex gap-3">
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold ${
              isAnonymous ? "bg-accent/20 text-accent" : "bg-primary/20 text-primary"
            }`}
          >
            {isAnonymous ? "?" : "JD"}
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              activeType === "thread"
                ? "Start your thread..."
                : activeType === "poll"
                ? "Ask a question..."
                : "What's on your mind?"
            }
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm resize-none outline-none min-h-[180px] leading-relaxed"
          />
        </div>
      </div>

      {/* Attachments */}
      <div className="px-4 py-3 border-t border-border flex items-center gap-3">
        <button className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
          <Image size={20} />
        </button>
        <button className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
          <BarChart3 size={20} />
        </button>
        <button className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
          <Mic size={20} />
        </button>
        <button className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
          <Hash size={20} />
        </button>
      </div>
    </AppLayout>
  );
};

export default Create;
