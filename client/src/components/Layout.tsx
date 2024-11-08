import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Container, Paper } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme/theme';

const Layout = (): JSX.Element => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Outlet />
      </Paper>
    </Container>
  </ThemeProvider>
);

export default Layout;
