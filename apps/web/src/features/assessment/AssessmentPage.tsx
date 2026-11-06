import { useState } from 'react';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { Alert, Box, Button, Chip, CircularProgress, Container, LinearProgress, Paper, Stack, TextField, Typography } from '@mui/material';
import { assessmentApi } from '../../services/assessmentApi';
import type { AssessmentResult, CoachMessage } from '../../types/assessment';
import { LearningPathCard } from '../learning/LearningPathCard';

export function AssessmentPage() {
  const [name, setName] = useState('');
  const [sessionId, setSessionId] = useState<string>();
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<AssessmentResult>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  async function begin() {
    if (!name.trim()) return;
    setLoading(true); setError(undefined);
    try { const started = await assessmentApi.start(name); setSessionId(started.sessionId); setMessages([{ role: 'assistant', content: started.message }]); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not start your assessment.'); }
    finally { setLoading(false); }
  }
  async function send() {
    if (!answer.trim() || !sessionId) return;
    const learnerMessage = answer.trim(); setAnswer(''); setMessages((current) => [...current, { role: 'user', content: learnerMessage }]); setLoading(true); setError(undefined);
    try {
      const reply = await assessmentApi.answer(sessionId, learnerMessage);
      setMessages((current) => [...current, { role: 'assistant', content: reply.message }]);
      if (reply.complete && reply.result) setResult(reply.result);
    } catch (e) { setError(e instanceof Error ? e.message : 'Your answer could not be sent.'); }
    finally { setLoading(false); }
  }

  return <Box sx={{ minHeight: '100vh', py: { xs: 3, md: 7 } }}><Container maxWidth="md">
    <Stack spacing={3} alignItems="center" sx={{ mb: 4 }}><Chip icon={<AutoAwesomeRoundedIcon />} label="AI-powered placement" color="primary" variant="outlined" /><Typography variant="h3" textAlign="center">Meet your English coach</Typography><Typography color="text.secondary" textAlign="center" maxWidth={560}>A relaxed conversation helps us understand your real English level and build a plan that fits you.</Typography></Stack>
    {!sessionId ? <Paper sx={{ p: { xs: 3, sm: 5 }, maxWidth: 560, mx: 'auto' }}><Stack spacing={3}><Typography variant="h5">First, what should I call you?</Typography><TextField autoFocus fullWidth label="Your name" helperText="For example: Franklin" inputProps={{ maxLength: 80 }} value={name} onChange={(event) => setName(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && begin()} /><Button size="large" variant="contained" disabled={!name.trim() || loading} onClick={begin}>{loading ? <CircularProgress size={22} color="inherit" /> : 'Start my assessment'}</Button>{error && <Alert severity="error">{error}</Alert>}</Stack></Paper> : result ? <ResultCard result={result} name={name} /> : <Paper sx={{ overflow: 'hidden' }}>
      <Box sx={{ px: 3, py: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}><Typography fontWeight={700}>Your conversation with Coach</Typography><Typography variant="body2" sx={{ opacity: .82 }}>Take your time—there are no trick questions.</Typography></Box>
      <Stack spacing={2} sx={{ p: 3, minHeight: 330 }}>{messages.map((message, index) => <Box key={index} sx={{ alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '82%', px: 2, py: 1.5, borderRadius: 3, bgcolor: message.role === 'user' ? 'primary.main' : 'grey.100', color: message.role === 'user' ? 'primary.contrastText' : 'text.primary' }}><Typography>{message.content}</Typography></Box>)}{loading && <CircularProgress size={22} />}</Stack>
      {error && <Alert severity="error" sx={{ mx: 3 }}>{error}</Alert>}<Stack direction="row" spacing={1} sx={{ p: 3, pt: 2 }}><TextField fullWidth multiline maxRows={4} placeholder="Write your answer…" value={answer} disabled={loading} onChange={(event) => setAnswer(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send(); } }} /><Button variant="contained" disabled={!answer.trim() || loading} onClick={send} aria-label="Send answer"><SendRoundedIcon /></Button></Stack>
    </Paper>}</Container></Box>;
}

function ResultCard({ result, name }: { result: AssessmentResult; name: string }) {
  return <Paper sx={{ p: { xs: 3, sm: 5 }, maxWidth: 680, mx: 'auto' }}><Stack spacing={3}><Box><Typography color="text.secondary">Your current English level</Typography><Typography variant="h2" color="primary.main">{result.cefrLevel}</Typography><Typography>{result.summary}</Typography></Box><Chip label={`${result.confidence}% assessment confidence`} color="secondary" sx={{ alignSelf: 'flex-start' }} /><Box><Typography variant="h6" gutterBottom>Your skill snapshot</Typography>{Object.entries(result.scores).map(([skill, score]) => <Box key={skill} sx={{ mb: 1.5 }}><Stack direction="row" justifyContent="space-between"><Typography sx={{ textTransform: 'capitalize' }}>{skill}</Typography><Typography fontWeight={700}>{score}/100</Typography></Stack><LinearProgress variant="determinate" value={score} sx={{ height: 8, borderRadius: 4 }} /></Box>)}</Box><LearningPathCard level={result.cefrLevel} /><Alert severity="info"><strong>{name}'s coach note:</strong> {result.studyPlan}</Alert><Button variant="contained" size="large">Start module 1</Button></Stack></Paper>;
}
