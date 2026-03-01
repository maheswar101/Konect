import { useState } from "react";
import { ArrowBigUp, ArrowBigDown, MessageCircle, MoreHorizontal, Shield } from "lucide-react";
import { Comment } from "@/types/social";
import { useCreateComment, useVoteComment } from "@/hooks/useComments";
import { toast } from "sonner";

interface CommentThreadProps {
  comment: Comment;
  depth: number;
  style?: React.CSSProperties;
}

const CommentThread = ({ comment, depth, style }: CommentThreadProps) => {
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isDownvoted, setIsDownvoted] = useState(false);
  const [upvotes, setUpvotes] = useState(comment.upvotes);
  const [downvotes, setDownvotes] = useState(comment.downvotes);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const voteCommentMutation = useVoteComment();
  const createCommentMutation = useCreateComment();

  const handleUpvote = async () => {
    if (isDownvoted) { setDownvotes(d => d - 1); setIsDownvoted(false); }
    const next = !isUpvoted;
    setUpvotes(u => isUpvoted ? u - 1 : u + 1);
    setIsUpvoted(next);
    try {
      await voteCommentMutation.mutateAsync({ id: comment.id, type: "upvote", postId: comment.postId });
    } catch (error) {
      setUpvotes(u => next ? u - 1 : u + 1);
      setIsUpvoted(!next);
      toast.error("Failed to update vote");
    }
  };

  const handleDownvote = async () => {
    if (isUpvoted) { setUpvotes(u => u - 1); setIsUpvoted(false); }
    const next = !isDownvoted;
    setDownvotes(d => isDownvoted ? d - 1 : d + 1);
    setIsDownvoted(next);
    try {
      await voteCommentMutation.mutateAsync({ id: comment.id, type: "downvote", postId: comment.postId });
    } catch (error) {
      setDownvotes(d => next ? d - 1 : d + 1);
      setIsDownvoted(!next);
      toast.error("Failed to update vote");
    }
  };

  const handleReplySubmit = async () => {
    const content = replyText.trim();
    if (!content) return;
    try {
      await createCommentMutation.mutateAsync({
        postId: comment.postId,
        parentId: comment.id,
        content,
      });
      setReplyText("");
      setShowReply(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  const formatNumber = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return n.toString();
  };

  const maxDepth = 4;
  const leftPadding = Math.min(depth, maxDepth) * 16;

  return (
    <div style={{ ...style, paddingLeft: `${leftPadding + 16}px` }} className="pr-4">
      {/* Thread line */}
      {depth > 0 && (
        <div
          className="absolute left-0 top-0 bottom-0 w-px bg-border"
          style={{ left: `${leftPadding + 8}px` }}
        />
      )}

      <div className="relative py-3">
        {/* Collapse button for deep threads */}
        {depth > 0 && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -left-3 top-4 w-2 h-2 rounded-full bg-border hover:bg-primary transition-colors"
            title={collapsed ? "Expand" : "Collapse"}
          />
        )}

        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
              comment.author.isAnonymous ? "bg-accent/20 text-accent" : "bg-primary/20 text-primary"
            }`}
          >
            {comment.author.avatar}
          </div>
          <span className="text-sm font-semibold text-foreground">{comment.author.name}</span>
          {comment.author.isAnonymous && <Shield size={12} className="text-accent" />}
          <span className="text-xs text-muted-foreground">{comment.author.handle}</span>
          <span className="text-xs text-muted-foreground">· {comment.timestamp}</span>
          <button className="ml-auto p-1 text-muted-foreground hover:text-foreground rounded transition-colors">
            <MoreHorizontal size={14} />
          </button>
        </div>

        {!collapsed && (
          <>
            {/* Content */}
            <p className="text-sm text-foreground/90 leading-relaxed mb-2 ml-9">{comment.content}</p>

            {/* Actions */}
            <div className="flex items-center gap-3 ml-9">
              <div className="flex items-center gap-0.5">
                <button
                  onClick={handleUpvote}
                  className={`p-1 rounded transition-colors ${
                    isUpvoted ? "text-success" : "text-muted-foreground hover:text-success"
                  }`}
                >
                  <ArrowBigUp size={16} fill={isUpvoted ? "currentColor" : "none"} />
                </button>
                <span className="text-xs font-semibold text-foreground min-w-[20px] text-center">
                  {formatNumber(upvotes - downvotes)}
                </span>
                <button
                  onClick={handleDownvote}
                  className={`p-1 rounded transition-colors ${
                    isDownvoted ? "text-destructive" : "text-muted-foreground hover:text-destructive"
                  }`}
                >
                  <ArrowBigDown size={16} fill={isDownvoted ? "currentColor" : "none"} />
                </button>
              </div>
              <button
                onClick={() => setShowReply(!showReply)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageCircle size={14} />
                Reply
              </button>
            </div>

            {/* Inline reply */}
            {showReply && (
              <div className="ml-9 mt-2 flex items-center gap-2">
                <input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 bg-secondary rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleReplySubmit();
                    }
                    if (e.key === "Escape") setShowReply(false);
                  }}
                />
              </div>
            )}

            {/* Nested replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="relative">
                {comment.replies.map((reply) => (
                  <CommentThread key={reply.id} comment={reply} depth={depth + 1} />
                ))}
              </div>
            )}
          </>
        )}

        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="ml-9 text-xs text-primary hover:text-primary-glow transition-colors"
          >
            Show thread...
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentThread;
