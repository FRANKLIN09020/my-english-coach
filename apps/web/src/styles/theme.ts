import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: { mode: 'light', primary: { main: '#4355db' }, secondary: { main: '#0f9a7d' }, background: { default: '#f7f8fc', paper: '#ffffff' } },
  shape: { borderRadius: 16 },
  typography: { fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', h3: { fontWeight: 750 }, h4: { fontWeight: 750 } },
  components: { MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 700, borderRadius: 10 } } }, MuiPaper: { styleOverrides: { root: { boxShadow: '0 12px 36px rgba(29, 39, 102, 0.08)' } } } },
});
