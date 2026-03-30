import AppShell from "@/components/layout/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { getResults, getDailyLogs } from "@/services/assessmentService";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Moon, Footprints, Brain, Activity } from "lucide-react";

const Dashboard = () => {
  const results = getResults();
  const logs = getDailyLogs();
  const latest = results.length > 0 ? results[results.length - 1] : null;
  const previous = results.length > 1 ? results[results.length - 2] : null;

  const stressTrend = latest && previous ? latest.stressScore - previous.stressScore : 0;
  const wellnessTrend = latest && previous ? latest.wellnessScore - previous.wellnessScore : 0;

  // Generate chart data from last 7 logs or results
  const chartData = results.slice(-7).map((r, i) => ({
    label: `Day ${i + 1}`,
    stress: r.stressScore,
    wellness: r.wellnessScore / 10,
  }));

  return (
    <AppShell title="Dashboard">
      <div className="space-y-5 animate-fade-up">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            icon={Brain}
            label="Stress"
            value={latest?.stressScore ?? "—"}
            unit="/10"
            trend={stressTrend}
            invertTrend
            color="text-info"
          />
          <MetricCard
            icon={Activity}
            label="Wellness"
            value={latest?.wellnessScore ?? "—"}
            unit="/100"
            trend={wellnessTrend}
            color="text-success"
          />
          <MetricCard
            icon={Moon}
            label="Sleep"
            value={
              latest
                ? `${Math.round(latest.categoryScores.sleep * 0.8 + 2)}`
                : "—"
            }
            unit="hrs"
            color="text-primary"
          />
          <MetricCard
            icon={Footprints}
            label="Activity"
            value={
              latest
                ? `${(latest.categoryScores.physical * 1000).toLocaleString()}`
                : "—"
            }
            unit="steps"
            color="text-warning"
          />
        </div>

        {/* Stress Trend Chart (simple bar chart) */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-display font-semibold text-sm mb-4">Stress Trend</h3>
            {chartData.length > 0 ? (
              <div className="flex items-end gap-2 h-32">
                {chartData.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-muted-foreground">{d.stress}</span>
                    <div
                      className={cn(
                        "w-full rounded-t-md transition-all",
                        d.stress <= 3 ? "bg-success" : d.stress <= 6 ? "bg-warning" : "bg-destructive"
                      )}
                      style={{ height: `${(d.stress / 10) * 100}%` }}
                    />
                    <span className="text-[9px] text-muted-foreground">{d.label}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Complete assessments to see trends
              </p>
            )}
          </CardContent>
        </Card>

        {/* Wellness Trend */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-display font-semibold text-sm mb-4">Wellness Trend</h3>
            {chartData.length > 0 ? (
              <div className="flex items-end gap-2 h-32">
                {chartData.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-muted-foreground">
                      {Math.round(d.wellness * 10)}
                    </span>
                    <div
                      className={cn(
                        "w-full rounded-t-md transition-all",
                        d.wellness * 10 >= 70
                          ? "bg-success"
                          : d.wellness * 10 >= 40
                            ? "bg-warning"
                            : "bg-destructive"
                      )}
                      style={{ height: `${d.wellness * 10}%` }}
                    />
                    <span className="text-[9px] text-muted-foreground">{d.label}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Complete assessments to see trends
              </p>
            )}
          </CardContent>
        </Card>

        {/* AI Insights */}
        {latest && (
          <Card className="bg-accent/30">
            <CardContent className="p-4">
              <h3 className="font-display font-semibold text-sm mb-2">🤖 AI Insights</h3>
              <div className="space-y-2 text-sm text-foreground/90">
                {latest.categoryScores.sleep < 5 && (
                  <p>😴 Low sleep quality is likely contributing to higher stress levels.</p>
                )}
                {latest.categoryScores.physical < 5 && (
                  <p>💪 Increasing physical activity could boost your energy and mood.</p>
                )}
                {latest.categoryScores.academic > 7 && latest.categoryScores.mental < 5 && (
                  <p>📚 High academic pressure may be affecting your mental wellness.</p>
                )}
                {latest.stressScore <= 3 && (
                  <p>✨ Great job managing stress! Keep up your healthy habits.</p>
                )}
                {latest.wellnessScore < 40 && (
                  <p>⚠️ Your wellness score is low. Consider following the wellness plan for improvement.</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {!latest && (
          <p className="text-center text-sm text-muted-foreground py-8">
            Take an assessment to see your dashboard metrics and trends.
          </p>
        )}
      </div>
    </AppShell>
  );
};

function MetricCard({
  icon: Icon,
  label,
  value,
  unit,
  trend,
  invertTrend,
  color,
}: {
  icon: typeof Brain;
  label: string;
  value: string | number;
  unit: string;
  trend?: number;
  invertTrend?: boolean;
  color: string;
}) {
  const isPositive = invertTrend ? (trend ?? 0) < 0 : (trend ?? 0) > 0;
  const isNegative = invertTrend ? (trend ?? 0) > 0 : (trend ?? 0) < 0;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Icon className={cn("w-5 h-5", color)} />
          {trend !== undefined && trend !== 0 && (
            <div
              className={cn(
                "flex items-center gap-0.5 text-[10px] font-medium",
                isPositive ? "text-success" : isNegative ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {Math.abs(trend)}
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-display text-xl font-bold text-foreground">
          {value}
          <span className="text-xs font-normal text-muted-foreground ml-1">{unit}</span>
        </p>
      </CardContent>
    </Card>
  );
}

export default Dashboard;
