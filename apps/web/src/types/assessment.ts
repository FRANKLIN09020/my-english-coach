export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface AssessmentResult {
  cefrLevel: CefrLevel;
  confidence: number;
  summary: string;
  scores: { grammar: number; vocabulary: number; fluency: number; comprehension: number };
  studyPlan: string;
}

export interface CoachMessage { role: 'assistant' | 'user'; content: string; }
