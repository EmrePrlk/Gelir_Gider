import { memo, forwardRef } from 'react';

import Box from '@mui/material/Box';

import { type ScrollbarProps } from './types';
import { StyledScrollbar, StyledRootScrollbar } from './styles';

// ----------------------------------------------------------------------

const Scrollbar = forwardRef<HTMLDivElement, ScrollbarProps>(
  ({ children, sx, ...other }, ref) => {
    const userAgent =
      typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent;

    const mobile =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent,
      );

    if (mobile) {
      return (
        <Box ref={ref} sx={{ overflow: 'auto', ...sx }} {...other}>
          {children}
        </Box>
      );
    }

    return (
      <StyledRootScrollbar>
        <StyledScrollbar
          scrollableNodeProps={{
            ref,
          }}
          clickOnTrack={false}
          sx={sx}
          {...other}
        >
          {children}
        </StyledScrollbar>
      </StyledRootScrollbar>
    );
  },
);

export default memo(Scrollbar);
