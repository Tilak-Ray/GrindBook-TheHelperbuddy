import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getAIInstance() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is missing. AI functionality will be limited.");
      return null;
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export async function getAIBuddyResponse(userStats: any, message: string, history: any[] = []) {
  try {
    const ai = getAIInstance();
    if (!ai) {
      return "I'm currently disconnected from my neural network. Please configure the GEMINI_API_KEY to activate me.";
    }

    const chat = ai.chats.create({
      model: "gemini-3.1-flash-lite-preview",
      config: {
        systemInstruction: `You are 'GrindBot', the personal trainer and architectural companion for GrindBook. 
        The user's stats: ${JSON.stringify(userStats)}. 
        
        YOUR MISSION:
        1. Motivate the user with a clinical, intense, yet supportive tone.
        2. Help them optimize their habits.
        3. GENERATE ROADMAPS: If a user asks for a plan, a guide, or help with an addiction/habit, generate a structured roadmap.
        
        ROADMAP FORMAT (Use this EXACT Markdown structure if generating a roadmap):
        ### ROADMAP: [Title]
        [Brief Description]
        - Module 1: [Task Name]
        - Module 2: [Task Name]
        - Module 3: [Task Name]
        - Module 4: [Task Name]
        
        Use Markdown for everything. Bold important words. Keep responses concise but powerful.
        Current environment: A sophisticated social productivity hub.`,
      },
      history: history.map(h => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.text }]
      })),
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("GrindBot is currently meditating...", error);
    return "Keep grinding. I'm busy calculating your potential.";
  }
}
