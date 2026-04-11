'use client';
import RouterLink from 'next/link';
import { forwardRef } from 'react';

import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';
import Box, { type BoxProps } from '@mui/material/Box';

import { paths } from 'src/config/paths';

import MiniLogoImage from './mini-logo-image';
import WideLogoImage from './wide-logo-image';

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
  alternativeLink?: string;
  wide?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  (
    { disabledLink = false, alternativeLink, sx, wide = false, ...other },
    ref,
  ) => {
    const theme = useTheme();

    const PRIMARY_MAIN = theme.palette.primary.main;
    const PRIMARY_DARK = theme.palette.text.primary;

    const logo = (
      <Box
        ref={ref}
        component="div"
        sx={{
          width: 55,
          height: 55,
          display: 'inline-flex',
          ml: 2,
          ...sx,
        }}
        {...other}
      >
        {wide ? (
          <WideLogoImage PRIMARY_DARK={PRIMARY_DARK} />
        ) : (
          <MiniLogoImage PRIMARY_MAIN={PRIMARY_MAIN} />
        )}
      </Box>
    );

    if (disabledLink) {
      return logo;
    }

    return (
      <Link
        component={RouterLink}
        href={alternativeLink || paths.dashboard.root}
        sx={{ display: 'contents' }}
      >
        {logo}
      </Link>
    );
  },
);

export default Logo;
