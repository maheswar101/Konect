import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Repeat2, ArrowBigUp, ArrowBigDown, Share, MoreHorizontal, Shield } from "lucide-react";
import { Post } from "@/data/mockData";

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

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLikes((l) => (isLiked ? l - 1 : l + 1));
    setIsLiked(!isLiked);
  };

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDownvoted) { setDownvotes((d) => d - 1); setIsDownvoted(false); }
    setUpvotes((u) => (isUpvoted ? u - 1 : u + 1));
    setIsUpvoted(!isUpvoted);
  };

  const handleDownvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUpvoted) { setUpvotes((u) => u - 1); setIsUpvoted(false); }
    setDownvotes((d) => (isDownvoted ? d - 1 : d + 1));
    setIsDownvoted(!isDownvoted);
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
      className="border-b border-border px-4 py-4 hover:bg-card-hover transition-colors cursor-pointer"
      style={style}
      onClick={handlePostClick}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold ${
            post.author.isAnonymous
              ? "bg-accent/20 text-accent"
              : "bg-primary/20 text-primary"
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
              <span className="text-muted-foreground text-sm truncate">{post.author.handle}</span>
              <span className="text-muted-foreground text-sm">·</span>
              <span className="text-muted-foreground text-sm flex-shrink-0">{post.timestamp}</span>
            </div>
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-1 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors"
            >
              <MoreHorizontal size={16} />
            </button>
          </div>

          {/* Community & Type */}
          <div className="flex items-center gap-2 mb-2">
            {post.community && (
              <button
                onClick={handleCommunityClick}
                className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-0.5 rounded-lg hover:bg-primary/15 hover:text-primary transition-colors"
              >
                {post.community}
              </button>
            )}
            {post.type !== "post" && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-lg capitalize ${typeColors[post.type]}`}>
                {post.type}
              </span>
            )}
          </div>

          {/* Content */}
          <p className="text-foreground text-sm leading-relaxed whitespace-pre-line mb-3">{post.content}</p>

          {/* Media placeholder */}
          {post.media && (
            <div className="mb-3 rounded-2xl bg-secondary aspect-video flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <span className="text-muted-foreground text-sm">📸 Media</span>
              </div>
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs text-primary hover:text-primary-glow cursor-pointer transition-colors">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            {/* Votes */}
            <div className="flex items-center gap-0.5 bg-secondary rounded-xl px-1">
              <button
                onClick={handleUpvote}
                className={`p-1.5 rounded-lg transition-colors ${
                  isUpvoted ? "text-success" : "text-muted-foreground hover:text-success"
                }`}
              >
                <ArrowBigUp size={18} fill={isUpvoted ? "currentColor" : "none"} />
              </button>
              <span className="text-xs font-semibold text-foreground min-w-[28px] text-center">
                {formatNumber(upvotes - downvotes)}
              </span>
              <button
                onClick={handleDownvote}
                className={`p-1.5 rounded-lg transition-colors ${
                  isDownvoted ? "text-destructive" : "text-muted-foreground hover:text-destructive"
                }`}
              >
                <ArrowBigDown size={18} fill={isDownvoted ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Comments */}
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 p-1.5 text-muted-foreground hover:text-primary rounded-lg transition-colors"
            >
              <MessageCircle size={16} />
              <span className="text-xs">{formatNumber(post.comments)}</span>
            </button>

            {/* Repost */}
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 p-1.5 text-muted-foreground hover:text-success rounded-lg transition-colors"
            >
              <Repeat2 size={16} />
              <span className="text-xs">{formatNumber(post.reposts)}</span>
            </button>

            {/* Like */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 p-1.5 rounded-lg transition-colors ${
                isLiked ? "text-destructive" : "text-muted-foreground hover:text-destructive"
              }`}
            >
              <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
              <span className="text-xs">{formatNumber(likes)}</span>
            </button>

            {/* Share */}
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 text-muted-foreground hover:text-primary rounded-lg transition-colors"
            >
              <Share size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
