import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { assessmentQuestions } from "@/data/assessmentQuestions";
import { AssessmentAnswer } from "@/types/health";
import { calculateResults } from "@/services/assessmentService";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

const categoryColors: Record<string, string> = {
  mental: "text-info",
  sleep: "text-primary",
  physical: "text-success",
  academic: "text-warning",
  lifestyle: "text-secondary",
};

const categoryIcons: Record<string, string> = {
  mental: "🧠",
  sleep: "😴",
  physical: "💪",
  academic: "📚",
  lifestyle: "🌿",
};

const Assessment = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([]);

  const question = assessmentQuestions[currentIndex];
  const total = assessmentQuestions.length;
  const progress = ((currentIndex + 1) / total) * 100;

  const currentAnswer = answers.find((a) => a.questionId === question.id);

  const setAnswer = useCallback(
    (value: number | string) => {
      setAnswers((prev) => {
        const filtered = prev.filter((a) => a.questionId !== question.id);
        return [...filtered, { questionId: question.id, value }];
      });
    },
    [question.id]
  );

  const canProceed = !!currentAnswer;

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      // Submit
      const result = calculateResults(answers);
      navigate("/results", { state: { result } });
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    } else {
      navigate("/");
    }
  };

  return (
    <AppShell title="Wellness Assessment">
      <div className="space-y-6 animate-fade-up">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>
              Question {currentIndex + 1} of {total}
            </span>
            <span className="flex items-center gap-1">
              {categoryIcons[question.category]}
              <span className={cn("capitalize font-medium", categoryColors[question.category])}>
                {question.category}
              </span>
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <h2 className="font-display font-semibold text-lg text-foreground mb-6 leading-relaxed">
              {question.question}
            </h2>

            {question.type === "slider" ? (
              <div className="space-y-6">
                <Slider
                  min={question.min || 1}
                  max={question.max || 10}
                  step={1}
                  value={[
                    typeof currentAnswer?.value === "number"
                      ? currentAnswer.value
                      : (question.min || 1 + (question.max || 10)) / 2,
                  ]}
                  onValueChange={([val]) => setAnswer(val)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{question.labels?.min}</span>
                  <span className="font-display text-2xl font-bold text-primary">
                    {typeof currentAnswer?.value === "number"
                      ? currentAnswer.value
                      : "—"}
                  </span>
                  <span>{question.labels?.max}</span>
                </div>
              </div>
            ) : (
              <div className="grid gap-3">
                {question.options?.map((option) => {
                  const selected = currentAnswer?.value === option;
                  return (
                    <button
                      key={option}
                      onClick={() => setAnswer(option)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium",
                        selected
                          ? "border-primary bg-accent text-accent-foreground"
                          : "border-border bg-card text-foreground hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                            selected ? "border-primary bg-primary" : "border-muted-foreground/30"
                          )}
                        >
                          {selected && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
                        </div>
                        {option}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex-1 h-12 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className="flex-1 h-12 rounded-xl"
          >
            {currentIndex === total - 1 ? "Submit" : "Next"}
            {currentIndex < total - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </AppShell>
  );
};

export default Assessment;
