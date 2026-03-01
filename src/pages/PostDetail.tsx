import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import PostCard from "@/components/feed/PostCard";
import CommentThread from "@/components/feed/CommentThread";
import LoadingSpinner from "@/components/LoadingSpinner";
import { usePost } from "@/hooks/usePosts";
import { useComments, useCreateComment } from "@/hooks/useComments";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [replyText, setReplyText] = useState("");

  const { data: post, isLoading: loadingPost, error: postError } = usePost(id || '');
  const { data: comments, isLoading: loadingComments } = useComments(id || '');
  const createCommentMutation = useCreateComment();

  // Auto-focus reply input if navigated with openReply state
  useEffect(() => {
    if (location.state?.openReply) {
      const input = document.querySelector('textarea[placeholder="Write a reply..."]') as HTMLTextAreaElement;
      if (input) {
        setTimeout(() => input.focus(), 100);
      }
    }
  }, [location.state]);

  const handleSubmitReply = async () => {
    if (!replyText.trim()) {
      toast.error("Please write something");
      return;
    }

    if (!user) {
      toast.error("Please sign in to comment");
      navigate('/signin');
      return;
    }

    if (!id) return;

    try {
      await createCommentMutation.mutateAsync({
        postId: id,
        content: replyText.trim(),
        isAnonymous: false,
      });
      setReplyText("");
    } catch (error) {
      // Error is handled by the hook
    }
  };

  if (loadingPost) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <LoadingSpinner text="Loading post..." />
        </div>
      </AppLayout>
    );
  }

  if (postError || !post) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <p className="mb-2">Post not found</p>
          <button 
            onClick={() => navigate(-1)} 
            className="text-primary hover:text-primary-glow transition-colors text-sm font-medium"
          >
            Go back
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-border/50 backdrop-blur-xl">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all hover:scale-105"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-display font-bold text-foreground">Post</h1>
        </div>
      </div>

      {/* Post */}
      <PostCard post={post} />

      {/* Reply input */}
      <div className="px-4 py-4 border-b border-border/50 bg-card/30">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-sm">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.username} className="w-full h-full rounded-xl" />
            ) : (
              user?.username?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          <div className="flex-1">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="w-full bg-secondary/70 rounded-2xl px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground outline-none border border-border/50 focus:border-primary/50 transition-colors resize-none min-h-[80px]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  handleSubmitReply();
                }
              }}
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                Press {navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'} + Enter to post
              </p>
              <button
                onClick={handleSubmitReply}
                disabled={!replyText.trim() || createCommentMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all hover:scale-105 shadow-md"
              >
                {createCommentMutation.isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Reply
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="px-4 py-4">
        <h2 className="font-display font-semibold text-sm text-muted-foreground mb-3">
          {comments && comments.length > 0 
            ? `${comments.length} ${comments.length === 1 ? 'COMMENT' : 'COMMENTS'}` 
            : "NO COMMENTS YET"}
        </h2>
      </div>

      {loadingComments ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="sm" text="Loading comments..." />
        </div>
      ) : comments && comments.length > 0 ? (
        comments.map((comment, i) => (
          <CommentThread
            key={comment.id}
            comment={comment}
            depth={0}
            style={{ animation: `fade-up 0.3s ease-out ${i * 0.05}s both` }}
          />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <p className="text-sm mb-2">Be the first to comment!</p>
          <p className="text-xs text-muted-foreground/70">Share your thoughts on this post</p>
        </div>
      )}
    </AppLayout>
  );
};

export default PostDetail;
