import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import PostCard from "@/components/feed/PostCard";
import CommentThread from "@/components/feed/CommentThread";
import { mockPosts, mockComments } from "@/data/mockData";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [replyText, setReplyText] = useState("");

  const post = mockPosts.find((p) => p.id === id);
  const comments = mockComments.filter((c) => c.postId === id);

  if (!post) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <p>Post not found</p>
          <button onClick={() => navigate(-1)} className="text-primary mt-2 text-sm">Go back</button>
        </div>
      </AppLayout>
    );
  }

  const handleSubmitReply = () => {
    if (!replyText.trim()) return;
    setReplyText("");
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-display font-bold text-foreground">Post</h1>
        </div>
      </div>

      {/* Post */}
      <PostCard post={post} />

      {/* Reply input */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
            JD
          </div>
          <div className="flex-1 flex items-center gap-2 bg-secondary rounded-2xl px-4 py-2.5">
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 bg-transparent text-foreground text-sm placeholder:text-muted-foreground outline-none"
              onKeyDown={(e) => e.key === "Enter" && handleSubmitReply()}
            />
            <button
              onClick={handleSubmitReply}
              disabled={!replyText.trim()}
              className="p-1 text-primary disabled:text-muted-foreground transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="px-4 py-3">
        <h2 className="font-display font-semibold text-sm text-muted-foreground mb-3">
          {comments.length > 0 ? `${post.comments} COMMENTS` : "NO COMMENTS YET"}
        </h2>
      </div>
      {comments.map((comment, i) => (
        <CommentThread
          key={comment.id}
          comment={comment}
          depth={0}
          style={{ animation: `fade-up 0.3s ease-out ${i * 0.05}s both` }}
        />
      ))}
      {comments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <p className="text-sm">Be the first to comment!</p>
        </div>
      )}
    </AppLayout>
  );
};

export default PostDetail;
