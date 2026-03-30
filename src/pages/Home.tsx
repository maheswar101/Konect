import { useNavigate } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getLatestResult } from "@/services/assessmentService";
import { Brain, MessageCircle, TrendingUp, Heart, Moon, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const Home = () => {
  const navigate = useNavigate();
  const result = getLatestResult();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const stressColor =
    !result
      ? "text-muted-foreground"
      : result.stressScore <= 3
        ? "text-success"
        : result.stressScore <= 6
          ? "text-warning"
          : "text-destructive";

  const wellnessColor =
    !result
      ? "text-muted-foreground"
      : result.wellnessScore >= 70
        ? "text-success"
        : result.wellnessScore >= 40
          ? "text-warning"
          : "text-destructive";

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-up">
        {/* Greeting */}
        <div className="pt-2">
          <h2 className="font-display text-2xl font-bold text-foreground">
            {greeting}! 👋
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Your AI health companion is here to help
          </p>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mb-1">Stress Score</p>
              <p className={cn("text-3xl font-display font-bold", stressColor)}>
                {result ? result.stressScore : "—"}
                <span className="text-sm font-normal text-muted-foreground">/10</span>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Heart className="w-5 h-5 text-secondary" />
              </div>
              <p className="text-xs text-muted-foreground mb-1">Wellness</p>
              <p className={cn("text-3xl font-display font-bold", wellnessColor)}>
                {result ? result.wellnessScore : "—"}
                <span className="text-sm font-normal text-muted-foreground">/100</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Insights */}
        {result && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-display font-semibold text-sm mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Quick Insights
              </h3>
              <div className="space-y-2">
                {Object.entries(result.categoryScores).map(([key, val]) => {
                  const icons: Record<string, string> = {
                    mental: "🧠",
                    sleep: "😴",
                    physical: "💪",
                    academic: "📚",
                    lifestyle: "🌿",
                  };
                  const labels: Record<string, string> = {
                    mental: "Mental Health",
                    sleep: "Sleep Quality",
                    physical: "Physical Health",
                    academic: "Academic Balance",
                    lifestyle: "Lifestyle",
                  };
                  const pct = Math.round(val * 10);
                  return (
                    <div key={key} className="flex items-center gap-2">
                      <span className="text-sm">{icons[key]}</span>
                      <span className="text-xs text-muted-foreground w-28 shrink-0">
                        {labels[key]}
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            pct >= 70 ? "bg-success" : pct >= 40 ? "bg-warning" : "bg-destructive"
                          )}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium w-8 text-right">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* CTA Buttons */}
        <div className="grid grid-cols-1 gap-3">
          <Button
            onClick={() => navigate("/assessment")}
            className="h-14 text-base font-semibold rounded-2xl bg-primary hover:bg-primary/90 gap-3"
          >
            <ClipboardIcon className="w-5 h-5" />
            Start Assessment
          </Button>
          <Button
            onClick={() => navigate("/chat")}
            variant="outline"
            className="h-14 text-base font-semibold rounded-2xl gap-3 border-primary/30 hover:bg-accent"
          >
            <MessageCircle className="w-5 h-5 text-primary" />
            Talk to AI
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Moon, label: "Sleep Tips", color: "text-info" },
            { icon: Zap, label: "Energy Boost", color: "text-warning" },
            { icon: Heart, label: "Mindfulness", color: "text-destructive" },
          ].map(({ icon: Icon, label, color }) => (
            <Card
              key={label}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate("/chat")}
            >
              <CardContent className="p-3 flex flex-col items-center gap-2">
                <Icon className={cn("w-6 h-6", color)} />
                <span className="text-xs font-medium text-foreground">{label}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {!result && (
          <p className="text-center text-xs text-muted-foreground px-8">
            Take the wellness assessment to get personalized insights and
            recommendations tailored to your student life.
          </p>
        )}
      </div>
    </AppShell>
  );
};

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  );
}

export default Home;
