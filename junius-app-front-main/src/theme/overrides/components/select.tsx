import { type Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
export function select(theme: Theme) {
  return {
    MuiSelect: {
      styleOverrides: {
        icon: {
          right: 10,
          width: 18,
          height: 18,
          top: 'calc(50% - 9px)',
        },
      },
    },
    MuiNativeSelect: {
      styleOverrides: {
        icon: {
          right: 10,
          width: 18,
          height: 18,
          top: 'calc(50% - 9px)',
        },
      },
    },
  };
}
