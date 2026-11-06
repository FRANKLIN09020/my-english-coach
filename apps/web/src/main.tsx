import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './styles/theme';
import { AssessmentPage } from './features/assessment/AssessmentPage';

createRoot(document.getElementById('root')!).render(<StrictMode><ThemeProvider theme={theme}><CssBaseline /><AssessmentPage /></ThemeProvider></StrictMode>);
