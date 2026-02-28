import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Repeat2, UserPlus, AtSign, Users, Check } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { mockNotifications, Notification } from "@/data/mockData";

const iconMap: Record<Notification["type"], typeof Heart> = {
  like: Heart,
  comment: MessageCircle,
  repost: Repeat2,
  follow: UserPlus,
  mention: AtSign,
  community: Users,
};

const colorMap: Record<Notification["type"], string> = {
  like: "text-destructive bg-destructive/15",
  comment: "text-primary bg-primary/15",
  repost: "text-success bg-success/15",
  follow: "text-accent bg-accent/15",
  mention: "text-warning bg-warning/15",
  community: "text-primary bg-primary/15",
};

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleClick = (notif: Notification) => {
    setNotifications(notifications.map((n) => (n.id === notif.id ? { ...n, read: true } : n)));
    if (notif.postId) navigate(`/post/${notif.postId}`);
  };

  return (
    <AppLayout>
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold font-display text-gradient">Notifications</h1>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 text-xs text-primary hover:text-primary-glow transition-colors"
            >
              <Check size={14} />
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Unread count */}
      {unreadCount > 0 && (
        <div className="px-4 py-2">
          <span className="text-xs font-medium bg-primary/15 text-primary px-2.5 py-1 rounded-lg">
            {unreadCount} new
          </span>
        </div>
      )}

      {/* Notification list */}
      <div>
        {notifications.map((notif, i) => {
          const Icon = iconMap[notif.type];
          const colorClass = colorMap[notif.type];

          return (
            <button
              key={notif.id}
              onClick={() => handleClick(notif)}
              className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-card-hover border-b border-border ${
                !notif.read ? "bg-primary/5" : ""
              }`}
              style={{ animation: `fade-up 0.3s ease-out ${i * 0.03}s both` }}
            >
              {/* Icon */}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                <Icon size={16} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="w-6 h-6 rounded-lg bg-primary/20 text-primary flex items-center justify-center text-[9px] font-bold flex-shrink-0">
                    {notif.actor.avatar}
                  </div>
                  <span className="text-sm font-semibold text-foreground truncate">{notif.actor.name}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{notif.content}</p>
                <span className="text-xs text-muted-foreground mt-1 block">{notif.timestamp}</span>
              </div>

              {/* Unread dot */}
              {!notif.read && (
                <div className="w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0 mt-2" />
              )}
            </button>
          );
        })}
      </div>
    </AppLayout>
  );
};

export default Notifications;
