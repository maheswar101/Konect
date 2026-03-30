import { useLocation, useNavigate } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AssessmentResult } from "@/types/health";
import { cn } from "@/lib/utils";
import { MessageCircle, Leaf, RotateCcw, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";

const AssessmentResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = (location.state as { result?: AssessmentResult })?.result;

  if (!result) {
    return (
      <AppShell title="Results">
        <div className="text-center py-12">
          <p className="text-muted-foreground">No results found.</p>
          <Button onClick={() => navigate("/assessment")} className="mt-4">
            Take Assessment
          </Button>
        </div>
      </AppShell>
    );
  }

  const riskConfig = {
    Low: { icon: CheckCircle, color: "text-success", bg: "bg-success/10", border: "border-success/30" },
    Medium: { icon: AlertCircle, color: "text-warning", bg: "bg-warning/10", border: "border-warning/30" },
    High: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30" },
  }[result.riskLevel];

  const RiskIcon = riskConfig.icon;

  return (
    <AppShell title="Your Results">
      <div className="space-y-5 animate-fade-up">
        {/* Risk Level Banner */}
        <Card className={cn("border-2", riskConfig.border, riskConfig.bg)}>
          <CardContent className="p-4 flex items-center gap-4">
            <RiskIcon className={cn("w-10 h-10 shrink-0", riskConfig.color)} />
            <div>
              <p className="text-xs text-muted-foreground">Risk Level</p>
              <p className={cn("font-display text-xl font-bold", riskConfig.color)}>
                {result.riskLevel}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Scores */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Stress Score</p>
              <p
                className={cn(
                  "text-4xl font-display font-bold",
                  result.stressScore <= 3 ? "text-success" : result.stressScore <= 6 ? "text-warning" : "text-destructive"
                )}
              >
                {result.stressScore}
                <span className="text-sm font-normal text-muted-foreground">/10</span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Wellness</p>
              <p
                className={cn(
                  "text-4xl font-display font-bold",
                  result.wellnessScore >= 70 ? "text-success" : result.wellnessScore >= 40 ? "text-warning" : "text-destructive"
                )}
              >
                {result.wellnessScore}
                <span className="text-sm font-normal text-muted-foreground">/100</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-display font-semibold text-sm">Category Breakdown</h3>
            {Object.entries(result.categoryScores).map(([key, val]) => {
              const icons: Record<string, string> = { mental: "🧠", sleep: "😴", physical: "💪", academic: "📚", lifestyle: "🌿" };
              const labels: Record<string, string> = { mental: "Mental Health", sleep: "Sleep", physical: "Physical", academic: "Academic", lifestyle: "Lifestyle" };
              const pct = Math.round(val * 10);
              return (
                <div key={key} className="flex items-center gap-2">
                  <span>{icons[key]}</span>
                  <span className="text-xs w-20 shrink-0">{labels[key]}</span>
                  <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        pct >= 70 ? "bg-success" : pct >= 40 ? "bg-warning" : "bg-destructive"
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-8 text-right">{pct}%</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* AI Summary */}
        <Card className="bg-accent/50">
          <CardContent className="p-4">
            <h3 className="font-display font-semibold text-sm mb-2 flex items-center gap-2">
              🤖 AI Summary
            </h3>
            <p className="text-sm text-foreground/90 leading-relaxed">{result.aiSummary}</p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3 pb-4">
          <Button onClick={() => navigate("/chat")} className="w-full h-12 rounded-xl gap-2">
            <MessageCircle className="w-5 h-5" />
            Talk to AI About Results
          </Button>
          <Button
            onClick={() => navigate("/wellness")}
            variant="outline"
            className="w-full h-12 rounded-xl gap-2 border-secondary/30"
          >
            <Leaf className="w-5 h-5 text-secondary" />
            Start Wellness Plan
          </Button>
          <Button
            onClick={() => navigate("/assessment")}
            variant="ghost"
            className="w-full h-10 gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Retake Assessment
          </Button>
        </div>
      </div>
    </AppShell>
  );
};

export default AssessmentResults;
