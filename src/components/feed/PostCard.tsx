import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Repeat2, ArrowBigUp, ArrowBigDown, Share, MoreHorizontal, Shield } from "lucide-react";
import { Post } from "@/types/social";
import { useLikePost, useVotePost, useRepost } from "@/hooks/usePosts";
import { toast } from "sonner";

interface PostCardProps {
  post: Post;
  style?: React.CSSProperties;
}

const PostCard = ({ post, style }: PostCardProps) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isUpvoted, setIsUpvoted] = useState(post.isUpvoted);
  const [isDownvoted, setIsDownvoted] = useState(post.isDownvoted);
  const [likes, setLikes] = useState(post.likes);
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [downvotes, setDownvotes] = useState(post.downvotes);
  const [reposts, setReposts] = useState(post.reposts);
  const [isReposted, setIsReposted] = useState(false);

  const likePostMutation = useLikePost();
  const votePostMutation = useVotePost();
  const repostMutation = useRepost();

  useEffect(() => {
    setIsLiked(post.isLiked);
    setIsUpvoted(post.isUpvoted);
    setIsDownvoted(post.isDownvoted);
    setLikes(post.likes);
    setUpvotes(post.upvotes);
    setDownvotes(post.downvotes);
    setReposts(post.reposts);
  }, [post]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIsLiked = !isLiked;
    
    // Optimistic update
    setLikes((l) => (isLiked ? l - 1 : l + 1));
    setIsLiked(newIsLiked);

    try {
      await likePostMutation.mutateAsync({ id: post.id, isLiked });
    } catch (error) {
      // Revert on error
      setLikes((l) => (newIsLiked ? l - 1 : l + 1));
      setIsLiked(!newIsLiked);
      toast.error("Failed to update like");
    }
  };

  const handleUpvote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Optimistic update
    if (isDownvoted) { 
      setDownvotes((d) => d - 1); 
      setIsDownvoted(false); 
    }
    const newIsUpvoted = !isUpvoted;
    setUpvotes((u) => (isUpvoted ? u - 1 : u + 1));
    setIsUpvoted(newIsUpvoted);

    try {
      await votePostMutation.mutateAsync({ id: post.id, type: 'upvote' });
    } catch (error) {
      // Revert on error
      setUpvotes((u) => (newIsUpvoted ? u - 1 : u + 1));
      setIsUpvoted(!newIsUpvoted);
      toast.error("Failed to update vote");
    }
  };

  const handleDownvote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Optimistic update
    if (isUpvoted) { 
      setUpvotes((u) => u - 1); 
      setIsUpvoted(false); 
    }
    const newIsDownvoted = !isDownvoted;
    setDownvotes((d) => (isDownvoted ? d - 1 : d + 1));
    setIsDownvoted(newIsDownvoted);

    try {
      await votePostMutation.mutateAsync({ id: post.id, type: 'downvote' });
    } catch (error) {
      // Revert on error
      setDownvotes((d) => (newIsDownvoted ? d - 1 : d + 1));
      setIsDownvoted(!newIsDownvoted);
      toast.error("Failed to update vote");
    }
  };

  const handleReply = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Navigate to post detail page where user can reply
    navigate(`/post/${post.id}`, { state: { openReply: true } });
  };

  const handleRepost = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isReposted) {
      toast.info("Already reposted");
      return;
    }

    // Optimistic update
    setReposts((r) => r + 1);
    setIsReposted(true);

    try {
      await repostMutation.mutateAsync(post.id);
    } catch (error) {
      // Revert on error
      setReposts((r) => r - 1);
      setIsReposted(false);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const shareData = {
      title: `Post by ${post.author.name}`,
      text: post.content.substring(0, 100) + (post.content.length > 100 ? '...' : ''),
      url: `${window.location.origin}/post/${post.id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error("Failed to share");
      }
    }
  };

  const formatNumber = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return n.toString();
  };

  const typeColors: Record<string, string> = {
    thread: "bg-primary/15 text-primary",
    debate: "bg-accent/15 text-accent",
    poll: "bg-warning/15 text-warning",
    post: "",
  };

  const handlePostClick = () => {
    navigate(`/post/${post.id}`);
  };

  const handleCommunityClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (post.communityId) navigate(`/community/${post.communityId}`);
  };

  return (
    <article
      className="border-b border-border/50 px-4 py-5 hover:bg-card-hover/50 transition-all cursor-pointer group"
      style={style}
      onClick={handlePostClick}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold shadow-sm transition-transform group-hover:scale-105 ${
            post.author.isAnonymous
              ? "bg-gradient-to-br from-accent/30 to-accent/10 text-accent ring-2 ring-accent/20"
              : "bg-gradient-to-br from-primary/30 to-primary/10 text-primary ring-2 ring-primary/20"
          }`}
        >
          {post.author.avatar}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-semibold text-foreground truncate text-sm">{post.author.name}</span>
              {post.author.isAnonymous && <Shield size={14} className="text-accent flex-shrink-0" />}
              <span className="text-muted-foreground text-xs truncate">{post.author.handle}</span>
              <span className="text-muted-foreground text-xs">·</span>
              <span className="text-muted-foreground text-xs flex-shrink-0">{post.timestamp}</span>
            </div>
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/50 transition-all hover:scale-110"
            >
              <MoreHorizontal size={16} />
            </button>
          </div>

          {/* Community & Type */}
          <div className="flex items-center gap-2 mb-2">
            {post.community && (
              <button
                onClick={handleCommunityClick}
                className="text-xs font-medium bg-secondary/70 text-secondary-foreground px-2.5 py-1 rounded-lg hover:bg-primary/15 hover:text-primary transition-all hover:scale-105"
              >
                {post.community}
              </button>
            )}
            {post.type !== "post" && (
              <span className={`text-xs font-medium px-2.5 py-1 rounded-lg capitalize ${typeColors[post.type]}`}>
                {post.type}
              </span>
            )}
          </div>

          {/* Content */}
          <p className="text-foreground text-[15px] leading-relaxed whitespace-pre-line mb-3">{post.content}</p>

          {/* Media placeholder */}
          {post.media && (
            <div className="mb-3 rounded-2xl bg-secondary aspect-video flex items-center justify-center overflow-hidden border border-border/50 group-hover:border-primary/30 transition-colors">
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <span className="text-muted-foreground text-sm">📸 Media</span>
              </div>
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs text-primary hover:text-primary-glow cursor-pointer transition-colors font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            {/* Votes */}
            <div className="flex items-center gap-0.5 bg-secondary/70 rounded-xl px-1 shadow-sm">
              <button
                onClick={handleUpvote}
                disabled={votePostMutation.isPending}
                className={`p-1.5 rounded-lg transition-all hover:scale-110 disabled:opacity-50 ${
                  isUpvoted ? "text-success" : "text-muted-foreground hover:text-success"
                }`}
              >
                <ArrowBigUp size={18} fill={isUpvoted ? "currentColor" : "none"} />
              </button>
              <span className="text-xs font-semibold text-foreground min-w-[32px] text-center">
                {formatNumber(upvotes - downvotes)}
              </span>
              <button
                onClick={handleDownvote}
                disabled={votePostMutation.isPending}
                className={`p-1.5 rounded-lg transition-all hover:scale-110 disabled:opacity-50 ${
                  isDownvoted ? "text-destructive" : "text-muted-foreground hover:text-destructive"
                }`}
              >
                <ArrowBigDown size={18} fill={isDownvoted ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Comments/Reply */}
            <button
              onClick={handleReply}
              className="flex items-center gap-1.5 p-2 text-muted-foreground hover:text-primary rounded-lg transition-all hover:bg-primary/10 hover:scale-110"
              title="Reply to this post"
            >
              <MessageCircle size={17} />
              <span className="text-xs font-medium">{formatNumber(post.comments)}</span>
            </button>

            {/* Repost */}
            <button
              onClick={handleRepost}
              disabled={repostMutation.isPending || isReposted}
              className={`flex items-center gap-1.5 p-2 rounded-lg transition-all hover:scale-110 disabled:opacity-50 ${
                isReposted 
                  ? "text-success bg-success/10" 
                  : "text-muted-foreground hover:text-success hover:bg-success/10"
              }`}
              title={isReposted ? "Already reposted" : "Repost"}
            >
              <Repeat2 size={17} />
              <span className="text-xs font-medium">{formatNumber(reposts)}</span>
            </button>

            {/* Like */}
            <button
              onClick={handleLike}
              disabled={likePostMutation.isPending}
              className={`flex items-center gap-1.5 p-2 rounded-lg transition-all hover:scale-110 disabled:opacity-50 ${
                isLiked ? "text-destructive bg-destructive/10" : "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              }`}
              title={isLiked ? "Unlike" : "Like"}
            >
              <Heart size={17} fill={isLiked ? "currentColor" : "none"} />
              <span className="text-xs font-medium">{formatNumber(likes)}</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-2 text-muted-foreground hover:text-primary rounded-lg transition-all hover:bg-primary/10 hover:scale-110"
              title="Share this post"
            >
              <Share size={17} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
