import Box, { type BoxProps } from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

import SplashAnimation from './splash-animation';

// ----------------------------------------------------------------------

export default function LoadingScreen({
  animation = 'progress',
  sx,
  ...other
}: BoxProps & { animation?: 'progress' | 'animation' }) {
  return (
    <Box
      sx={{
        px: 5,
        width: 1,
        flexGrow: 1,
        minHeight: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx,
      }}
      {...other}
    >
      {animation === 'progress' ? (
        <LinearProgress color="inherit" sx={{ width: 1, maxWidth: 360 }} />
      ) : (
        <SplashAnimation />
      )}
    </Box>
  );
}
