import { useState, useEffect } from 'react';

import Box, { type BoxProps } from '@mui/material/Box';

import SplashAnimation from './splash-animation';

// ----------------------------------------------------------------------

export default function SplashScreen({ sx, ...other }: BoxProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Box
      sx={{
        right: 0,
        width: 1,
        bottom: 0,
        height: 1,
        zIndex: 9998,
        display: 'flex',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        ...sx,
      }}
      {...other}
    >
      <SplashAnimation />
    </Box>
  );
}
