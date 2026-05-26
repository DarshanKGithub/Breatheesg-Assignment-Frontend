import { createTheme } from '@mui/material/styles';

const sharedPalette = {
  primary: {
    main: '#82c7ff',
    contrastText: '#020617',
  },
  secondary: {
    main: '#7c3aed',
    contrastText: '#f8fafc',
  },
};

const sharedTypography = {
  fontFamily: ['Inter', 'system-ui', 'sans-serif'].join(','),
  h3: {
    fontWeight: 700,
    letterSpacing: '-0.03em',
  },
  h5: {
    fontWeight: 600,
  },
};

const sharedComponents = {
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        border: '1px solid rgba(148, 163, 184, 0.12)',
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
      },
    },
  },
};

export default function createAppTheme(mode: 'light' | 'dark') {
  const palette = {
    mode,
    ...sharedPalette,
    background: {
      default: mode === 'dark' ? '#020617' : '#f8fafc',
      paper: mode === 'dark' ? '#0f172a' : '#ffffff',
    },
    text: {
      primary: mode === 'dark' ? '#f8fafc' : '#111827',
      secondary: mode === 'dark' ? '#cbd5e1' : '#475569',
    },
  };

  return createTheme({
    palette,
    typography: sharedTypography,
    components: {
      ...sharedComponents,
      MuiCard: {
        styleOverrides: {
          root: {
            ...sharedComponents.MuiCard.styleOverrides.root,
            backgroundColor: mode === 'dark' ? '#111827' : '#f8fafc',
          },
        },
      },
      MuiTableCell: sharedComponents.MuiTableCell,
    },
  });
}
