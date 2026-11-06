import { Box, Chip, Divider, Paper, Stack, Typography } from '@mui/material';
import type { CefrLevel } from '../../types/assessment';
import { learningPathFor } from './levelCurriculum';

export function LearningPathCard({ level }: { level: CefrLevel }) {
  const path = learningPathFor(level);
  return <Paper variant="outlined" sx={{ p: 3, boxShadow: 'none' }}><Stack spacing={2}><Box><Typography variant="h6">Your {path.label} learning path</Typography><Typography color="text.secondary">{path.goal}</Typography></Box>{path.modules.map((module, index) => <Box key={module.title}><Stack direction="row" spacing={1} alignItems="center"><Chip label={`Module ${index + 1}`} size="small" color="primary" /><Typography fontWeight={700}>{module.title}</Typography></Stack><Typography sx={{ mt: 1 }}>{module.outcome}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>{module.activities.join(' · ')}</Typography>{index < path.modules.length - 1 && <Divider sx={{ mt: 2 }} />}</Box>)}</Stack></Paper>;
}
