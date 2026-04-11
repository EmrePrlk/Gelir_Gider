import { type Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
export function appBar(theme: Theme) {
  return {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
  };
}
