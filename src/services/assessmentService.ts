import { AssessmentAnswer, AssessmentResult } from '@/types/health';
import { assessmentQuestions } from '@/data/assessmentQuestions';

const RESULTS_KEY = 'medbuddy_assessment_results';
const DAILY_LOGS_KEY = 'medbuddy_daily_logs';

function choiceToScore(value: string, options: string[]): number {
  const idx = options.indexOf(value);
  if (idx === -1) return 5;
  // Map 4 options to 1-10 scale: [2.5, 5, 7.5, 10]
  return Math.round(((idx + 1) / options.length) * 10);
}

function invertScore(score: number): number {
  return 11 - score;
}

export function calculateResults(answers: AssessmentAnswer[]): AssessmentResult {
  const categoryScoresRaw: Record<string, number[]> = {
    mental: [],
    sleep: [],
    physical: [],
    academic: [],
    lifestyle: [],
  };

  // Questions where higher = worse (need inversion for wellness)
  const invertedQuestions = [2, 8, 13, 14, 18];

  for (const answer of answers) {
    const q = assessmentQuestions.find((qq) => qq.id === answer.questionId);
    if (!q) continue;

    let score: number;
    if (q.type === 'slider') {
      score = typeof answer.value === 'number' ? answer.value : parseInt(String(answer.value), 10);
    } else {
      score = choiceToScore(String(answer.value), q.options || []);
    }

    // Invert negative-direction questions for wellness calculation
    const wellnessScore = invertedQuestions.includes(q.id) ? invertScore(score) : score;
    categoryScoresRaw[q.category].push(wellnessScore);
  }

  const categoryScores = {
    mental: avg(categoryScoresRaw.mental),
    sleep: avg(categoryScoresRaw.sleep),
    physical: avg(categoryScoresRaw.physical),
    academic: avg(categoryScoresRaw.academic),
    lifestyle: avg(categoryScoresRaw.lifestyle),
  };

  const wellnessScore = Math.round(
    (categoryScores.mental * 0.25 +
      categoryScores.sleep * 0.2 +
      categoryScores.physical * 0.2 +
      categoryScores.academic * 0.2 +
      categoryScores.lifestyle * 0.15) * 10
  );

  // Stress score: inverse of key stress indicators
  const stressIndicators = answers.filter((a) => [2, 8, 13, 14].includes(a.questionId));
  let stressSum = 0;
  for (const si of stressIndicators) {
    const q = assessmentQuestions.find((qq) => qq.id === si.questionId);
    if (!q) continue;
    if (q.type === 'slider') {
      stressSum += typeof si.value === 'number' ? si.value : 5;
    } else {
      stressSum += choiceToScore(String(si.value), q.options || []);
    }
  }
  const stressScore = Math.round(stressSum / Math.max(stressIndicators.length, 1));

  const riskLevel: 'Low' | 'Medium' | 'High' =
    stressScore >= 7 || wellnessScore < 40
      ? 'High'
      : stressScore >= 5 || wellnessScore < 65
        ? 'Medium'
        : 'Low';

  const aiSummary = generateSummary(categoryScores, stressScore, wellnessScore, riskLevel);

  const result: AssessmentResult = {
    stressScore,
    wellnessScore,
    riskLevel,
    aiSummary,
    categoryScores,
    timestamp: new Date().toISOString(),
  };

  // Save result
  const existing = getResults();
  existing.push(result);
  localStorage.setItem(RESULTS_KEY, JSON.stringify(existing));

  // Save daily log
  saveDailyLog(result);

  return result;
}

function avg(arr: number[]): number {
  if (arr.length === 0) return 5;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function generateSummary(
  cats: AssessmentResult['categoryScores'],
  stress: number,
  wellness: number,
  risk: string
): string {
  const parts: string[] = [];

  if (risk === 'High') {
    parts.push(
      "Your assessment indicates elevated stress levels that need attention. It's important to prioritize self-care right now."
    );
  } else if (risk === 'Medium') {
    parts.push(
      "You're doing okay, but there are some areas that could use improvement. Small changes can make a big difference."
    );
  } else {
    parts.push(
      "Great job! Your overall wellness looks solid. Keep maintaining these healthy habits."
    );
  }

  // Find weakest category
  const catEntries = Object.entries(cats) as [string, number][];
  catEntries.sort((a, b) => a[1] - b[1]);
  const weakest = catEntries[0];
  const catLabels: Record<string, string> = {
    mental: 'mental health',
    sleep: 'sleep quality',
    physical: 'physical activity',
    academic: 'academic balance',
    lifestyle: 'lifestyle habits',
  };

  parts.push(
    `Your ${catLabels[weakest[0]] || weakest[0]} could use the most attention (scored ${Math.round(weakest[1])}/10).`
  );

  if (cats.sleep < 5) {
    parts.push('Consider improving your sleep routine — it impacts everything from mood to focus.');
  }
  if (cats.academic > 7 && cats.mental < 5) {
    parts.push('High academic pressure may be affecting your mental health. Try scheduling regular breaks.');
  }
  if (cats.physical < 5) {
    parts.push('Adding even 20 minutes of daily movement can significantly boost your energy and mood.');
  }

  return parts.join(' ');
}

function saveDailyLog(result: AssessmentResult) {
  const logs = getDailyLogs();
  const today = new Date().toISOString().split('T')[0];
  const existing = logs.findIndex((l) => l.date === today);
  const log = {
    date: today,
    stressScore: result.stressScore,
    wellnessScore: result.wellnessScore,
    sleepHours: Math.round(result.categoryScores.sleep * 0.8 + 2), // approximate
    steps: Math.round(result.categoryScores.physical * 1000),
    goalsCompleted: 0,
    totalGoals: 5,
  };
  if (existing >= 0) {
    logs[existing] = log;
  } else {
    logs.push(log);
  }
  localStorage.setItem(DAILY_LOGS_KEY, JSON.stringify(logs));
}

export function getResults(): AssessmentResult[] {
  try {
    return JSON.parse(localStorage.getItem(RESULTS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function getLatestResult(): AssessmentResult | null {
  const results = getResults();
  return results.length > 0 ? results[results.length - 1] : null;
}

export function getDailyLogs() {
  try {
    return JSON.parse(localStorage.getItem(DAILY_LOGS_KEY) || '[]');
  } catch {
    return [];
  }
}
