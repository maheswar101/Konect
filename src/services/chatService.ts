import { ChatMessage } from '@/types/health';
import { getLatestResult } from './assessmentService';

const CHAT_KEY = 'medbuddy_chat_messages';
const API_URL = import.meta.env.VITE_API_BASE_URL || '';

export function getChatMessages(): ChatMessage[] {
  try {
    return JSON.parse(localStorage.getItem(CHAT_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveChatMessages(messages: ChatMessage[]) {
  localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export async function sendMessage(content: string): Promise<ChatMessage> {
  const messages = getChatMessages();
  const userMsg: ChatMessage = {
    id: generateId(),
    role: 'user',
    content,
    timestamp: new Date().toISOString(),
  };
  messages.push(userMsg);
  saveChatMessages(messages);

  let aiResponse: string;

  // Try backend API first
  if (API_URL) {
    try {
      const result = getLatestResult();
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          userData: result
            ? {
                stressScore: result.stressScore,
                wellnessScore: result.wellnessScore,
                riskLevel: result.riskLevel,
                categoryScores: result.categoryScores,
              }
            : null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        aiResponse = data.response || data.message || data.content;
      } else {
        aiResponse = generateLocalResponse(content);
      }
    } catch {
      aiResponse = generateLocalResponse(content);
    }
  } else {
    aiResponse = generateLocalResponse(content);
  }

  const assistantMsg: ChatMessage = {
    id: generateId(),
    role: 'assistant',
    content: aiResponse,
    timestamp: new Date().toISOString(),
  };
  messages.push(assistantMsg);
  saveChatMessages(messages);

  return assistantMsg;
}

function generateLocalResponse(input: string): string {
  const lower = input.toLowerCase();
  const result = getLatestResult();

  if (lower.includes('stress') || lower.includes('anxious') || lower.includes('worried')) {
    const base =
      "I understand you're feeling stressed. That's completely normal for students. Here are some things that can help:\n\n" +
      "**Why it happens:** Academic pressure, social expectations, and irregular sleep can all contribute to stress.\n\n" +
      "**What you can do:**\n" +
      "1. 🧘 Try the 4-7-8 breathing technique (inhale 4s, hold 7s, exhale 8s)\n" +
      "2. 📝 Write down 3 things you're grateful for\n" +
      "3. 🚶 Take a 10-minute walk outside\n" +
      "4. 🎵 Listen to calming music for 15 minutes";
    if (result && result.stressScore > 6) {
      return base + `\n\nBased on your assessment, your stress level is ${result.stressScore}/10. I'd especially recommend the breathing exercise right now.`;
    }
    return base;
  }

  if (lower.includes('sleep') || lower.includes('tired') || lower.includes('insomnia')) {
    return (
      "Sleep is crucial for your wellbeing and academic performance. Let me help!\n\n" +
      "**Common causes for students:** Late-night studying, screen time before bed, irregular schedules, caffeine.\n\n" +
      "**Actionable tips:**\n" +
      "1. 🌙 Set a consistent bedtime (even on weekends)\n" +
      "2. 📱 No screens 30 minutes before sleep\n" +
      "3. ☕ Avoid caffeine after 2 PM\n" +
      "4. 🛏️ Keep your room cool and dark\n" +
      "5. 📖 Try reading a physical book before bed"
    );
  }

  if (lower.includes('exercise') || lower.includes('workout') || lower.includes('fitness')) {
    return (
      "Moving your body is one of the best things you can do for both physical and mental health!\n\n" +
      "**Why it matters:** Exercise releases endorphins, improves focus, and helps you sleep better.\n\n" +
      "**Easy ways to start:**\n" +
      "1. 🚶 Walk 20 minutes between classes\n" +
      "2. 🏋️ Try a 7-minute workout app\n" +
      "3. 🧘 Morning stretching routine (5 mins)\n" +
      "4. 🚴 Bike to campus instead of driving\n" +
      "5. 👯 Join a campus sports club for social exercise"
    );
  }

  if (lower.includes('exam') || lower.includes('study') || lower.includes('grades')) {
    return (
      "Academic pressure is real, but there are strategies to handle it effectively.\n\n" +
      "**Why you might be struggling:** Cramming, lack of breaks, poor time management, perfectionism.\n\n" +
      "**Study smarter:**\n" +
      "1. ⏰ Use the Pomodoro technique (25 min study, 5 min break)\n" +
      "2. 📅 Create a realistic study schedule\n" +
      "3. 🧠 Active recall > passive reading\n" +
      "4. 👥 Form a small study group\n" +
      "5. 😌 Remember: your health matters more than any grade"
    );
  }

  if (lower.includes('diet') || lower.includes('food') || lower.includes('eating') || lower.includes('nutrition')) {
    return (
      "Good nutrition fuels your brain and body. Here's how to eat better on campus:\n\n" +
      "**Quick wins:**\n" +
      "1. 🍎 Keep fruits and nuts as snacks\n" +
      "2. 💧 Drink at least 8 glasses of water daily\n" +
      "3. 🥗 Include vegetables in at least 2 meals\n" +
      "4. 🚫 Limit energy drinks and sugary sodas\n" +
      "5. 🍳 Don't skip breakfast — even something small helps"
    );
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return (
      "Hey there! 👋 I'm MedBuddy, your AI health companion. I'm here to help you stay healthy and balanced during your college journey.\n\n" +
      "You can ask me about:\n" +
      "- 😟 Stress & anxiety management\n" +
      "- 😴 Sleep improvement\n" +
      "- 🏃 Exercise & fitness\n" +
      "- 📚 Study-life balance\n" +
      "- 🥗 Nutrition tips\n\n" +
      "What's on your mind?"
    );
  }

  return (
    "Thanks for sharing that with me! While I'm not a doctor, here's my general guidance:\n\n" +
    "**Understanding the issue:** Many students experience similar concerns. It's important to recognize patterns in your daily habits.\n\n" +
    "**What you can try:**\n" +
    "1. 📓 Keep a journal to track how you feel\n" +
    "2. 🗣️ Talk to a friend or campus counselor\n" +
    "3. ⏰ Set small, achievable daily goals\n" +
    "4. 🌿 Take breaks in nature when possible\n\n" +
    "Would you like to talk more about any specific area? I'm here to help! 💙"
  );
}

export function clearChatHistory() {
  localStorage.removeItem(CHAT_KEY);
}

export const quickReplies = [
  "I'm feeling stressed about exams",
  "How can I sleep better?",
  "I need exercise tips",
  "Help me manage anxiety",
  "Tips for healthy eating",
];
