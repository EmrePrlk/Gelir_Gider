import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

export type ColorSchema =
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

declare module '@mui/material/styles/createPalette' {
  interface TypeBackground {
    neutral: string;
  }
  interface SimplePaletteColorOptions {
    lighter: string;
    darker: string;
  }
  interface PaletteColor {
    lighter: string;
    darker: string;
  }
}

// SETUP COLORS

export const grey = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
};

export const primary = {
  lighter: '#E6F0F9',
  light: '#4C8BC4',
  main: '#02538E',
  dark: '#013A64',
  darker: '#01243F',
  contrastText: '#FFFFFF',
};

export const secondary = {
  lighter: '#FFF3E0',
  light: '#FFB74D',
  main: '#FF9800',
  dark: '#F57C00',
  darker: '#E65100',
  contrastText: '#000000',
};

export const info = {
  lighter: '#E1F5FE',
  light: '#4FC3F7',
  main: '#03A9F4',
  dark: '#0288D1',
  darker: '#01579B',
  contrastText: '#FFFFFF',
};

export const success = {
  lighter: '#E8F5E9',
  light: '#81C784',
  main: '#4CAF50',
  dark: '#388E3C',
  darker: '#1B5E20',
  contrastText: '#FFFFFF',
};

export const warning = {
  lighter: '#FFF8E1',
  light: '#FFE082',
  main: '#FFC107',
  dark: '#FFA000',
  darker: '#FF6F00',
  contrastText: '#000000',
};

export const error = {
  lighter: '#FFEBEE',
  light: '#EF9A9A',
  main: '#F44336',
  dark: '#D32F2F',
  darker: '#B71C1C',
  contrastText: '#FFFFFF',
};

export const common = {
  black: '#000000',
  white: '#FFFFFF',
};

export const action = {
  hover: alpha(grey[500], 0.08),
  selected: alpha(grey[500], 0.16),
  disabled: alpha(grey[500], 0.8),
  disabledBackground: alpha(grey[500], 0.24),
  focus: alpha(grey[500], 0.24),
  hoverOpacity: 0.08,
  disabledOpacity: 0.48,
};

const base = {
  primary,
  secondary,
  info,
  success,
  warning,
  error,
  grey,
  common,
  divider: alpha(grey[500], 0.2),
  action,
};

// ----------------------------------------------------------------------

export function palette(mode: 'light' | 'dark') {
  const light = {
    ...base,
    mode: 'light',
    text: {
      primary: grey[800],
      secondary: grey[600],
      disabled: grey[500],
    },
    background: {
      paper: '#FFFFFF',
      default: '#FFFFFF',
      neutral: grey[200],
    },
    action: {
      ...base.action,
      active: grey[600],
    },
  };

  const dark = {
    ...base,
    mode: 'dark',
    text: {
      primary: '#FFFFFF',
      secondary: grey[500],
      disabled: grey[600],
    },
    background: {
      paper: grey[800],
      default: grey[900],
      neutral: alpha(grey[500], 0.12),
    },
    action: {
      ...base.action,
      active: grey[500],
    },
  };

  return mode === 'light' ? light : dark;
}
