import type { CefrLevel } from '../../types/assessment';

export interface LearningModule { title: string; outcome: string; activities: string[]; }
export interface LearningPath { level: CefrLevel; label: string; goal: string; modules: LearningModule[]; }

const paths: Record<CefrLevel, LearningPath> = {
  A1: { level: 'A1', label: 'Starter', goal: 'Build confidence with simple everyday English.', modules: [
    { title: 'Everyday foundations', outcome: 'Introduce yourself, ask basic questions, and use high-frequency words.', activities: ['Greetings and personal details', 'Numbers, time, and places', 'Core vocabulary review'] },
    { title: 'Simple sentences', outcome: 'Use present simple, articles, and basic word order.', activities: ['Short grammar drills', 'Picture descriptions', 'Sentence building'] },
    { title: 'Listen and speak', outcome: 'Understand slow, clear English and reply in short phrases.', activities: ['Mini dialogues', 'Pronunciation practice', 'Guided role-play'] },
    { title: 'Daily habit', outcome: 'Practise 10 minutes a day without feeling overwhelmed.', activities: ['Flashcard review', 'One-minute voice practice', 'Weekly check-in'] }] },
  A2: { level: 'A2', label: 'Elementary', goal: 'Handle familiar routines and short social conversations.', modules: [
    { title: 'Daily life communication', outcome: 'Talk about family, routines, food, travel, and work.', activities: ['Topic vocabulary', 'Useful question patterns', 'Short messages'] },
    { title: 'Past and future', outcome: 'Describe experiences and simple plans clearly.', activities: ['Past simple stories', 'Going to and will', 'Timeline practice'] },
    { title: 'Real-world listening', outcome: 'Follow short instructions and simple videos.', activities: ['Listening snapshots', 'Key-word capture', 'Retelling'] },
    { title: 'Confidence practice', outcome: 'Keep a conversation going for 3–5 minutes.', activities: ['Role-play', 'Daily journal', 'Weekly speaking task'] }] },
  B1: { level: 'B1', label: 'Intermediate', goal: 'Communicate independently at work, study, and travel.', modules: [
    { title: 'Clear communication', outcome: 'Explain opinions, goals, and experiences with connected ideas.', activities: ['Connectors and transitions', 'Opinion speaking', 'Paragraph writing'] },
    { title: 'Grammar control', outcome: 'Use key tenses, modals, and common conditionals more accurately.', activities: ['Targeted corrections', 'Error patterns', 'Rewrite practice'] },
    { title: 'Work and interview English', outcome: 'Handle meetings, emails, and common interview questions.', activities: ['Professional vocabulary', 'Mock interview', 'Email workshop'] },
    { title: 'Fluency routine', outcome: 'Speak for 5–8 minutes with less hesitation.', activities: ['Storytelling', 'Shadowing', 'Weekly coach review'] }] },
  B2: { level: 'B2', label: 'Upper-intermediate', goal: 'Express complex ideas fluently and professionally.', modules: [
    { title: 'Advanced conversation', outcome: 'Discuss abstract topics and support your viewpoint.', activities: ['Debates', 'Nuance vocabulary', 'Argument structure'] },
    { title: 'Professional writing', outcome: 'Write clear reports, proposals, and persuasive emails.', activities: ['Tone practice', 'Editing workshop', 'Structured writing'] },
    { title: 'Fast comprehension', outcome: 'Follow meetings, podcasts, and natural-speed media.', activities: ['Listening strategies', 'Summaries', 'Inference questions'] },
    { title: 'Precision feedback', outcome: 'Reduce recurring grammar and pronunciation errors.', activities: ['Personal error bank', 'Pronunciation clinic', 'Monthly benchmark'] }] },
  C1: { level: 'C1', label: 'Advanced', goal: 'Use flexible, precise English for demanding contexts.', modules: [
    { title: 'Nuance and register', outcome: 'Adapt language for formal, informal, academic, and professional settings.', activities: ['Register shifts', 'Collocations', 'Idiomatic control'] },
    { title: 'Influential communication', outcome: 'Lead discussions and present persuasive, structured arguments.', activities: ['Presentations', 'Negotiation', 'Executive summaries'] },
    { title: 'Critical comprehension', outcome: 'Evaluate complex articles, talks, and contrasting viewpoints.', activities: ['Analysis tasks', 'Evidence synthesis', 'Source comparison'] },
    { title: 'Polished output', outcome: 'Self-edit for clarity, accuracy, and style.', activities: ['Advanced editing', 'Coach feedback', 'Portfolio task'] }] },
  C2: { level: 'C2', label: 'Mastery', goal: 'Communicate with near-native flexibility and control.', modules: [
    { title: 'Masterful expression', outcome: 'Express subtle meanings precisely across topics.', activities: ['Fine distinctions', 'Rhetorical choices', 'Impromptu speaking'] },
    { title: 'High-stakes communication', outcome: 'Handle complex leadership, academic, or specialist situations.', activities: ['Panel discussion', 'Long-form writing', 'Specialist vocabulary'] },
    { title: 'Cultural fluency', outcome: 'Interpret humour, implication, tone, and cultural context.', activities: ['Media analysis', 'Pragmatics', 'Cross-cultural scenarios'] },
    { title: 'Maintain and refine', outcome: 'Keep language sharp through ambitious real-world challenges.', activities: ['Publication-quality editing', 'Mentoring task', 'Mastery review'] }] },
};

export const learningPathFor = (level: CefrLevel) => paths[level];
