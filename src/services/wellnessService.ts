import { WellnessGoal } from '@/types/health';

const GOALS_KEY = 'medbuddy_wellness_goals';
const STREAK_KEY = 'medbuddy_streak';

export function getDefaultGoals(): WellnessGoal[] {
  return [
    {
      id: 'sleep',
      title: 'Sleep Goal',
      description: 'Get 7-8 hours of quality sleep',
      icon: '😴',
      target: 8,
      current: 0,
      unit: 'hours',
      completed: false,
    },
    {
      id: 'steps',
      title: 'Daily Steps',
      description: 'Walk at least 8,000 steps',
      icon: '🚶',
      target: 8000,
      current: 0,
      unit: 'steps',
      completed: false,
    },
    {
      id: 'water',
      title: 'Hydration',
      description: 'Drink 8 glasses of water',
      icon: '💧',
      target: 8,
      current: 0,
      unit: 'glasses',
      completed: false,
    },
    {
      id: 'breaks',
      title: 'Study Breaks',
      description: 'Take 5-minute breaks every hour',
      icon: '⏰',
      target: 4,
      current: 0,
      unit: 'breaks',
      completed: false,
    },
    {
      id: 'mindfulness',
      title: 'Mindfulness',
      description: 'Practice 10 minutes of meditation',
      icon: '🧘',
      target: 10,
      current: 0,
      unit: 'minutes',
      completed: false,
    },
  ];
}

export function getTodayGoals(): WellnessGoal[] {
  const today = new Date().toISOString().split('T')[0];
  const stored = localStorage.getItem(`${GOALS_KEY}_${today}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return getDefaultGoals();
    }
  }
  return getDefaultGoals();
}

export function saveTodayGoals(goals: WellnessGoal[]) {
  const today = new Date().toISOString().split('T')[0];
  localStorage.setItem(`${GOALS_KEY}_${today}`, JSON.stringify(goals));
}

export function updateGoalProgress(goalId: string, increment: number): WellnessGoal[] {
  const goals = getTodayGoals();
  const goal = goals.find((g) => g.id === goalId);
  if (goal) {
    goal.current = Math.min(goal.current + increment, goal.target);
    goal.completed = goal.current >= goal.target;
  }
  saveTodayGoals(goals);
  updateStreak(goals);
  return goals;
}

export function toggleGoalComplete(goalId: string): WellnessGoal[] {
  const goals = getTodayGoals();
  const goal = goals.find((g) => g.id === goalId);
  if (goal) {
    goal.completed = !goal.completed;
    goal.current = goal.completed ? goal.target : 0;
  }
  saveTodayGoals(goals);
  updateStreak(goals);
  return goals;
}

function updateStreak(goals: WellnessGoal[]) {
  const allDone = goals.every((g) => g.completed);
  if (allDone) {
    const streak = getStreak();
    const today = new Date().toISOString().split('T')[0];
    if (streak.lastDate !== today) {
      streak.count += 1;
      streak.lastDate = today;
      localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
    }
  }
}

export function getStreak(): { count: number; lastDate: string } {
  try {
    const stored = localStorage.getItem(STREAK_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { count: 0, lastDate: '' };
}
