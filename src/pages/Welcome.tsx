import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Users, MessageCircle, TrendingUp, Shield } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: MessageCircle,
      title: "Rich Discussions",
      description: "Engage in meaningful conversations with a vibrant community",
    },
    {
      icon: Users,
      title: "Communities",
      description: "Join communities that match your interests and passions",
    },
    {
      icon: TrendingUp,
      title: "Trending Topics",
      description: "Stay updated with what's hot and happening right now",
    },
    {
      icon: Shield,
      title: "Anonymous Mode",
      description: "Share your thoughts freely with optional anonymity",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/10 to-accent/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/50 animate-pulse-glow">
              <Zap className="w-9 h-9 text-white" fill="white" />
            </div>
            <h1 className="text-6xl font-bold font-display text-gradient">Nexus</h1>
          </div>
          
          <p className="text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Where conversations spark, communities thrive, and ideas come to life
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
              className="h-14 px-8 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity font-semibold shadow-xl shadow-primary/30"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/signin")}
              className="h-14 px-8 text-lg border-2 hover:bg-secondary/50"
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="card-elevated p-6 rounded-2xl border border-border/50 hover:border-primary/30 transition-all hover:scale-105 group"
                style={{ animation: `fade-up 0.6s ease-out ${index * 0.1}s both` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { label: "Active Users", value: "50K+" },
            { label: "Communities", value: "1.2K+" },
            { label: "Daily Posts", value: "100K+" },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-2xl glass border border-border/50"
              style={{ animation: `fade-up 0.6s ease-out ${0.6 + index * 0.1}s both` }}
            >
              <div className="text-3xl font-bold text-gradient mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Welcome;
