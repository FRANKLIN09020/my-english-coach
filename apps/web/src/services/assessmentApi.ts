import type { AssessmentResult } from '../types/assessment';

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1';

async function request<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(payload?.message || 'Something went wrong. Please try again.');
  }
  return response.json() as Promise<T>;
}

export const assessmentApi = {
  start: (name: string) => request<{ sessionId: string; message: string }>('/assessments', { name }),
  answer: (sessionId: string, answer: string) => request<{ message: string; complete: boolean; result: AssessmentResult | null }>(`/assessments/${sessionId}/answers`, { answer }),
};
