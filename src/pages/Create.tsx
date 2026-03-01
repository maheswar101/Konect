import { useMemo, useRef, useState } from "react";
import { ArrowLeft, Image, BarChart3, Mic, MessageSquare, Globe, Shield, Hash } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AppLayout from "@/components/layout/AppLayout";
import { useCreatePost } from "@/hooks/usePosts";
import { useAuth } from "@/contexts/AuthContext";

const postTypes = [
  { id: "post", icon: MessageSquare, label: "Post" },
  { id: "thread", icon: Hash, label: "Thread" },
  { id: "poll", icon: BarChart3, label: "Poll" },
  { id: "debate", icon: Mic, label: "Debate" },
] as const;

const Create = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const createPostMutation = useCreatePost();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const tagsInputRef = useRef<HTMLInputElement | null>(null);
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [activeType, setActiveType] = useState<"post" | "thread" | "poll" | "debate">("post");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const selectedCommunityId = useMemo(() => {
    return (location.state as { communityId?: string } | null)?.communityId;
  }, [location.state]);

  const handlePublish = async () => {
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      toast.error("Write something before posting");
      return;
    }

    try {
      await createPostMutation.mutateAsync({
        content: trimmedContent,
        type: activeType,
        isAnonymous,
        communityId: selectedCommunityId,
        tags: tags
          .split(",")
          .map((tag) => tag.trim().replace(/^#/, ""))
          .filter(Boolean),
        media: files.length > 0 ? files : undefined,
      });
      navigate("/");
    } catch (error) {
      // Mutation hook handles error toast
    }
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-display font-bold text-foreground">Create</h1>
        <button
          onClick={handlePublish}
          disabled={!content.trim() || createPostMutation.isPending}
          className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-40 transition-opacity"
        >
          {createPostMutation.isPending ? "Posting..." : "Post"}
        </button>
      </div>

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
          {isAnonymous ? "Posting anonymously" : `Posting as ${user?.username || "you"}`}
        </button>
      </div>

      <div className="px-4 py-2">
        <div className="flex gap-3">
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold ${
              isAnonymous ? "bg-accent/20 text-accent" : "bg-primary/20 text-primary"
            }`}
          >
            {isAnonymous ? "?" : user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              activeType === "thread"
                ? "Start your thread..."
                : activeType === "poll"
                ? "Ask a question..."
                : activeType === "debate"
                ? "State your argument..."
                : "What's on your mind?"
            }
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm resize-none outline-none min-h-[180px] leading-relaxed"
          />
        </div>
      </div>

      <div className="px-4 py-2">
        <input
          ref={tagsInputRef}
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma separated)"
          className="w-full bg-secondary/50 rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
      </div>

      {files.length > 0 && (
        <div className="px-4 py-2">
          <p className="text-xs text-muted-foreground mb-2">Attached files</p>
          <div className="space-y-1">
            {files.map((file) => (
              <div key={`${file.name}-${file.size}`} className="text-xs text-foreground truncate">
                {file.name}
              </div>
            ))}
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => {
          const selected = Array.from(e.target.files || []);
          setFiles(selected);
        }}
      />

      <div className="px-4 py-3 border-t border-border flex items-center gap-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <Image size={20} />
        </button>
        <button
          onClick={() => setActiveType("poll")}
          className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <BarChart3 size={20} />
        </button>
        <button
          onClick={() => setActiveType("debate")}
          className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <Mic size={20} />
        </button>
        <button
          onClick={() => tagsInputRef.current?.focus()}
          className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <Hash size={20} />
        </button>
      </div>
    </AppLayout>
  );
};

export default Create;
