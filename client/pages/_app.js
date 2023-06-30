import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import GlobalStateProvider from 'store/GlobalStateProvider';

import '../styles/globals.css';

const theme = createMuiTheme({
  palette: {
    // type: 'dark',

    primary: {
      main: '#151515',
    },
    secondary: {
      main: '#242424',
      // main: '#cccccc',
      // main: '#4a4a4a',
      // main: '#e6e6e6',
    },
    accent: {
      main: '#0971f1',
      darkContrast: '#0650ab',
    },
    text: {
      main: '#e6e6e6',
      accent: '#565656',
      lightContrast: '#1e1e1e',
    },
  },

  overrides: {
    MuiListItem: {
      root: {
        '&$selected': {
          backgroundColor: '#0971f1',
          '&:hover': {
            backgroundColor: '#0650ab',
          },
        },
      },
    },

    MuiDivider: {
      root: {
        backgroundColor: '#242424',
      },
    },
  },

  appbarHeight: 3.5,
});

function MyApp({ Component, pageProps }) {
  return (
    <GlobalStateProvider>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </GlobalStateProvider>
  );
}

export default MyApp;
