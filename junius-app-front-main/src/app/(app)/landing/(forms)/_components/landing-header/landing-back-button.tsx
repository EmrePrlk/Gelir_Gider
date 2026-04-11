import RouterLink from 'next/link';

import { IconButton } from '@mui/material';

import { paths } from 'src/config/paths';

import Iconify from 'src/components/iconify';

export default function LandingBackButton() {
  return (
    <IconButton
      LinkComponent={RouterLink}
      href={paths.landing.root}
      color="inherit"
      sx={{ backgroundColor: 'white' }}
    >
      <Iconify
        width={32}
        height={32}
        icon="carbon:chevron-left"
        color="text.primary"
      />
    </IconButton>
  );
}
