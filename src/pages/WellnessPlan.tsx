import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTodayGoals, toggleGoalComplete, getStreak } from "@/services/wellnessService";
import { WellnessGoal } from "@/types/health";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Flame, Trophy } from "lucide-react";

const WellnessPlan = () => {
  const [goals, setGoals] = useState<WellnessGoal[]>(getTodayGoals);
  const streak = getStreak();
  const completedCount = goals.filter((g) => g.completed).length;
  const totalCount = goals.length;
  const progress = Math.round((completedCount / totalCount) * 100);

  const handleToggle = (id: string) => {
    const updated = toggleGoalComplete(id);
    setGoals(updated);
  };

  return (
    <AppShell title="Wellness Plan">
      <div className="space-y-5 animate-fade-up">
        {/* Streak & Progress */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
            <CardContent className="p-4 text-center">
              <Flame className="w-6 h-6 text-warning mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Streak</p>
              <p className="font-display text-2xl font-bold text-foreground">
                {streak.count}
                <span className="text-sm font-normal text-muted-foreground ml-1">days</span>
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <CardContent className="p-4 text-center">
              <Trophy className="w-6 h-6 text-success mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Today</p>
              <p className="font-display text-2xl font-bold text-foreground">
                {completedCount}/{totalCount}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Daily Progress</span>
              <span className="text-sm font-display font-bold text-primary">{progress}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            {progress === 100 && (
              <p className="text-xs text-success mt-2 text-center font-medium">
                🎉 All goals completed! Amazing work!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Daily Checklist */}
        <div className="space-y-3">
          <h3 className="font-display font-semibold text-sm px-1">Daily Checklist</h3>
          {goals.map((goal) => (
            <Card
              key={goal.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                goal.completed && "bg-success/5 border-success/20"
              )}
              onClick={() => handleToggle(goal.id)}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 w-8 h-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggle(goal.id);
                  }}
                >
                  {goal.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-success" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground/40" />
                  )}
                </Button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{goal.icon}</span>
                    <span
                      className={cn(
                        "font-medium text-sm",
                        goal.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {goal.title}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{goal.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-medium text-foreground">
                    {goal.current}/{goal.target}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{goal.unit}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tips */}
        <Card className="bg-accent/30">
          <CardContent className="p-4">
            <h3 className="font-display font-semibold text-sm mb-2">💡 Daily Tip</h3>
            <p className="text-sm text-foreground/90">
              {tips[new Date().getDay()]}
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
};

const tips = [
  "Sunday: Take a full rest day. Your body and mind need recovery time.",
  "Monday: Start the week with a 5-minute morning stretch routine.",
  "Tuesday: Drink an extra glass of water today — hydration boosts focus!",
  "Wednesday: Midweek check-in: How are you feeling? Journal for 5 minutes.",
  "Thursday: Try the 4-7-8 breathing technique before your next class.",
  "Friday: Celebrate small wins from this week. You deserve it!",
  "Saturday: Spend 30 minutes doing something you love — no screens.",
];

export default WellnessPlan;
